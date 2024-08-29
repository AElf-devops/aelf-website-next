import ConfigProvider from "@/contexts/useConfig";
import { useConfig } from "@/contexts/useConfig/hooks";
import { useRouter } from "next/router";
import Head from "next/head";
import "antd/dist/antd.css";
import "@/styles/globals.scss";
import React, { useCallback, useEffect, useState } from "react";
import microApp from "@micro-zoe/micro-app";
import dynamic from "next/dynamic";
import { BREAKPOINTS, DeviceWidthType } from "@/constants/breakpoints";
import { GTM_ID } from "@/constants";
import Script from "next/script";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";

const GoogleTagManager = dynamic(
  () => import("@/components/GoogleTagManager"),
  {
    ssr: false,
  }
);

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), {
  ssr: false,
});

const Hotjar = dynamic(() => import("@/components/Hotjar"), {
  ssr: false,
});

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

function ComponentContainer({ Component, pageProps }: any) {
  const [initialized, setInitialized] = useState(false);
  const [_, dispatch] = useConfig();

  const router = useRouter();

  const resize = useCallback(() => {
    if (window.innerWidth >= BREAKPOINTS.MD) {
      dispatch({
        type: "UPDATE_CONFIG",
        payload: { deviceWidthType: DeviceWidthType.DESKTOP },
      });
    } else if (window.innerWidth >= BREAKPOINTS.SM) {
      dispatch({
        type: "UPDATE_CONFIG",
        payload: { deviceWidthType: DeviceWidthType.TABLET },
      });
    } else {
      dispatch({
        type: "UPDATE_CONFIG",
        payload: { deviceWidthType: DeviceWidthType.MOBILE },
      });
    }
  }, [dispatch]);

  useEffect((): any => {
    if (typeof window === "undefined") return;
    resize();
    window.addEventListener("resize", resize);
    setInitialized(true);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScrollTo = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
              );
            }, 200);
          }
        }, 300);
      } else {
        window.scrollTo(0, 0);
      }
    };
    setTimeout(handleScrollTo, 500);
    router.events.on("routeChangeComplete", handleScrollTo);
    router.events.on("hashChangeComplete", handleScrollTo);
    return () => {
      router.events.off("routeChangeComplete", handleScrollTo);
      router.events.off("hashChangeComplete", handleScrollTo);
    };
  }, [router.events]);

  if (!initialized) {
    return null;
  }

  return (
    <>
      <Head>
        {isProduction ? (
          <link rel="canonical" href={`https://aelf.com${router.asPath}`} />
        ) : (
          <meta name="robots" content="noindex" />
        )}
      </Head>
      <Script
        id="structured-data-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "aelf",
            alternateName: "aelf",
            url: "https://aelf.com",
          }),
        }}
      />
      <CommonHeader />
      <Component {...pageProps} />
      <CommonFooter />
    </>
  );
}

export default function App({ Component, pageProps }: any) {
  useEffect(() => {
    microApp.start();
  }, []);
  return (
    <ConfigProvider>
      <GoogleTagManager gtmId={GTM_ID} />
      <GoogleAnalytics />
      <Hotjar />
      <ComponentContainer Component={Component} pageProps={pageProps} />
    </ConfigProvider>
  );
}
