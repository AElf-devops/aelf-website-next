declare module "@editorjs/header";
declare module "@editorjs/image";
declare module "@editorjs/code";
declare module "@editorjs/nested-list";
declare module "@editorjs/raw";
declare module "@editorjs/link";
declare module "@editorjs/inline-code";
declare module "@editorjs/delimiter";
declare module "lodash/debounce";
// global.d.ts
interface Window {
  dataLayer: any[];
  hj: (...args: any[]) => void;
}
