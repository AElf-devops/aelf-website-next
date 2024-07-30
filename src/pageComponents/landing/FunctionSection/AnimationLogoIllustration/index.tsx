import { useMemo } from "react";
import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import LandingIllustrationLogoBackground from "@/assets/landing/LandingIllustrationLogoBackground.png";
import * as AnimationLogo from "@/assets/landing/animationLogo";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function AnimationLogoIllustration() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const backgroundWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 325;
      case DeviceWidthType.DESKTOP:
      default:
        return 521;
    }
  }, [deviceWidthType]);

  const backgroundHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 325;
      case DeviceWidthType.DESKTOP:
      default:
        return 521;
    }
  }, [deviceWidthType]);

  return (
    <div className={clsx(styles.animationLogoIllustration, deviceClassName)}>
      <CommonImage
        className={styles.background}
        src={LandingIllustrationLogoBackground}
        width={backgroundWidth}
        height={backgroundHeight}
      />
      <CommonImage
        className={styles.shadowLarge}
        src={AnimationLogo.AnimationLogoShadowLarge}
      />
      <CommonImage
        className={styles.shadowSmall}
        src={AnimationLogo.AnimationLogoShadowSmall}
      />
      <CommonImage className={styles.logo} src={AnimationLogo.AnimationLogo} />
    </div>
  );
}
