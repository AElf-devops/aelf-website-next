import ConfigProvider from "@/contexts/useConfig";
import { useConfig } from "@/contexts/useConfig/hooks";
import "@/styles/globals.scss";
import NextApp from "next/app";
import { useRouter } from "next/router";
import { userAgent } from "next/server";
import Head from "next/head";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import microApp from "@micro-zoe/micro-app";
import GoogleTagManager from "@/components/GoogleTagManager";
import CommonFooter from "@/components/CommonFooter";
import CommonHeader from "@/components/CommonHeader";
import { BREAKPOINTS, DeviceWidthType } from "@/constants/breakpoints";
import { GTM_ID, PAGE_METADATA } from "@/constants";
import getUrlConfig from "@/constants/network/cms";

const urlConfig = getUrlConfig();

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

function ComponentContainer({ Component, pageProps }: any) {
  const [initialized, setInitialized] = useState(false);
  const [_, dispatch] = useConfig();

  const router = useRouter();

  const pageMeta =
    Object.values(PAGE_METADATA).find((meta) => meta.PATH === router.asPath) ||
    PAGE_METADATA.LANDING;

  useEffect((): any => {
    if (typeof window === "undefined") return;

    const resize = () => {
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
    };

    resize();
    window.addEventListener("resize", resize);
    setInitialized(true);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [dispatch]);

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
        <title>{pageMeta.TITLE}</title>
        <meta name="description" content={pageMeta.DESCRIPTION} />
        <meta property="og:title" content={pageMeta.TITLE} />
        <meta property="og:description" content={pageMeta.DESCRIPTION} />
        <meta property="og:url" content={`${urlConfig.aelf}${router.asPath}`} />
        <meta property="og:type" content="website" />
      </Head>
      <CommonHeader />
      <Component {...pageProps} />
      <CommonFooter />
    </>
  );
}

export default function App({ Component, pageProps, isMobile }: any) {
  useEffect(() => {
    microApp.start();
  }, []);
  return (
    <ConfigProvider init={{ isMobile }}>
      <GoogleTagManager gtmId={GTM_ID} />
      <ComponentContainer Component={Component} pageProps={pageProps} />
    </ConfigProvider>
  );
}

App.getInitialProps = async (props: any): Promise<any> => {
  const initialProps = await NextApp.getInitialProps(props);

  const { ctx } = props;
  const _userAgent =
    typeof window === "undefined"
      ? ctx.req.headers["user-agent"]
      : window.navigator.userAgent;

  const { device } = userAgent({
    headers: {
      get: (key: string) => _userAgent,
      append: function (name: string, value: string): void {
        throw new Error("Function not implemented.");
      },
      delete: function (name: string): void {
        throw new Error("Function not implemented.");
      },
      getSetCookie: function (): string[] {
        throw new Error("Function not implemented.");
      },
      has: function (name: string): boolean {
        throw new Error("Function not implemented.");
      },
      set: function (name: string, value: string): void {
        throw new Error("Function not implemented.");
      },
      forEach: function (
        callbackfn: (value: string, key: string, parent: Headers) => void,
        thisArg?: any
      ): void {
        throw new Error("Function not implemented.");
      },
      entries: function (): IterableIterator<[string, string]> {
        throw new Error("Function not implemented.");
      },
      keys: function (): IterableIterator<string> {
        throw new Error("Function not implemented.");
      },
      values: function (): IterableIterator<string> {
        throw new Error("Function not implemented.");
      },
      [Symbol.iterator]: function (): IterableIterator<[string, string]> {
        throw new Error("Function not implemented.");
      },
    },
  });
  const isMobile = device.type === "mobile" ? true : false;

  return { isMobile, ...initialProps };
};
