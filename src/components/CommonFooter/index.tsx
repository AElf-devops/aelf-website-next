import clsx from "clsx";
import Logo from "@/assets/Logo.svg";
import {
  Discord,
  Github,
  Telegram,
  X,
  Reddit,
  Linkedin,
  Chats,
  Youtube,
} from "@/assets/socialMedia";
import ChatPAAL from "../ChatPAAL";
import CommonLink, { ICommonLinkProps } from "../CommonLink";
import CommonImage from "../CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";
import { SECTION_ID } from "@/constants/sectionId";
import { toSnakeCase } from "../../utils";

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
      {
        text: "Terms of Use",
        href: "https://docs.aelf.com/legal/terms-of-use/",
      },
      {
        text: "Privacy Policy",
        href: "https://docs.aelf.com/legal/privacy-policy/",
      },
      {
        text: "Cookie Policy",
        href: "https://docs.aelf.com/legal/cookie-policy/",
      },
    ],
  },
  {
    title: "Developer",
    links: [
      { text: "Quick Start", href: "https://docs.aelf.com/quick-start/" },
      { text: "Learn", href: "https://docs.aelf.com/learn/" },
      { text: "Tools", href: "https://docs.aelf.com/tools/" },
      {
        text: "Playground",
        href: "https://docs.aelf.com/tools/aelf-playground/",
      },
      { text: "Resources", href: "https://docs.aelf.com/resources/" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { text: "Overview", href: "/ecosystem" },
      { text: "dApps", href: `/ecosystem#${SECTION_ID.ECOSYSTEM.DAPPS}` },
      {
        text: "aelf Ventures",
        href: `/ecosystem#${SECTION_ID.ECOSYSTEM.VENTURES}`,
      },
    ],
  },
  {
    title: "General",
    links: [
      {
        text: "About aelf",
        href: "https://docs.aelf.com/about-aelf",
      },
      {
        text: "Blog",
        href: "https://blog.aelf.com/",
        isExternalLinkTargetSelf: true,
      },
      { text: "Contact Us", href: "https://form.aelf.com/contact" },
    ],
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
    href: "https://discord.gg/aelfblockchain",
  },
  {
    icon: Github,
    href: "https://github.com/aelfProject",
  },
  {
    icon: Reddit,
    href: "https://www.reddit.com/r/aelfofficial/",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/aelfblockchain",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@aelfblockchain",
  },
  {
    icon: Chats,
    href: "https://forum.aelf.com/",
  },
];

export default function CommonFooter() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const renderLogo = () => (
    <div className={styles.logoWrap}>
      <CommonImage
        className={styles.logo}
        src={Logo}
        alt="aelf AI blockchain logo"
      />
    </div>
  );

  const getFullYear = new Date().getFullYear();

  const renderCopyright = () => (
    <div className={styles.copyright}>Copyright © {getFullYear} aelf</div>
  );
  const renderLinkList = () =>
    LINK_LIST.map((config, index) => (
      <div key={index} className={styles.linkList}>
        <div className={styles.linkListTitle}>{config.title}</div>
        {config.links.map((item, idx) => (
          <CommonLink
            {...item}
            key={idx}
            className={styles.linkListItem}
            onClick={() => {
              window.hj("event", `click_${toSnakeCase(item.text)}`);
            }}
          >
            {item.text}
          </CommonLink>
        ))}
      </div>
    ));

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
      <ChatPAAL />
      {deviceWidthType === DeviceWidthType.MOBILE ? (
        <>
          <div className={styles.linkWrap}>{renderLinkList()}</div>
          <div className={styles.socialMediumListWrap}>
            {renderSocialMediaList()}
          </div>
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
            {renderLinkList()}
          </div>
          <div className={styles.divider} />
          <div className={styles.infoWrap}>
            {renderSocialMediaList()}
            {renderCopyright()}
          </div>
        </>
      )}
    </footer>
  );
}
