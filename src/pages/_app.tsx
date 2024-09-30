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
        id="website-structured-data-script"
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
      {/* Amplitude */}
      <Script
        id="amplitude-script"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
              !function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[],_iq:{}};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var n=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,r){return function(n){e._q.push({name:t,args:Array.prototype.slice.call(r,0),resolve:n})}},o=function(e,t,r){e[t]=function(){if(r)return{promise:new Promise(s(e,t,Array.prototype.slice.call(arguments)))}}},i=function(e){for(var t=0;t<m.length;t++)o(e,m[t],!1);for(var r=0;r<y.length;r++)o(e,y[r],!0)};r.invoked=!0;var a=t.createElement("script");a.type="text/javascript",a.crossOrigin="anonymous",a.src="https://cdn.amplitude.com/libs/plugin-ga-events-forwarder-browser-0.3.4-min.js.gz",a.onload=function(){e.gaEventsForwarder&&e.gaEventsForwarder.plugin&&e.amplitude.add(e.gaEventsForwarder.plugin())};var c=t.createElement("script");c.type="text/javascript",c.integrity="sha384-pY2pkwHaLM/6UIseFHVU3hOKr6oAvhLcdYkoRZyaMDWLjpM6B7nTxtOdE823WAOQ",c.crossOrigin="anonymous",c.async=!0,c.src="https://cdn.amplitude.com/libs/analytics-browser-2.11.0-min.js.gz",c.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var u=t.getElementsByTagName("script")[0];u.parentNode.insertBefore(a,u),u.parentNode.insertBefore(c,u);for(var p=function(){return this._q=[],this},d=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],l=0;l<d.length;l++)n(p,d[l]);r.Identify=p;for(var g=function(){return this._q=[],this},v=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],f=0;f<v.length;f++)n(g,v[f]);r.Revenue=g;var m=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset","extendSession"],y=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];i(r),r.createInstance=function(e){return r._iq[e]={_q:[]},i(r._iq[e]),r._iq[e]},e.amplitude=r}}(window,document)}();

              amplitude.init('7652218546e8f6cc3d045e43a68830f6');
            `,
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
