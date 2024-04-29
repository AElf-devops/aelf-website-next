import { useCallback, useEffect, useState } from "react";
import { useConfig } from "@/contexts/useConfig/hooks";
import PcMenu from "./PcMenu";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { isMobile } = useConfig();

  const [menuList, setMenuList] = useState<any>([]);
  const [allMenuList, setAllMenuList] = useState([]);

  const getMenuList = useCallback(async () => {
    const url =
      "http://localhost:8060/items/menuList?fields=*&fields[]=children.*&sort[]=order";
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      const list: any = [];
      res.data.forEach((element: any) => {
        list.push({
          ...element,
          isParent: true,
        });
        if (element.children) {
          element.children.forEach((item: any) => {
            list.push({
              ...item,
              isParent: false,
            });
          });
        }
      });

      setAllMenuList(list);
      setMenuList(res.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }, []);

  useEffect(() => {
    getMenuList();
  }, [getMenuList]);

  return isMobile ? (
    <MobileMenu menuList={menuList} />
  ) : (
    <PcMenu menuList={menuList} allMenuList={allMenuList}></PcMenu>
  );
}
