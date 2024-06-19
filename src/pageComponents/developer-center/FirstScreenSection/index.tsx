import clsx from "clsx";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/NewCommonSection";
import CommonImage from "@/components/CommonImage";
import DeveloperHero from "@/assets/developer-center/DeveloperHero.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export default function FirstScreenSection() {
  const deviceClassName = useDeviceClass(styles);
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
          alt="developer-center"
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
