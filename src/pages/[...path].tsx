import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useConfig } from "@/contexts/useConfig/hooks";

export default function Home(props: any) {
  const path = usePathname();
  const { isMobile } = useConfig();

  console.log()

  const url = isMobile
    ? "http://localhost:9001/"
    : "http://192.168.10.26:9000/"

  const pathname = useMemo(() => {
    const pathArr = path.split("/") || [];
    return pathArr[1] || "";
  }, [path]);

  const [show, changeShow] = useState(false);

  useEffect(() => {
    changeShow(true);
  }, []);

  return (
    <>
      {show && pathname && (
        <micro-app
          name="my-appc"
          disable-memory-router
          url={`${url}${pathname}.html`}
        ></micro-app>
      )}
    </>
  );
}
