declare module "markdown-it-abbr";
declare module "markdown-it-container";
declare module "markdown-it-deflist";
declare module "markdown-it-footnote";
declare module "markdown-it-ins";
declare module "markdown-it-mark";
declare module "markdown-it-sub";
declare module "markdown-it-sup";

declare module "markdown-it-emoji" {
  import type MarkdownIt from "markdown-it";

  export const bare: (md: MarkdownIt) => void;
  export const full: (md: MarkdownIt) => void;
  export const light: (md: MarkdownIt) => void;
}
