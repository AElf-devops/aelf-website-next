import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImage from "@/components/CommonImage";
import EcosystemHero from "@/assets/ecosystem/EcosystemHero.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonSection
      sectionClassName={clsx(styles.firstScreenSection, deviceClassName)}
      contentClassName={styles.firstScreenContent}
    >
      <div className={styles.introductionPart}>
        <CommonImage
          className={styles.heroImage}
          src={EcosystemHero}
          alt="ecosystem"
        />
        <div className={styles.title}>Discover the aelf Ecosystem</div>
        <div className={styles.description}>
          Explore the comprehensive ecosystem built on aelf’s advanced
          blockchain technology.
        </div>
      </div>
    </CommonSection>
  );
}
