import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonButton, { CommonButtonType } from "@/components/CommonButton";
import CommonImage from "@/components/CommonImage";
import LandingHeroImg from "@/assets/landing/LandingHero.png";
import * as Partner from "@/assets/partner";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

const PARTNER_LIST = [
  Partner.PartnerPortkey,
  Partner.PartnerSchrodinger,
  Partner.PartnerAwaken,
  Partner.PartnerForest,
  Partner.PartnerBridge,
  Partner.PartnerEwell,
  Partner.PartnerBeanGoTown,
  Partner.PartnerNet,
  Partner.PartnerAzure,
  Partner.PartnerGoogle,
];

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonSection
      sectionClassName={clsx(styles.firstScreenSection, deviceClassName)}
      contentClassName={styles.firstScreenContent}
    >
      <CommonImage
        className={styles.landingImg}
        src={LandingHeroImg}
        alt="landing"
      />
      <div className={styles.introductionPart}>
        <div className={styles.title}>
          Experience AI + Blockchain of Tomorrow
        </div>
        <div className={styles.description}>
          We converge AI and Blockchain to power the future of Web3
        </div>
        <div className={styles.buttonWrap}>
          <CommonButton className={styles.button} isRound>
            Read Docs
          </CommonButton>
          <CommonButton
            className={styles.button}
            type={CommonButtonType.Primary}
            isRound
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
          {PARTNER_LIST.map((img, index) => (
            <div key={index} className={styles.partnerImgWrap}>
              <CommonImage src={img} alt="partner" />
            </div>
          ))}
        </div>
      </div>
    </CommonSection>
  );
}
