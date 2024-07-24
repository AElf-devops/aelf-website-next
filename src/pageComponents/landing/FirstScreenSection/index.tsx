import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonLink from "@/components/CommonLink";
import CommonButton, { CommonButtonType } from "@/components/CommonButton";
import CommonImage from "@/components/CommonImage";
import LandingHeroAnimationImage from "./LandingHeroAnimationImage";
import * as Partner from "@/assets/partner";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

const PARTNER_LIST = [
  {
    img: Partner.PartnerPortkey,
    href: "https://portkey.finance/",
    alt: "Portkey - web3 AA wallet. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerSchrodinger,
    href: "https://schrodingernft.ai/",
    alt: "Project Schrodinger - AI NFT platform. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerAwaken,
    href: "https://awaken.finance/",
    alt: "AwakenSwap - decentralised exchange DEX. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerForest,
    href: "https://www.eforest.finance/",
    alt: "Forest - NFT marketplace. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerBridge,
    href: "https://ebridge.exchange/",
    alt: "eBridge - Token bridge. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerETransfer,
    href: "https://etransfer.exchange/",
    alt: "ETransfer - Cross-chain bridge. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerBeanGoTown,
    href: "https://beangotown.com/",
    alt: "BeanGoTown - Web3 game. aelf's ecosystem.",
  },
  {
    img: Partner.PartnerNet,
    href: "https://dotnet.microsoft.com/en-us/",
    alt: "Microsoft.NET - aelf's technological partner.",
  },
  {
    img: Partner.PartnerAzure,
    href: "https://azure.microsoft.com/en-us",
    alt: "Microsoft Azure - aelf's technological partner.",
  },
  {
    img: Partner.PartnerGoogle,
    href: "https://cloud.google.com/?hl=en",
    alt: "Google Cloud Platform - aelf's technological partner.",
  },
];

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonSection
      sectionClassName={clsx(styles.firstScreenSection, deviceClassName)}
      contentClassName={styles.firstScreenContent}
    >
      <LandingHeroAnimationImage />
      <div className={styles.introductionPart}>
        <div className={styles.title}>
          Experience AI + Blockchain of Tomorrow
        </div>
        <div className={styles.description}>
          We converge AI and Blockchain to power the future of Web3
        </div>
        <div className={styles.buttonWrap}>
          <CommonButton className={styles.button} href="https://docs.aelf.com">
            Read Docs
          </CommonButton>
          <CommonButton
            className={styles.button}
            type={CommonButtonType.PRIMARY}
            href="/developer-center"
          >
            Start Building
          </CommonButton>
        </div>
      </div>
      <div className={styles.partnerPart}>
        <div className={styles.partnerPartTitle}>
          Ecosystem and technological partners
        </div>
        <div className={styles.partnerPartContent}>
          {PARTNER_LIST.map((item, index) => (
            <CommonLink
              key={index}
              className={styles.partnerImgWrap}
              href={item.href}
            >
              <CommonImage src={item.img} alt={item.alt} />
            </CommonLink>
          ))}
        </div>
      </div>
    </CommonSection>
  );
}
