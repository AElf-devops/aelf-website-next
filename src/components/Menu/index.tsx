import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Menu, MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { headIconList } from "./constants";
import logo from '@/assets/images/logo.png';
import Image from "next/image";
import { useConfig } from "@/contexts/useConfig/hooks";

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

export  function PcMenu() {
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

  return (
    <header className={clsx("common-page", styles.header)}>
      <div className={styles.headerWrapper}>
        <a className={styles.headerLogo} href="./index">
          <Image src={logo} alt="" ></Image>
          {/* <img src="./img/home/logo.png" alt="" /> */}
          <h1 className={clsx(styles.title)}>aelf</h1>
        </a>
        <Menu
          onClick={onClick}
          className={styles.headerMenu}
          selectedKeys={current}
          mode="horizontal"
          items={menuList}
          // forceSubMenuRender={true}
        />
        <div className={styles.herderRight}>
          <div className={clsx(styles.languageBox, styles.communityBox)}>
            <div
              className={clsx(
                styles.communityIco,
                styles.iconLiaotian,
                "iconfont",
                "icon-liaotian"
              )}
            ></div>
            <div className={styles.languageTitle}>Community</div>
            <div
              className={clsx(styles.iconArrows, "iconfont", "icon-jiantou")}
            ></div>
            <div className={styles.headIconListBox}>
              <div className={clsx(styles.headIconList, "clearfix")}>
                {headIconList.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    className={clsx(item.class, "iconfont")}
                  ></a>
                ))}
              </div>
            </div>
          </div>
          <div className={clsx(styles.languageBox, styles.languageChange)}>
            <a
              href="https://wkf.ms/3Mbxauz"
              target="_blank"
              className={styles.languageTitle}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
