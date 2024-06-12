import clsx from "clsx";
import Logo from "@/assets/Logo.svg";
import {
  Discord,
  Email,
  Facebook,
  Github,
  Medium,
  Reddit,
  Telegram,
  WeChat,
  X,
  Youtube,
} from "@/assets/socialMedia";
import CommonImage from "../CommonImage";
import styles from "./styles.module.scss";

interface ILink {
  text: string;
  url?: string;
}

const LINK_LIST = [
  {
    title: "Platform",
    links: [
      { text: "Technology" },
      { text: "Audit Report" },
      { text: "Privacy" },
      { text: "Terms of Use" },
      { text: "Cookie Policy" },
    ],
  },
  {
    title: "Developer Resources",
    links: [
      { text: "Docs" },
      { text: "Tools" },
      { text: "Examples & Tutorials" },
      { text: "Github" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { text: "Overview" },
      { text: "dApps" },
      { text: "aelf Ventures" },
      { text: "Blog" },
    ],
  },
  {
    title: "Connect",
    links: [{ text: "Contact Us" }],
  },
];

const SOCIAL_MEDIA_LIST = [
  {
    icon: Email,
  },
  {
    icon: X,
  },
  {
    icon: Github,
  },
  {
    icon: Discord,
  },
  {
    icon: Reddit,
  },
  {
    icon: Medium,
  },
  {
    icon: Telegram,
  },
  {
    icon: WeChat,
  },
  {
    icon: Youtube,
  },
  {
    icon: Facebook,
  },
];

export default function CommonFooter() {
  const renderLinkList = (title: string, links: ILink[], index: number) => (
    <div key={index} className={styles.linkList}>
      <div className={styles.linkListTitle}>{title}</div>
      {links.map((item, index) => (
        <div key={index} className={styles.linkListItem}>
          {item.text}
        </div>
      ))}
    </div>
  );

  return (
    <footer className={clsx(styles.commonFooter)}>
      <div className={styles.linkWrap}>
        <div className={styles.logoWrap}>
          <CommonImage className={styles.logo} src={Logo} alt="logo" />
        </div>
        {LINK_LIST.map((item, index) => renderLinkList(item.title, item.links, index))}
      </div>
      <div className={styles.divider} />
      <div className={styles.infoWrap}>
        <div className={styles.copyright}>Copyright © 2024 aelf</div>
        <div className={styles.socialMediumList}>
          {SOCIAL_MEDIA_LIST.map((item, index) => (
            <CommonImage
              key={index}
              className={styles.socialMediaIcon}
              src={item.icon}
              alt="media"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
