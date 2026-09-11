import os
import re
import json
import logging
from typing import List, Dict, Optional, Any
from pathlib import Path
import pypdf
import httpx
import io
from app.core.config import settings

logger = logging.getLogger(__name__)

CACHE_FILE_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "cached_resumes.json"

class ResumeKnowledgeBase:
    """
    In-memory knowledge base extracted dynamically from Meraj's resume storage bucket.
    Indexes all resume PDFs in the Supabase 'resume' bucket, prioritizing
    'Meraj_Alam_Resume_Main.pdf' as the primary source of truth, while indexing and
    searching across every specialized resume for targeted user queries.
    """
    def __init__(self):
        self.main_resume_name: str = "Meraj_Alam_Resume_Main.pdf"
        self.main_resume_text: str = ""
        self.raw_text: str = ""  # Backwards-compatibility (maps to main resume text)
        self.pages: List[str] = []
        self.chunks: List[str] = []
        self.sections: Dict[str, str] = {}
        
        # Multi-resume storage
        self.resumes: Dict[str, Dict[str, Any]] = {}
        self.all_chunks: List[Dict[str, Any]] = []
        self.is_loaded: bool = False
        self.source_path: Optional[str] = None

    def find_resume_file(self) -> Optional[Path]:
        candidates = []
        if settings.RESUME_PDF_PATH:
            candidates.append(Path(settings.RESUME_PDF_PATH))
        
        # Standard repository locations
        current_dir = Path(__file__).resolve().parent
        backend_dir = current_dir.parent.parent
        repo_root = backend_dir.parent
        
        candidates.extend([
            backend_dir / "data" / "Meraj_Alam_Resume_Main.pdf",
            repo_root / "frontend" / "public" / "resume.pdf",
            backend_dir / "data" / "resume.pdf",
            repo_root / "docs" / "resume.pdf",
            repo_root / "resume.pdf",
            Path("frontend/public/resume.pdf"),
            Path("resume.pdf"),
        ])

        for path in candidates:
            if path.exists() and path.is_file():
                return path
        return None

    def _save_cache(self, cache_data: Dict[str, Any]):
        try:
            CACHE_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(CACHE_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(cache_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved {len(cache_data.get('resumes', {}))} parsed resumes to local cache: {CACHE_FILE_PATH}")
        except Exception as e:
            logger.warning(f"Could not save resumes cache: {e}")

    def _load_cache(self) -> Optional[Dict[str, Any]]:
        if CACHE_FILE_PATH.exists() and CACHE_FILE_PATH.is_file():
            try:
                with open(CACHE_FILE_PATH, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if data and "resumes" in data and len(data["resumes"]) > 0:
                    logger.info(f"Loaded {len(data['resumes'])} resumes from local cache: {CACHE_FILE_PATH}")
                    return data
            except Exception as e:
                logger.warning(f"Could not read resumes cache: {e}")
        return None

    def _chunk_text(self, text: str, chunk_size: int = 350, overlap: int = 40) -> List[str]:
        words = text.split()
        if not words:
            return []
        chunks = []
        i = 0
        while i < len(words):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
            i += max(1, (chunk_size - overlap))
        return chunks

    def _parse_sections(self, text: str) -> Dict[str, str]:
        sections: Dict[str, str] = {
            "Introduction": "",
            "Skills": "",
            "Education": "",
            "Experience": "",
            "Achievements": "",
            "Certifications": "",
            "Projects": ""
        }
        
        lines = text.split("\n")
        current_section = "Introduction"
        buffer: List[str] = []

        header_patterns = {
            "Skills": r"(technical\s+)?skills|technologies|proficiencies",
            "Education": r"education|academic\s+background|university|coursework",
            "Experience": r"experience|work\s+experience|employment|internship",
            "Achievements": r"achievements|honors|awards|recognition",
            "Certifications": r"certifications|credentials|licenses",
            "Projects": r"projects|featured\s+projects|open\s+source"
        }

        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue
            
            matched_header = None
            for sec, pattern in header_patterns.items():
                if re.match(rf"^({pattern})[:\s]*$", line_clean, re.IGNORECASE):
                    matched_header = sec
                    break

            if matched_header:
                if buffer:
                    sections[current_section] = "\n".join(buffer).strip()
                    buffer = []
                current_section = matched_header
            else:
                buffer.append(line_clean)

        if buffer:
            sections[current_section] = "\n".join(buffer).strip()

        return sections

    def _index_resumes_dict(self, resumes_dict: Dict[str, Dict[str, Any]]):
        """Indexes parsed resumes into memory and populates search chunks."""
        self.resumes = resumes_dict
        self.all_chunks = []

        # Find primary resume
        main_key = self.main_resume_name if self.main_resume_name in self.resumes else None
        if not main_key:
            # Fallback to any resume with 'Main' in the filename or the first one
            for k in self.resumes:
                if "main" in k.lower():
                    main_key = k
                    break
        if not main_key and self.resumes:
            main_key = next(iter(self.resumes))

        if main_key and main_key in self.resumes:
            main_item = self.resumes[main_key]
            self.main_resume_text = main_item["text"]
            self.raw_text = self.main_resume_text
            self.pages = main_item.get("pages", [])
            self.chunks = main_item.get("chunks", [])
            self.sections = self._parse_sections(self.main_resume_text)
            self.source_path = main_item.get("source_url") or main_key

        # Populate all chunks tagged with source resume
        for fname, r_data in self.resumes.items():
            chunks = r_data.get("chunks") or self._chunk_text(r_data.get("text", ""))
            r_data["chunks"] = chunks
            for c in chunks:
                self.all_chunks.append({
                    "source": fname,
                    "title": r_data.get("title", fname),
                    "is_main": (fname == main_key),
                    "text": c
                })

        self.is_loaded = len(self.resumes) > 0
        logger.info(f"Indexed {len(self.resumes)} resumes with {len(self.all_chunks)} total search chunks. Primary: '{main_key}'")

    def load_from_pdf(self, pdf_path: Optional[str] = None) -> bool:
        """
        Loads and indexes all resumes from Supabase Storage 'resume' bucket.
        Falls back to local cache or local files if bucket is unreachable.
        """
        # 1. Try fetching live from Supabase Storage bucket
        supabase_url = settings.SUPABASE_URL.strip().rstrip("/")
        api_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY or settings.SUPABASE_ANON_KEY
        
        if supabase_url:
            try:
                headers = {
                    "apikey": api_key,
                    "Authorization": f"Bearer {api_key}"
                } if api_key else {}

                list_url = f"{supabase_url}/storage/v1/object/list/resume"
                with httpx.Client(timeout=15.0) as client:
                    list_res = client.post(list_url, headers=headers, json={"prefix": "", "limit": 100})
                    
                    if list_res.status_code == 200:
                        files = [f["name"] for f in list_res.json() if f.get("name", "").endswith(".pdf")]
                        logger.info(f"Supabase 'resume' bucket returned {len(files)} PDF files: {files}")
                        
                        # Ensure Main resume is prioritized first
                        if self.main_resume_name in files:
                            files.remove(self.main_resume_name)
                            files.insert(0, self.main_resume_name)

                        resumes_dict: Dict[str, Dict[str, Any]] = {}
                        for fname in files:
                            download_url = f"{supabase_url}/storage/v1/object/public/resume/{fname}"
                            file_res = client.get(download_url, headers=headers)
                            if file_res.status_code == 200 and len(file_res.content) > 100:
                                try:
                                    reader = pypdf.PdfReader(io.BytesIO(file_res.content))
                                    extracted_pages = []
                                    for p in reader.pages:
                                        t = (p.extract_text() or "").strip()
                                        if t:
                                            extracted_pages.append(t)
                                    
                                    full_text = "\n\n".join(extracted_pages)
                                    if full_text:
                                        resumes_dict[fname] = {
                                            "filename": fname,
                                            "title": fname.replace(".pdf", "").replace("_", " "),
                                            "source_url": download_url,
                                            "is_main": (fname == self.main_resume_name),
                                            "pages": extracted_pages,
                                            "text": full_text,
                                            "chunks": self._chunk_text(full_text)
                                        }
                                except Exception as pdf_err:
                                    logger.warning(f"Could not parse PDF '{fname}': {pdf_err}")

                        if resumes_dict:
                            self._index_resumes_dict(resumes_dict)
                            self._save_cache({"resumes": resumes_dict})
                            return True
            except Exception as e:
                logger.warning(f"Failed to fetch resumes from Supabase Storage: {e}")

        # 2. Check local JSON cache if Supabase fetch failed or is offline
        cached_data = self._load_cache()
        if cached_data and "resumes" in cached_data and len(cached_data["resumes"]) > 0:
            self._index_resumes_dict(cached_data["resumes"])
            return True

        # 3. Fallback to local PDF file
        file_path = Path(pdf_path) if pdf_path else self.find_resume_file()
        if file_path and file_path.exists():
            try:
                reader = pypdf.PdfReader(str(file_path))
                extracted_pages = [p.extract_text().strip() for p in reader.pages if p.extract_text()]
                full_text = "\n\n".join(extracted_pages)
                if full_text:
                    resumes_dict = {
                        file_path.name: {
                            "filename": file_path.name,
                            "title": file_path.stem.replace("_", " "),
                            "source_url": str(file_path),
                            "is_main": True,
                            "pages": extracted_pages,
                            "text": full_text,
                            "chunks": self._chunk_text(full_text)
                        }
                    }
                    self._index_resumes_dict(resumes_dict)
                    return True
            except Exception as e:
                logger.error(f"Failed to read local resume fallback: {e}")

        self.is_loaded = False
        return False

    def search_resumes(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Searches across EVERY resume in the storage bucket for text chunks
        matching the query keywords, company names, and technical terms.
        """
        if not self.all_chunks:
            return []

        q = query.lower().strip()
        tokens = [
            w for w in re.findall(r'\b[a-zA-Z0-9_\-\.\+#]{2,}\b', q) 
            if w not in {
                "what", "when", "where", "which", "who", "whom", "this", "that", 
                "these", "those", "have", "has", "had", "does", "about", "tell", 
                "show", "give", "with", "from", "your", "meraj", "resume"
            }
        ]
        
        scored_chunks = []
        for item in self.all_chunks:
            chunk_lower = item["text"].lower()
            source_lower = item["source"].lower()
            score = 0.0

            # Exact phrase match bonus
            if len(q) > 4 and q in chunk_lower:
                score += 20.0

            # Source filename match bonus (e.g. asking about "L&T", "Deloitte", "Cognizant", "Juspay", "IndusInd")
            for token in tokens:
                if token in source_lower:
                    score += 12.0
                if token in chunk_lower:
                    cnt = chunk_lower.count(token)
                    score += min(cnt * 2.5, 10.0)

            if score > 0:
                scored_chunks.append({
                    "score": score,
                    "source": item["source"],
                    "title": item["title"],
                    "is_main": item["is_main"],
                    "text": item["text"]
                })

        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]

    def get_resume_context(self, query: Optional[str] = None) -> str:
        """
        Returns structured resume knowledge to be injected as the
        highest-priority context in Ask Meraj prompt.
        Always includes the Primary Resume (Meraj_Alam_Resume_Main.pdf),
        and if a user query is provided, searches across every resume in
        the bucket and appends the top matching excerpts.
        """
        if not self.is_loaded:
            return "No custom resume uploaded yet. Defaulting to verified system profile."

        context_parts = [
            "=== PRIMARY VERIFIED RESUME OF MERAJ ALAM (SOURCE OF TRUTH) ===",
            f"File: {self.main_resume_name}",
            self.main_resume_text or self.raw_text,
            "=== END OF PRIMARY RESUME ==="
        ]

        if query:
            matches = self.search_resumes(query, top_k=4)
            if matches:
                context_parts.append("\n=== TARGETED EXCERPTS SEARCHED ACROSS ALL RESUMES IN STORAGE BUCKET ===")
                for m in matches:
                    context_parts.append(f"[Document: {m['source']}]\n{m['text']}\n")
                context_parts.append("=== END TARGETED EXCERPTS ===")

        return "\n\n".join(context_parts)

    def get_metadata(self) -> dict:
        return {
            "loaded": self.is_loaded,
            "main_resume": self.main_resume_name,
            "total_resumes_indexed": len(self.resumes),
            "resumes_list": list(self.resumes.keys()),
            "total_search_chunks": len(self.all_chunks),
            "detected_sections": [k for k, v in self.sections.items() if v]
        }

# Global singleton instance
resume_kb = ResumeKnowledgeBase()
