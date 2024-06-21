import { useState } from "react";
import clsx from "clsx";
import { Drawer } from "antd";
import Logo from "@/assets/Logo.svg";
import List from "@/assets/List.svg";
import Close from "@/assets/Close.svg";
import CommonImage from "../CommonImage";
import CommonLink from "../CommonLink";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const MENU_LIST = [
  {
    text: "Platform",
  },
  {
    text: "Developer",
    path: "/developer-center",
  },
  {
    text: "Ecosystem",
    path: "/ecosystem",
  },
  {
    text: "Blog",
  },
  {
    text: "Contact Us",
    onlyMobileShow: true,
  },
];

export default function CommonHeader() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  const renderLogo = () => (
    <CommonLink href="/landing">
      <CommonImage className={styles.logo} src={Logo} alt="logo" />
    </CommonLink>
  );

  return (
    <header className={clsx(styles.commonHeader, deviceClassName)}>
      {deviceWidthType === DeviceWidthType.MOBILE ? (
        <>
          {renderLogo()}
          <CommonImage
            className={styles.menuIcon}
            src={List}
            alt="menu"
            onClick={() => setIsMenuDrawerOpen(true)}
          />
          <Drawer
            className={styles.menuDrawer}
            headerStyle={{ display: "none" }}
            bodyStyle={{ padding: 0 }}
            width="100%"
            height="100vh"
            placement="left"
            open={isMenuDrawerOpen}
            onClose={() => {
              setIsMenuDrawerOpen(false);
            }}
          >
            <div className={styles.menuDrawerHeader}>
              {renderLogo()}
              <CommonImage
                className={styles.menuDrawerCloseIcon}
                src={Close}
                alt="close"
                onClick={() => setIsMenuDrawerOpen(false)}
              />
            </div>
            <div className={styles.menuDrawerContent}>
              {MENU_LIST.map((item, index) => (
                <CommonLink key={index} href={item.path}>
                  <div className={styles.menuDrawerContentItem}>
                    {item.text}
                  </div>
                </CommonLink>
              ))}
            </div>
          </Drawer>
        </>
      ) : (
        <>
          {renderLogo()}
          <div className={styles.navWrap}>
            {MENU_LIST.filter((item) => !item.onlyMobileShow).map(
              (item, index) => (
                <CommonLink key={index} href={item.path}>
                  <div className={styles.navItem}>{item.text}</div>
                </CommonLink>
              )
            )}
          </div>
        </>
      )}
    </header>
  );
}
