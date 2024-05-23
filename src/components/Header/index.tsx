import { useCallback, useEffect, useMemo, useState } from "react";
import { useConfig } from "@/contexts/useConfig/hooks";
import PcMenu from "./PcMenu";
import MobileMenu from "./MobileMenu";
import { GetServerSidePropsContext } from "next";
import { getMenuList } from "@/api/request";

export default function Header({ menuList }: { menuList: IMenu[] }) {
  const { isMobile } = useConfig();

  const allMenuList = useMemo(() => {
    const list: IMenu[] = [];
    menuList.forEach((element: any) => {
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
  }, [menuList]);

  return isMobile ? (
    <MobileMenu menuList={menuList} />
  ) : (
    <PcMenu menuList={menuList} allMenuList={allMenuList}></PcMenu>
  );
}

