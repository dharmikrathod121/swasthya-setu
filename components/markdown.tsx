"use client";

import React from "react";

/**
 * Tiny, dependency-free markdown renderer for AI replies.
 *
 * Supports: **bold**, *italic*, `inline code`, ```fenced code```, ### headings,
 * `-` / `*` bullets, `1.` ordered lists, paragraphs and soft line breaks.
 *
 * Everything is built as React elements — no HTML strings, no
 * dangerouslySetInnerHTML — so model output can never inject markup.
 */

interface MarkdownProps {
  text: string;
}

type Block =
  | { kind: "code"; lines: string[] }
  | { kind: "heading"; level: number; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "paragraph"; lines: string[] };

const FENCE_LINE = /^\s*```/;
const HEADING_LINE = /^\s{0,3}(#{1,6})\s+(.*)$/;
const BULLET_LINE = /^\s{0,3}(?:[-*+]|\d{1,3}[.)])\s+(.*)$/;
const ORDERED_LINE = /^\s{0,3}\d{1,3}[.)]\s+(.*)$/;

/** Bold, italic and inline code — code first so `**` is never read as italic. */
const INLINE_TOKEN = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let index = 0;
  INLINE_TOKEN.lastIndex = 0;
  let match = INLINE_TOKEN.exec(text);
  while (match) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index}`;
    index += 1;
    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="md-inline-code" style={INLINE_CODE_STYLE}>
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    cursor = match.index + token.length;
    match = INLINE_TOKEN.exec(text);
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function parseBlocks(text: string): Block[] {
  const lines = (text || "").replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] | null = null;
  let list: { ordered: boolean; items: string[] } | null = null;
  let i = 0;

  const endParagraph = () => {
    if (paragraph) blocks.push({ kind: "paragraph", lines: paragraph });
    paragraph = null;
  };
  const endList = () => {
    if (list) blocks.push({ kind: "list", ordered: list.ordered, items: list.items });
    list = null;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (FENCE_LINE.test(line)) {
      endParagraph();
      endList();
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !FENCE_LINE.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence, or end of text
      if (body.length > 0) blocks.push({ kind: "code", lines: body });
      continue;
    }

    const trimmed = line.trim();
    if (trimmed === "") {
      endParagraph();
      endList();
      i += 1;
      continue;
    }

    const heading = HEADING_LINE.exec(line);
    if (heading) {
      endParagraph();
      endList();
      const value = heading[2].trim().replace(/\s+#+\s*$/, "");
      if (value) blocks.push({ kind: "heading", level: heading[1].length, text: value });
      i += 1;
      continue;
    }

    const item = BULLET_LINE.exec(line);
    if (item) {
      endParagraph();
      const ordered = ORDERED_LINE.test(line);
      if (!list || list.ordered !== ordered) {
        endList();
        list = { ordered, items: [] };
      }
      list.items.push(item[1].trim());
      i += 1;
      continue;
    }

    // Indented continuation of the previous bullet stays inside the list item.
    if (list && /^\s{2,}\S/.test(line)) {
      list.items[list.items.length - 1] = `${list.items[list.items.length - 1]} ${trimmed}`;
      i += 1;
      continue;
    }

    endList();
    if (!paragraph) paragraph = [];
    paragraph.push(trimmed);
    i += 1;
  }

  endParagraph();
  endList();
  return blocks;
}

const ROOT_STYLE: React.CSSProperties = { overflowWrap: "anywhere" };

const HEADING_STYLES: Record<number, React.CSSProperties> = {
  1: { fontSize: "1.02em", margin: "0.6em 0 0.3em" },
  2: { fontSize: "1em", margin: "0.6em 0 0.3em" },
  3: { fontSize: "0.95em", margin: "0.6em 0 0.3em" },
  4: { fontSize: "0.9em", margin: "0.55em 0 0.25em" },
  5: { fontSize: "0.9em", margin: "0.55em 0 0.25em" },
  6: { fontSize: "0.9em", margin: "0.55em 0 0.25em" },
};

const PARAGRAPH_STYLE: React.CSSProperties = { margin: "0 0 0.45em" };
const LIST_STYLE: React.CSSProperties = {
  margin: "0 0 0.45em",
  paddingInlineStart: "1.15rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.15em",
};
const CODE_BLOCK_STYLE: React.CSSProperties = {
  margin: "0 0 0.45em",
  padding: "0.55em 0.7em",
  borderRadius: "8px",
  background: "rgba(15, 23, 42, 0.06)",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  fontSize: "0.82em",
  lineHeight: 1.45,
};
const INLINE_CODE_STYLE: React.CSSProperties = {
  padding: "0.05em 0.3em",
  borderRadius: "4px",
  background: "rgba(15, 23, 42, 0.08)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.9em",
};

function renderBlock(block: Block, key: number): React.ReactNode {
  switch (block.kind) {
    case "code":
      return (
        <pre key={key} className="md-code-block" style={CODE_BLOCK_STYLE}>
          <code>{block.lines.join("\n")}</code>
        </pre>
      );
    case "heading": {
      const level = Math.min(Math.max(block.level, 1), 6);
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={key} className="md-heading" style={HEADING_STYLES[level]}>
          {renderInline(block.text, `b${key}`)}
        </Tag>
      );
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag key={key} className="md-list" style={LIST_STYLE}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `b${key}-i${itemIndex}`)}</li>
          ))}
        </Tag>
      );
    }
    default: {
      // One paragraph: every line becomes a <br />-separated run of inline nodes.
      const children: React.ReactNode[] = [];
      block.lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) children.push(<br key={`b${key}-br${lineIndex}`} />);
        children.push(...renderInline(line, `b${key}-l${lineIndex}`));
      });
      return (
        <p key={key} className="md-paragraph" style={PARAGRAPH_STYLE}>
          {children}
        </p>
      );
    }
  }
}

/** Renders a markdown-ish AI reply as React nodes (never as raw HTML). */
export function Markdown({ text }: MarkdownProps) {
  const blocks = parseBlocks(text);
  if (blocks.length === 0) return null;
  return (
    <div className="md-root" style={ROOT_STYLE}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

export default Markdown;
