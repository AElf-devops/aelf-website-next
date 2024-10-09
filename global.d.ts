// global.d.ts
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
