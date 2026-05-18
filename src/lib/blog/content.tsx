/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import { TBlogContent } from "@/types/blog";

const HTML_CONTENT_PATTERN =
  /<\/?(p|h[1-6]|ul|ol|li|a|strong|em|img|blockquote|br|div|span)\b/i;

function isSafeUrl(url: string) {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url);
}

function renderText(children: any[] = []) {
  return children.map((child, index) => {
    let node: ReactNode = child.text || "";
    if (child.bold) node = <strong key={index}>{node}</strong>;
    if (child.italic) node = <em key={index}>{node}</em>;
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

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const key = `${keyPrefix}-${index}`;
    if (match[1] !== undefined) {
      const src = match[2].trim();
      if (isSafeUrl(src)) {
        nodes.push(<img src={src} alt={match[1]} key={key} />);
      }
    } else if (match[3] !== undefined) {
      const href = match[4].trim();
      nodes.push(
        isSafeUrl(href) ? (
          <a href={href} key={key}>
            {match[3]}
          </a>
        ) : (
          match[3]
        )
      );
    } else if (match[5] !== undefined) {
      nodes.push(<strong key={key}>{match[5]}</strong>);
    } else if (match[6] !== undefined) {
      nodes.push(<em key={key}>{match[6]}</em>);
    }

    lastIndex = pattern.lastIndex;
    index += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderMarkdownList(
  lines: string[],
  startIndex: number,
  ordered: boolean
): { node: ReactNode; nextIndex: number } {
  const items: string[] = [];
  let index = startIndex;
  const pattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;

  while (index < lines.length) {
    const match = lines[index].match(pattern);
    if (!match) break;
    items.push(match[1]);
    index += 1;
  }

  const List = ordered ? "ol" : "ul";
  return {
    node: (
      <List key={startIndex}>
        {items.map((item, itemIndex) => (
          <li key={itemIndex}>
            {renderInlineMarkdown(item, `${startIndex}-${itemIndex}`)}
          </li>
        ))}
      </List>
    ),
    nextIndex: index,
  };
}

function renderMarkdownContent(content: string) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(Math.max(heading[1].length, 1), 6);
      const Heading = `h${level}` as keyof JSX.IntrinsicElements;
      nodes.push(
        <Heading key={index}>
          {renderInlineMarkdown(heading[2], `heading-${index}`)}
        </Heading>
      );
      index += 1;
      continue;
    }

    if (/^>\s+/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s+/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s+/, ""));
        index += 1;
      }
      nodes.push(
        <blockquote key={index}>
          {renderInlineMarkdown(quoteLines.join(" "), `quote-${index}`)}
        </blockquote>
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const { node, nextIndex } = renderMarkdownList(lines, index, false);
      nodes.push(node);
      index = nextIndex;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const { node, nextIndex } = renderMarkdownList(lines, index, true);
      nodes.push(node);
      index = nextIndex;
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^>\s+/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    nodes.push(
      <p key={index}>
        {renderInlineMarkdown(paragraphLines.join(" "), `paragraph-${index}`)}
      </p>
    );
  }

  return <>{nodes}</>;
}

export function renderBlogContent(content: TBlogContent) {
  if (typeof content === "string") {
    if (!HTML_CONTENT_PATTERN.test(content)) {
      return renderMarkdownContent(content);
    }

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <>{content.map(renderBlock)}</>;
}
