"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders AI/assistant markdown (bold, headings, lists, tables, code). */
export function Markdown({ text }: { text: string }) {
  return (
    <div style={{ overflowWrap: "anywhere" }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
