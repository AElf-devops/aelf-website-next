/* eslint-disable @next/next/no-img-element */
import MarkdownIt from "markdown-it";
import markdownItAbbr from "markdown-it-abbr";
import markdownItContainer from "markdown-it-container";
import markdownItDeflist from "markdown-it-deflist";
import { full as markdownItEmoji } from "markdown-it-emoji";
import markdownItFootnote from "markdown-it-footnote";
import markdownItIns from "markdown-it-ins";
import markdownItMark from "markdown-it-mark";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import React, { ReactNode } from "react";
import sanitizeHtml from "sanitize-html";
import { TBlogContent } from "@/types/blog";

const HTML_CONTENT_PATTERN =
  /<\/?(p|h[1-6]|ul|ol|li|a|strong|em|img|blockquote|br|div|span)\b/i;
const HTML_START_PATTERN =
  /^\s*<(p|h[1-6]|ul|ol|li|a|strong|em|img|blockquote|br|div|span)\b/i;
const MARKDOWN_SIGNAL_PATTERN =
  /(^|\n)\s{0,3}(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+|`{3,}|~{3,}|\|.*\|)|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|~~[\s\S]+~~|==[\s\S]+==|\+\+[\s\S]+\+\+|\[\^[^\]]+\]/m;

export type TBlogContentFormat = "blocks" | "html" | "markdown";

const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
})
  .use(markdownItAbbr)
  .use(markdownItDeflist)
  .use(markdownItFootnote)
  .use(markdownItIns)
  .use(markdownItMark)
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItEmoji);

["info", "note", "tip", "warning", "danger"].forEach((name) => {
  markdownRenderer.use(markdownItContainer, name);
});

const SANITIZE_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "abbr",
    "caption",
    "code",
    "dd",
    "del",
    "dl",
    "dt",
    "div",
    "figcaption",
    "figure",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "img",
    "ins",
    "mark",
    "pre",
    "section",
    "span",
    "sub",
    "sup",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
    "u",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["class", "id"],
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
    code: ["class"],
    th: ["align", "colspan", "rowspan"],
    td: ["align", "colspan", "rowspan"],
    abbr: ["title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
};

function renderText(children: any[] = []) {
  return children.map((child, index) => {
    let node: ReactNode = child.text || "";
    if (child.code) node = <code key={index}>{node}</code>;
    if (child.bold) node = <strong key={index}>{node}</strong>;
    if (child.italic) node = <em key={index}>{node}</em>;
    if (child.underline) node = <u key={index}>{node}</u>;
    if (child.strikethrough) node = <del key={index}>{node}</del>;
    return <span key={index}>{node}</span>;
  });
}

function renderBlock(block: any, index: number): ReactNode {
  const children = renderText(block.children);

  switch (block.type) {
    case "heading": {
      const level = Math.min(Math.max(Number(block.level) || 2, 2), 4);
      const Heading = `h${level}` as keyof JSX.IntrinsicElements;
      return <Heading key={index}>{children}</Heading>;
    }
    case "list": {
      const List = block.format === "ordered" ? "ol" : "ul";
      return (
        <List key={index}>
          {(block.children || []).map((item: any, itemIndex: number) => (
            <li key={itemIndex}>{renderText(item.children)}</li>
          ))}
        </List>
      );
    }
    case "quote":
      return <blockquote key={index}>{children}</blockquote>;
    default:
      return <p key={index}>{children}</p>;
  }
}

function renderMarkdownContent(content: string) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(
          markdownRenderer.render(content),
          SANITIZE_HTML_OPTIONS
        ),
      }}
    />
  );
}

export function getBlogContentFormat(content: TBlogContent): TBlogContentFormat {
  if (typeof content !== "string") {
    return "blocks";
  }

  const isLegacyHtml =
    HTML_START_PATTERN.test(content) &&
    HTML_CONTENT_PATTERN.test(content) &&
    !MARKDOWN_SIGNAL_PATTERN.test(content);

  return isLegacyHtml ? "html" : "markdown";
}

export function renderBlogContent(content: TBlogContent) {
  if (typeof content === "string") {
    if (getBlogContentFormat(content) === "markdown") {
      return renderMarkdownContent(content);
    }

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <>{content.map(renderBlock)}</>;
}
