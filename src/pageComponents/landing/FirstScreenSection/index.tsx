import { Col, Row } from "antd";
import CommonSection from "@/components/NewCommonSection";
import CommonButton, { CommonButtonType } from "@/components/CommonButton";
import CommonImage from "@/components/CommonImage";
import LandingHeroImg from "@/assets/landing/LandingHero.png";
import * as Partner from "@/assets/partner";
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
  return (
    <CommonSection
      sectionClassName={styles.firstScreenSection}
      contentClassName={styles.firstScreenContent}
    >
      <div className={styles.introductionPart}>
        <div className={styles.title}>
          Experience AI + Blockchain of Tomorrow
        </div>
        <div className={styles.description}>
          We converge AI and Blockchain to power the future of Web3
        </div>
        <div className={styles.buttonWrap}>
          <CommonButton isRound>Read Docs</CommonButton>
          <CommonButton type={CommonButtonType.Primary} isRound>
            Start Building
          </CommonButton>
        </div>
      </div>
      <CommonImage
        className={styles.landingImg}
        src={LandingHeroImg}
        alt="landing"
      />
      <div className={styles.partnerPart}>
        <div className={styles.partnerPartTitle}>
          Ecosystem and technological partners
        </div>
        <Row className={styles.partnerPartContent} gutter={[0, 16]}>
          {PARTNER_LIST.map((img, index) => (
            <Col key={index} className={styles.partnerImgWrap}>
              <CommonImage
                className={styles.partnerImg}
                src={img}
                alt="partner"
              />
            </Col>
          ))}
        </Row>
      </div>
    </CommonSection>
  );
}
