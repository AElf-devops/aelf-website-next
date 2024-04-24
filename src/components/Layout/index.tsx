import React from "react";
import { Button } from "antd";
import Header from '../Header';
import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

 

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
