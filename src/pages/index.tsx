import microApp from "@micro-zoe/micro-app";
import { useEffect, useState } from "react";

export default function Home() {
  const [show, changeShow] = useState(false);
  useEffect(() => {
    changeShow(true);
  }, []);
  return (
    <>
      {show && (
        <micro-app name="my-app" disable-memory-router url="http://192.168.10.244:9000/"></micro-app>
      )}
    </>
  );
}
