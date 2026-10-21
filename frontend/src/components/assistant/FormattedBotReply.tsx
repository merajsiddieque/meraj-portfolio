"use client";

import React from "react";

interface FormattedBotReplyProps {
  content: string;
}

/**
 * Parses inline markdown tokens: [link](url), **bold**, `code`, *italic*
 */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Matches markdown tokens: links, bold, inline code, italics
  const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#426B96] dark:text-blue-400 font-medium underline underline-offset-2 hover:text-[#355A81] dark:hover:text-blue-300 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Bold: **text**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong
          key={index}
          className="font-semibold text-[#0F172A] dark:text-white"
        >
          {boldMatch[1]}
        </strong>
      );
    }

    // Inline code: `code`
    const codeMatch = part.match(/^`(.*?)`$/);
    if (codeMatch) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-white/[0.08] text-[#426B96] dark:text-blue-400 font-mono text-[11px] font-medium border border-[#E2E8F0] dark:border-white/[0.1]"
        >
          {codeMatch[1]}
        </code>
      );
    }

    // Italic: *text*
    const italicMatch = part.match(/^\*(.*?)\*$/);
    if (italicMatch) {
      return (
        <em key={index} className="italic text-[#334155] dark:text-slate-300">
          {italicMatch[1]}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "bullet_list"; items: string[] }
  | { type: "ordered_list"; items: { number: string; text: string }[] }
  | { type: "paragraph"; text: string };

export const FormattedBotReply: React.FC<FormattedBotReplyProps> = ({ content }) => {
  if (!content) return null;

  // Split into raw lines, replacing any CR
  const rawLines = content.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let currentBulletList: string[] = [];
  let currentOrderedList: { number: string; text: string }[] = [];

  const flushLists = () => {
    if (currentBulletList.length > 0) {
      blocks.push({ type: "bullet_list", items: [...currentBulletList] });
      currentBulletList = [];
    }
    if (currentOrderedList.length > 0) {
      blocks.push({ type: "ordered_list", items: [...currentOrderedList] });
      currentOrderedList = [];
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      flushLists();
      continue;
    }

    // Heading: ### or ## or #
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushLists();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      continue;
    }

    // Bullet list: -, *, or literal bullet characters
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (currentOrderedList.length > 0) flushLists();
      currentBulletList.push(bulletMatch[1]);
      continue;
    }

    // Ordered list: 1. or 2.
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (currentBulletList.length > 0) flushLists();
      currentOrderedList.push({
        number: orderedMatch[1],
        text: orderedMatch[2],
      });
      continue;
    }

    // Normal paragraph line
    flushLists();
    blocks.push({ type: "paragraph", text: line });
  }

  flushLists();

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-[#334155] dark:text-slate-300 font-sans break-words">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <h4
              key={idx}
              className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white pt-1 tracking-tight"
            >
              {parseInlineMarkdown(block.text)}
            </h4>
          );
        }

        if (block.type === "bullet_list") {
          return (
            <ul key={idx} className="space-y-2 my-1 pl-0.5">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#426B96] dark:bg-blue-400 shrink-0 mt-2" />
                  <div className="flex-1 min-w-0">
                    {parseInlineMarkdown(item)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered_list") {
          return (
            <ol key={idx} className="space-y-2.5 my-1 pl-0.5">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-[#426B96] dark:text-blue-400 text-[10px] font-bold shrink-0 mt-0.5">
                    {item.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    {parseInlineMarkdown(item.text)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
};
