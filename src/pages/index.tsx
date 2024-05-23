import { useConfig } from "@/contexts/useConfig/hooks";
import { useEffect, useState } from "react";

export default function Home() {
  const { isMobile } = useConfig();
  const url = isMobile
    ? "http://localhost:9001"
    : "http://192.168.11.178:9000/";

  const [show, changeShow] = useState(false);
  useEffect(() => {
    changeShow(true);
  }, []);

  return (
    <>
      {show && (
          <micro-app name="my-app" ssr disable-memory-router url={url}></micro-app>
      )}
    </>
  );
}
