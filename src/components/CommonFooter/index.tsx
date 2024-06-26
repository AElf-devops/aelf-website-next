import clsx from "clsx";
import Logo from "@/assets/Logo.svg";
import { Discord, Github, Telegram, X } from "@/assets/socialMedia";
import CommonLink, { ICommonLinkProps } from "../CommonLink";
import CommonImage from "../CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";
import { SECTION_ID } from "@/constants/sectionId";

interface ILink
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  text: string;
}

interface ILinkListItem {
  title: string;
  links: ILink[];
}

interface ISocialMediaListItem extends Pick<ICommonLinkProps, "href"> {
  icon: any;
}

const LINK_LIST: ILinkListItem[] = [
  {
    title: "Platform",
    links: [
      { text: "Technology", href: "/platform" },
      {
        text: "Audit Report",
        href: "https://github.com/AElfProject/aelf-audit-reports",
      },
      { text: "Privacy", href: "https://docs.aelf.com/" },
      { text: "Terms of Use", href: "https://docs.aelf.com/" },
      { text: "Cookie Policy", href: "https://docs.aelf.com/" },
    ],
  },
  {
    title: "Developer",
    links: [
      { text: "Quick start", href: "https://docs.aelf.com/" },
      { text: "Learn", href: "https://docs.aelf.com/" },
      { text: "Docs", href: "https://docs.aelf.com/" },
      { text: "Tools", href: "https://docs.aelf.com/" },
      { text: "Resources", href: "https://docs.aelf.com/" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { text: "Overview", href: "/aelf-ecosystem" },
      { text: "dApps", href: `/aelf-ecosystem#${SECTION_ID.ECOSYSTEM.DAPPS}` },
      {
        text: "aelf Ventures",
        href: `/aelf-ecosystem#${SECTION_ID.ECOSYSTEM.VENTURES}`,
      },
      {
        text: "Blog",
        href: "https://blog.aelf.com/",
        isExternalLinkTargetSelf: true,
      },
    ],
  },
  {
    title: "Connect",
    links: [{ text: "Contact Us", href: "https://form.aelf.com/contact" }],
  },
];

const SOCIAL_MEDIA_LIST: ISocialMediaListItem[] = [
  {
    icon: X,
    href: "https://x.com/aelfblockchain",
  },
  {
    icon: Telegram,
    href: "https://t.me/aelfblockchain",
  },
  {
    icon: Discord,
    href: "https://discord.com/invite/bgysa9xjvD",
  },
  {
    icon: Github,
    href: "https://github.com/aelfProject",
  },
];

export default function CommonFooter() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const renderLogo = () => (
    <div className={styles.logoWrap}>
      <CommonImage className={styles.logo} src={Logo} alt="logo" />
    </div>
  );

  const renderCopyright = () => (
    <div className={styles.copyright}>Copyright © 2024 aelf</div>
  );

  const renderLinkList = (config: ILinkListItem, index: number) => (
    <div key={index} className={styles.linkList}>
      <div className={styles.linkListTitle}>{config.title}</div>
      {config.links.map((item, index) => (
        <CommonLink {...item} key={index} className={styles.linkListItem}>
          {item.text}
        </CommonLink>
      ))}
    </div>
  );

  const renderSocialMediaList = () => (
    <div className={styles.socialMediumList}>
      {SOCIAL_MEDIA_LIST.map((item, index) => (
        <CommonLink key={index} href={item.href}>
          <CommonImage
            className={styles.socialMediaIcon}
            src={item.icon}
            alt="media"
          />
        </CommonLink>
      ))}
    </div>
  );

  return (
    <footer className={clsx(styles.commonFooter, deviceClassName)}>
      {deviceWidthType === DeviceWidthType.MOBILE ? (
        <>
          {renderSocialMediaList()}
          <div className={styles.divider} />
          <div className={styles.mobileCopyrightWrap}>
            {renderLogo()}
            {renderCopyright()}
          </div>
        </>
      ) : (
        <>
          <div className={styles.linkWrap}>
            {renderLogo()}
            {LINK_LIST.map((config, index) => renderLinkList(config, index))}
          </div>
          <div className={styles.divider} />
          <div className={styles.infoWrap}>
            {renderCopyright()}
            {renderSocialMediaList()}
          </div>
        </>
      )}
    </footer>
  );
}
