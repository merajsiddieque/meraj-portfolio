import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.normalized_database_url
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )
    with engine.connect() as conn:
        logger.info(f"Database connection verified.")
except Exception as e:
    logger.warning(f"Could not connect to configured DATABASE_URL ({e}). Falling back to local SQLite database.")
    fallback_url = "sqlite:///./local_portfolio.db"
    engine = create_engine(
        fallback_url,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
