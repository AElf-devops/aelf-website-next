import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImage from "@/components/CommonImage";
import PlatformHero from "@/assets/platform/PlatformHero.png";
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
          src={PlatformHero}
          alt="platform"
        />
        <div className={styles.title}>
          A Performant
          <br />
          Cloud-Native Layer 1 powered by AI
        </div>
        <div className={styles.description}>
          Explore the innovative platform behind aelf’s blockchain technology.
        </div>
      </div>
    </CommonSection>
  );
}
