import ConfigProvider from "@/contexts/useConfig";
import "@/styles/globals.scss";
import NextApp from "next/app";
import { userAgent } from "next/server";
import React from "react";

export default function App({ Component, pageProps, isMobile }: any) {
  return (
    <ConfigProvider init={{ isMobile: isMobile }}>
      <Component {...pageProps} />
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
