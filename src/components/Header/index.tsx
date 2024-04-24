import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Menu, MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useConfig } from "@/contexts/useConfig/hooks";
import { PcMenu } from "../Menu";

function recursiveMenu(data: any) {
  return data.map((item: any) => {
    if (item.children?.length > 0) {
      item.children = recursiveMenu(item.children);
      delete item.order;
      return {
        ...item,
        key: item.path,
      };
    } else {
      delete item.children;
      delete item.order;

      console.log("item", item);
      return {
        ...item,
        key: item.path,
        label:
          item.type === "link" ? (
            <a href={item.path}>{item.label}</a>
          ) : (
            <Link href={item.path || "/"}>{item.label}</Link>
          ),
      };
    }
  });
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useConfig();

  const [menuList, setMenuList] = useState<any>([]);

  const getMenuList = useCallback(async () => {
    const url =
      "http://localhost:8060/items/menuList?fields=*&fields[]=children.*&sort[]=order";
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      const menuList = recursiveMenu(res.data);
      console.log("menuList", menuList);
      setMenuList(menuList);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }, []);

  const [current, setCurrent] = useState(["transaction"]);

  const onClick: MenuProps["onClick"] = (e: any) => {
    console.log(e);
    const { path } = e.item.props;

    // router.push(path);

    setCurrent([e.key]);
  };

  useEffect(() => {
    if (pathname === "/") {
      setCurrent(["home"]);
    } else {
      const arr = pathname.split("/");
      setCurrent([...arr.slice(1)]);
    }
  }, [pathname]);

  useEffect(() => {
    getMenuList();
  }, [getMenuList]);

  return <PcMenu></PcMenu>;
}
