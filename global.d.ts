// global.d.ts
import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface Window {
  dataLayer: any[];
  hj: (...args: any[]) => void;
  amplitude: {
    init: (apiKey: string, options: any) => void;
    add: (plugin: any) => void;
  };
  sessionReplay?: {
    plugin: (options: {
      sampleRate?: number;
      captureScroll?: boolean;
      onError?: (error: Error) => void;
    }) => any;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "micro-app": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          name?: string;
          url?: string;
          baseroute?: string;
          iframe?: boolean | "";
          inline?: boolean | "";
          destroy?: boolean | "";
          "keep-alive"?: boolean | "";
          "disable-scopecss"?: boolean | "";
          "disable-sandbox"?: boolean | "";
          "disable-memory-router"?: boolean | "";
          ssr?: boolean | "";
          data?: Record<string, unknown>;
        },
        HTMLElement
      >;
    }
  }
}
