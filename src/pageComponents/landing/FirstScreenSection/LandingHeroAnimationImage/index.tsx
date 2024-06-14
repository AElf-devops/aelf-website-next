import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import * as LandingHeroImage from "@/assets/landing/landingHero";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export default function LandingHeroAnimationImage() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.landingHeroAnimationImage, deviceClassName)}>
      <CommonImage
        className={styles.background}
        src={LandingHeroImage.HeroBackground}
        alt="landing"
      />
      <CommonImage
        className={styles.shadowLarge}
        src={LandingHeroImage.HeroShadowLarge}
      />
      <CommonImage
        className={styles.shadowSmall}
        src={LandingHeroImage.HeroShadowSmall}
      />
       <CommonImage
        className={styles.logo}
        src={LandingHeroImage.HeroLogo}
      />
    </div>
  );
}
