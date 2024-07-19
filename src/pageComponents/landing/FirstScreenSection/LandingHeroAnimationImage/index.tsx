import { useMemo } from "react";
import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import * as LandingHeroImage from "@/assets/landing/landingHero";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function LandingHeroAnimationImage() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const backgroundWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 302;
      case DeviceWidthType.DESKTOP:
      default:
        return 604;
    }
  }, [deviceWidthType]);

  const backgroundHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 302;
      case DeviceWidthType.DESKTOP:
      default:
        return 604;
    }
  }, [deviceWidthType]);

  return (
    <div className={clsx(styles.landingHeroAnimationImage, deviceClassName)}>
      <CommonImage
        className={styles.background}
        src={LandingHeroImage.HeroBackground}
        width={backgroundWidth}
        height={backgroundHeight}
        alt="AI blockchain - aelf. Future of web3."
        priority
      />
      <CommonImage
        className={styles.shadowLarge}
        src={LandingHeroImage.HeroShadowLarge}
      />
      <CommonImage
        className={styles.shadowSmall}
        src={LandingHeroImage.HeroShadowSmall}
      />
      <CommonImage className={styles.logo} src={LandingHeroImage.HeroLogo} />
    </div>
  );
}
