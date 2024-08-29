import Script from "next/script";

const GoogleAnalytics = () => (
  <>
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-856H52BH6V"
      strategy="afterInteractive"
      async
    />
    <Script
      id="google-analytics-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-856H52BH6V');
        `,
      }}
    />
  </>
);

export default GoogleAnalytics;
