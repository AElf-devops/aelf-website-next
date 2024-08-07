import { useState } from "react";
import clsx from "clsx";
import { Drawer } from "antd";
import Logo from "@/assets/Logo.svg";
import List from "@/assets/List.svg";
import Close from "@/assets/Close.svg";
import CommonImage from "../CommonImage";
import CommonLink from "../CommonLink";
import CommonButton, { CommonButtonType } from "../CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const MENU_LIST = [
  {
    text: "Platform",
    href: "/platform",
  },
  {
    text: "Developer",
    href: "/developer-center",
  },
  {
    text: "Ecosystem",
    href: "/ecosystem",
  },
  {
    text: "Blog",
    href: "https://blog.aelf.com/",
    isExternalLinkTargetSelf: true,
  },
  {
    text: "Contact Us",
    href: "https://form.aelf.com/contact",
    onlyMobileShow: true,
  },
];

export default function CommonHeader() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  const renderLogo = () => (
    <CommonLink href="/">
      <CommonImage
        className={styles.logo}
        src={Logo}
        alt="aelf AI blockchain logo"
      />
    </CommonLink>
  );

  const renderBanner = () => (
    <div className={styles.headerBanner}>
      <p className={styles.bannerHornIcon}>📣</p>
      <p className={styles.bannerContent}>
        Join us for Hello [AI], a pre-TOKEN2049 party on 16 September!&nbsp;
        <CommonButton
          className={styles.bannerLink}
          type={CommonButtonType.LINK}
          href="https://lu.ma/pe14cn18"
        >
          RSVP here NOW!
        </CommonButton>
      </p>
    </div>
  );

  return (
    <header className={clsx(styles.commonHeader, deviceClassName)}>
      {renderBanner()}
      {deviceWidthType === DeviceWidthType.MOBILE ? (
        <div className={styles.header}>
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
              <div onClick={() => setIsMenuDrawerOpen(false)}>
                {renderLogo()}
              </div>
              <CommonImage
                className={styles.menuDrawerCloseIcon}
                src={Close}
                alt="close"
                onClick={() => setIsMenuDrawerOpen(false)}
              />
            </div>
            <div className={styles.menuDrawerContent}>
              {MENU_LIST.map((item, index) => (
                <CommonLink
                  key={index}
                  href={item.href}
                  isExternalLinkTargetSelf={item.isExternalLinkTargetSelf}
                  onClick={() => setIsMenuDrawerOpen(false)}
                >
                  <div className={styles.menuDrawerContentItem}>
                    {item.text}
                  </div>
                </CommonLink>
              ))}
            </div>
          </Drawer>
        </div>
      ) : (
        <div className={styles.header}>
          {renderLogo()}
          <div className={styles.navWrap}>
            {MENU_LIST.filter((item) => !item.onlyMobileShow).map(
              (item, index) => (
                <CommonLink
                  key={index}
                  href={item.href}
                  isExternalLinkTargetSelf={item.isExternalLinkTargetSelf}
                >
                  <div className={styles.navItem}>{item.text}</div>
                </CommonLink>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
