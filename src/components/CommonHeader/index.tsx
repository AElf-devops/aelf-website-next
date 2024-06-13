import { useState } from "react";
import clsx from "clsx";
import { Drawer } from "antd";
import Logo from "@/assets/Logo.svg";
import List from "@/assets/List.svg";
import Close from "@/assets/Close.svg";
import CommonImage from "../CommonImage";
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
  },
  {
    text: "Ecosystem",
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
    <CommonImage className={styles.logo} src={Logo} alt="logo" />
  );

  return (
    <header className={clsx(styles.commonHeader, deviceClassName)}>
      {deviceWidthType === DeviceWidthType.Mobile ? (
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
                <div
                  key={index}
                  className={styles.menuDrawerContentItem}
                  onClick={() => setIsMenuDrawerOpen(false)}
                >
                  {item.text}
                </div>
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
                <div key={index}>{item.text}</div>
              )
            )}
          </div>
        </>
      )}
    </header>
  );
}
