import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export default function Home(props: any) {
  const path = usePathname();
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
          url={`http://192.168.10.244:9000/${pathname}.html`}
        ></micro-app>
      )}
    </>
  );
}
