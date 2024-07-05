import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImage from "@/components/CommonImage";
import EcosystemHero from "@/assets/ecosystem/EcosystemHero.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { SECTION_ID } from "@/constants/sectionId";
import styles from "./styles.module.scss";

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonSection
      id={SECTION_ID.ECOSYSTEM.FIRST_SCREEN}
      sectionClassName={clsx(styles.firstScreenSection, deviceClassName)}
      contentClassName={styles.firstScreenContent}
    >
      <div className={styles.introductionPart}>
        <CommonImage
          className={styles.heroImage}
          src={EcosystemHero}
          alt="ecosystem"
          priority
        />
        <div className={styles.title}>Discover the aelf Ecosystem</div>
        <div className={styles.description}>
          Explore the vibrant ecosystem powered by aelf’s cutting-edge
          blockchain + AI technology.
        </div>
      </div>
    </CommonSection>
  );
}
