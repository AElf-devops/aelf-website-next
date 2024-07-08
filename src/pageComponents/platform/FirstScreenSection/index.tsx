import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImage from "@/components/CommonImage";
import PlatformHero from "@/assets/platform/PlatformHero.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const heroImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 324;
      case DeviceWidthType.DESKTOP:
      default:
        return 672;
    }
  }, [deviceWidthType]);

  const heroImageHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 244;
      case DeviceWidthType.DESKTOP:
      default:
        return 506;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.firstScreenSection, deviceClassName)}
      contentClassName={styles.firstScreenContent}
    >
      <div className={styles.introductionPart}>
        <CommonImage
          className={styles.heroImage}
          src={PlatformHero}
          width={heroImageWidth}
          height={heroImageHeight}
          alt="platform"
          priority
        />
        <div className={styles.title}>
          A Performant
          <br />
          Cloud-Native Layer 1 Powered by AI
        </div>
        <div className={styles.description}>
          Explore the innovative platform behind aelf’s blockchain technology.
        </div>
      </div>
    </CommonSection>
  );
}
