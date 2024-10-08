import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { GTM_ID } from "@/constants";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/Poppins-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Poppins-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Poppins-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <Script
          src="https://cdn.botpress.cloud/webchat/v2.1/inject.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://mediafiles.botpress.cloud/31eff7e5-2a99-49db-9294-10d5ee389efe/webchat/v2.1/config.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe
                src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                height="0"
                width="0"
                style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
