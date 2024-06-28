import { useEffect } from "react";
import Script from "next/script";

const GoogleTagManager = ({ gtmId }: { gtmId: string }) => {
  useEffect(() => {
    if (!window?.dataLayer) {
      window.dataLayer = [];
    }
    window?.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    const gtmScript = document.createElement("script");
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    gtmScript.async = true;
    document.head.appendChild(gtmScript);
  }, [gtmId]);

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
};

export default GoogleTagManager;
