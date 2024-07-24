import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImage from "@/components/CommonImage";
import EcosystemHero from "@/assets/ecosystem/EcosystemHero.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { SECTION_ID } from "@/constants/sectionId";
import styles from "./styles.module.scss";

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const heroImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 323;
      case DeviceWidthType.DESKTOP:
      default:
        return 672;
    }
  }, [deviceWidthType]);

  const heroImageHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 243;
      case DeviceWidthType.DESKTOP:
      default:
        return 506;
    }
  }, [deviceWidthType]);

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
          width={heroImageWidth}
          height={heroImageHeight}
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
