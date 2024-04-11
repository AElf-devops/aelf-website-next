import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { StaticImageData } from "next/image";
import { CommonSection } from "@/components/CommonSection";
import CommonImage from "@/components/CommonImage";
import styles from "./styles.module.scss";

import venturesMainImg from "@/assets/ventures/effects.png";
import Focus1Img from "@/assets/ventures/ecology-1.png";
import Focus2Img from "@/assets/ventures/ecology-2.png";
import Focus3Img from "@/assets/ventures/ecology-3.png";
import crystalFunImg from "@/assets/ventures/crystalFun.png";
import plutoImg from "@/assets/ventures/pluto.png";
import mythicProtocolImg from "@/assets/ventures/mythicProtocol.png";
import arrowLinkRightImg from "@/assets/ventures/arrow-link-right.svg";

type TFocusItem = {
  img: StaticImageData;
  title: string;
  content: string;
};
const focusList: TFocusItem[] = [
  {
    img: Focus1Img,
    title: "INCUBATE",
    content:
      "Champions a research-intensive approach, to be at the forefront identifying latest investment trends and opportunities.",
  },
  {
    img: Focus2Img,
    title: "CONNECT",
    content:
      "Collaborates closely with founders, providing advice and access to an extensive network of partners, investors and builders.",
  },
  {
    img: Focus3Img,
    title: "INVEST",
    content:
      "Unlocks access to comprehensive support across the entire aelf ecosystem and community.",
  },
];

const portfolioList = [
  {
    img: crystalFunImg,
    content:
      "Crystal Fun, a decentralized Web3 game ecosystem, ushering ground breaking experiences with high-quality Web3 games.",
    url: "https://crystalfun.io/",
  },
  {
    img: mythicProtocolImg,
    content:
      "Confiction (ex-name: Mythic Protocol) is developing an exhilarating gameplay-first roguelike ARPG with blockchain technology.",
    url: "https://www.confiction.com/",
  },
  {
    img: plutoImg,
    content:
      "Pluto is a gaming studio, with a vision of bridging casual to midcore Web2 into Web3 games across Ton and multichain ecosystems.",
    url: "https://www.pluto.vision/#/",
  },
];

export default function VenturesPage() {
  const deviceClassName = useDeviceClass(styles);

  return (
    <div className={clsx([styles.pageWrap, deviceClassName])}>
      <div className={styles.backgroundWrap}></div>
      <CommonSection
        sectionClassName={styles.bannerPart}
        contentClassName={styles.partContent}
      >
        <div className={styles.bannerLeft}>
          <div className={styles.bannerTitle}>
            Accelerating Blockchain Innovations
          </div>
          <div className={styles.bannerSubTitle}>
            {
              "AELF Ventures invests in next-generation blockchain technology, both vertical and stage agnostic."
            }
          </div>
        </div>

        <CommonImage className={styles.bannerImg} src={venturesMainImg} />
      </CommonSection>
      <CommonSection
        sectionClassName={styles.aboutPart}
        contentClassName={styles.partContent}
        title="About"
      >
        <div className={clsx([styles.aboutText, styles.aboutTextTop])}>
          {
            "AELF Ventures is the global investment arm of aelf, a high-performance L1 blockchain designed to bridge Web2 to Web3."
          }
        </div>
        <div className={styles.aboutText}>
          {
            "With our US$50 million ecosystem fund, we are dedicated to expanding aelf's ecosystem and capturing research-driven investments."
          }
        </div>
      </CommonSection>
      <CommonSection title="Our Focus">
        <div className={styles.listWrap}>
          {focusList.map((item, idx) => (
            <div key={idx} className={styles.itemWrap}>
              <CommonImage className={styles.itemImg} src={item.img} />
              <div className={styles.itemContent}>{item.content}</div>
            </div>
          ))}
        </div>
      </CommonSection>
      <CommonSection
        title="Our Portfolio"
        sectionClassName={styles.portfolioPart}
      >
        <div className={styles.portfolioPartContent}>
          {portfolioList.map((item, index) => {
            return (
              <div key={index} className={styles.partItem}>
                <CommonImage className={styles.partItemImage} src={item.img} />
                <div className={styles.partItemText}>{item.content}</div>
                <a href={item.url} target="_blank" className={styles.linkBtn}>
                  <span className={styles.linkBtnText}>Learn More</span>
                  <CommonImage
                    src={arrowLinkRightImg}
                    className={styles.arrowLinkRightImg}
                  />
                </a>
              </div>
            );
          })}
        </div>
      </CommonSection>
      <CommonSection contentClassName={styles.contactPart}>
        <div className={styles.contactContent}>
          <a href="https://wkf.ms/3Mbxauz" target="_blank" className={styles.title}>Contact Us</a>
          <div className={styles.email}>ventures@aelf.io</div>
        </div>
      </CommonSection>
    </div>
  );
}
