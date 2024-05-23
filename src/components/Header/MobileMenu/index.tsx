import { useEffect, useState, useRef, useMemo } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Drawer, Menu } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import CloseIcon from "@/assets/images/close.svg";
import type { MenuProps } from "antd";

export interface IMenuProps extends Omit<MenuProps, "mode"> {
  className?: string;
}

export default function MobileMenu({ menuList }: { menuList: IMenu[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isScroll, setIsScroll] = useState(false);
  const [open, setOpen] = useState(false);

  const onClose = () => {
    console.log("close");
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    router.push(e.key);
    onClose();
  };

  const newMenuList = useMemo(() => {
    return menuList?.map((element: any) => {
      element.key = element.path;
      if (element.children.length > 0) {
        return {
          ...element,
          key: element.path,
          children: element.children.map((item: any) => {
            return {
              ...item,
              key: item.path,
            };
          }),
        };
      } else {
        return {
          ...element,
          key: element.path,
          children: null,
        };
      }
    });
  }, [menuList]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("message", (event: any) => {
      if (event.data && event.data.type === "microAppMessage") {
        setIsScroll(event.data.isScroll);
      }
    });
  }, []);

  return (
    <header
      className={clsx(
        "common-page",
        styles.header,
        isScroll ? styles.headerBg : ""
      )}
    >
      <nav className={styles.nav}>
        {!open && (
          <>
            <Link className={styles.logoLink} href="/">
              <Image src={logo} className={styles.logo} alt=""></Image>
            </Link>
            <div className={styles.navIco} onClick={handleOpen}>
              <div className={styles.navBtnList}>
                <div className={styles.navBtnItem}></div>
                <div className={styles.navBtnItem}></div>
                <div className={styles.navBtnItem}></div>
              </div>
            </div>
          </>
        )}

        <div className={clsx(styles.popup, open ? styles.popupShow : "")}>
          <div className={styles.closeIcon}>
            <Image
              alt=""
              width={20}
              height={20}
              src={CloseIcon}
              onClick={onClose}
            ></Image>
          </div>
          <Menu
            mode="inline"
            items={newMenuList}
            onClick={onClick}
            theme="dark"
            style={{
              flex: 1,
              overflow: "auto",
              backgroundColor: "#000",
              borderRight: "none",
            }}
          />
          <div className={styles.navFooter}>
            <a
              href="https://wkf.ms/3Mbxauz"
              target="_blank"
              className="languageItem"
            >
              Contact Us
            </a>
            <div className={clsx("iconfont", "icon-liaotian")}></div>
          </div>
        </div>
      </nav>
    </header>
  );
}
