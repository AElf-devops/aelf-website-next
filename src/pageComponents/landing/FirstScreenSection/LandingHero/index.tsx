import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import LandingHeroBackground from "@/assets/landing/LandingHeroBackground.png";
import LandingHeroAnimation from "@/assets/landing/LandingHeroAnimation.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DIMENSION_CONFIG } from "@/components/CommonFirstScreenSection/constants";
import {
  LANDING_HERO_ANIMATION_SIZE_CONFIG,
  LANDING_HERO_BACKGROUND_SIZE_CONFIG,
} from "./constants";
import styles from "./styles.module.scss";

export default function LandingHero() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  return (
    <div
      className={clsx(styles.heroWrapper, deviceClassName)}
      style={{
        width: DIMENSION_CONFIG[deviceWidthType].HERO_IMAGE_WIDTH,
        height: DIMENSION_CONFIG[deviceWidthType].HERO_IMAGE_HEIGHT,
      }}
    >
      <CommonImage
        className={styles.animationImage}
        width={LANDING_HERO_ANIMATION_SIZE_CONFIG[deviceWidthType].WIDTH}
        height={LANDING_HERO_ANIMATION_SIZE_CONFIG[deviceWidthType].HEIGHT}
        src={LandingHeroAnimation}
        priority
      />
      <CommonImage
        className={styles.backgroundImage}
        width={LANDING_HERO_BACKGROUND_SIZE_CONFIG[deviceWidthType].WIDTH}
        height={LANDING_HERO_BACKGROUND_SIZE_CONFIG[deviceWidthType].HEIGHT}
        src={LandingHeroBackground}
        alt="AI blockchain - aelf. Future of web3."
        priority
      />
    </div>
  );
}
