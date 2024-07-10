import { useMemo } from "react";
import clsx from "clsx";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import CommonImage from "@/components/CommonImage";
import DeveloperHero from "@/assets/developer-center/DeveloperHero.png";
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
        return 271;
      case DeviceWidthType.TABLET:
        return 414;
      case DeviceWidthType.DESKTOP:
      default:
        return 829;
    }
  }, [deviceWidthType]);

  const heroImageHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 204;
      case DeviceWidthType.TABLET:
        return 312;
      case DeviceWidthType.DESKTOP:
      default:
        return 625;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.firstScreenSection, deviceClassName)}
      contentClassName={styles.firstScreenContent}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <div className={styles.introductionPart}>
        <CommonImage
          className={styles.heroImage}
          src={DeveloperHero}
          width={heroImageWidth}
          height={heroImageHeight}
          alt="developer-center"
          priority
        />
        <div className={styles.title}>Developer Resources</div>
        <div className={styles.description}>
          Learn how to start building on aelf with our detailed documentation
          and development resources.
        </div>
      </div>
    </CommonSection>
  );
}
