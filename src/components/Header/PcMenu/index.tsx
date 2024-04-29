import { useCallback, useEffect, useState, useMemo } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { headIconList } from "../constants";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

export default function PcMenu({
  menuList,
  allMenuList,
}: {
  menuList: any;
  allMenuList: any;
}) {
  const pathname = usePathname();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [isScroll, setIsScroll] = useState(false);

  const selectedIdObj = useMemo(() => {
    const item = allMenuList.find((item: any) => item.path === pathname) || {};
    return {
      subMenuId: item?.isParent ? "" : item?.id,
      menuId: item?.isParent ? item?.id : item?.parentId,
    };
  }, [pathname, allMenuList]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = document.documentElement.scrollTop;
  //     if (scrollTop > 0) {
  //       setIsScroll(true);
  //     } else {
  //       setIsScroll(false);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <header
      className={clsx(
        "common-page",
        styles.header,
        isScroll ? styles.headerBg : ""
      )}
    >
      <nav className={clsx(styles.navbar)}>
        <a className={styles.headerLogo} href="./index">
          <Image src={logo} alt=""></Image>
          <h1 className={clsx(styles.title)}>aelf</h1>
        </a>
        <div className={styles.navbarBox}>
          <ul className={styles.navbarUl}>
            {menuList.map((menu: any) => (
              <li
                key={menu.id}
                className={clsx(
                  styles.navbarLi,
                  selectedIdObj.menuId === menu.id ? styles.selected : ""
                )}
                onMouseEnter={() => setHoveredIndex(menu.id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {selectedIdObj.menuId === menu.id && (
                  <div className={styles.circle}></div>
                )}
                {menu.type === "link" ? (
                  <a className={styles.navbarLia} href={menu.path}>
                    <div className={styles.navTitleBox}>
                      <div data-title={menu.label} className={styles.navTitle}>
                        {menu.label}
                      </div>
                    </div>
                  </a>
                ) : (
                  <button className={styles.navLiButton}>
                    <div className={styles.navTitleBox}>
                      <div data-title={menu.label} className={styles.navTitle}>
                        {menu.label}
                      </div>
                    </div>
                  </button>
                )}
                {menu.children.length > 0 && (
                  <div
                    className={clsx(
                      styles.subMenu,
                      hoveredIndex === menu.id ? styles.show : styles.hidden
                    )}
                  >
                    <div className={styles.navTri}></div>
                    <ul className={styles.subMenuUl}>
                      {menu.children.map((subMenu: any) => (
                        <li
                          className={clsx(
                            styles.subMenuLi,
                            selectedIdObj.subMenuId === subMenu.id
                              ? styles.selected
                              : ""
                          )}
                          key={subMenu.id}
                          onClick={() => {
                            setHoveredIndex(null);
                          }}
                        >
                          {selectedIdObj.subMenuId === subMenu.id && (
                            <div className={styles.circle}></div>
                          )}
                          <Link href={subMenu.path}>{subMenu.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
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
      </nav>
    </header>
  );
}
