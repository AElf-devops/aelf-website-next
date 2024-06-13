import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import LandingBlockIllustrationDoc from "@/assets/landing/LandingBlockIllustrationDoc.svg";
import LandingBlockIllustrationRocket from "@/assets/landing/LandingBlockIllustrationRocket.svg";
import LandingBlockIllustrationEarth from "@/assets/landing/LandingBlockIllustrationEarth.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function BuildingSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const firstImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return "auto";
      case DeviceWidthType.Tablet:
        return 258;
      case DeviceWidthType.Desktop:
      default:
        return 516;
    }
  }, [deviceWidthType]);

  const firstRowGap = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return 48;
      case DeviceWidthType.Tablet:
        return 54;
      case DeviceWidthType.Desktop:
      default:
        return 172;
    }
  }, [deviceWidthType]);

  const secondImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return "auto";
      case DeviceWidthType.Tablet:
        return 229;
      case DeviceWidthType.Desktop:
      default:
        return 457;
    }
  }, [deviceWidthType]);

  const secondRowGap = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return 48;
      case DeviceWidthType.Tablet:
        return 64;
      case DeviceWidthType.Desktop:
      default:
        return 181;
    }
  }, [deviceWidthType]);

  const thirdImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return "auto";
      case DeviceWidthType.Tablet:
        return 211;
      case DeviceWidthType.Desktop:
      default:
        return 422;
    }
  }, [deviceWidthType]);

  const thirdRowGap = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return 48;
      case DeviceWidthType.Tablet:
        return 99;
      case DeviceWidthType.Desktop:
      default:
        return 185;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.buildingSection, deviceClassName)}
      title="We simplify building on Web3"
      description="aelf offers developers and creators AI powered easy to use tools coupled with a high-performance infrastructure to build, deploy and manage your ideal dApp."
    >
      <CommonImageTextPart
        className={styles.imageTextFirstPart}
        imageClassName={styles.image}
        imageWidth={firstImageWidth}
        rowGap={firstRowGap}
        imageSrc={LandingBlockIllustrationDoc}
        contentList={[
          {
            title: "Easy to use Templates & SDKs",
            description:
              "aelf offers a suite of templates and SDKs for rapid and seamless development and deployment, whether you are more familiar with C#, Java, JS, Python, or Go.",
            buttonProps: {
              className: styles.button,
              text: "Start Building",
            },
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextSecondPart}
        imageClassName={styles.image}
        imageWidth={secondImageWidth}
        rowGap={secondRowGap}
        imagePosition={CommonImageTextPartImagePosition.Right}
        imageSrc={LandingBlockIllustrationRocket}
        contentList={[
          {
            title: "Clear documentation and automated tools",
            description:
              "aelf’s comprehensive documentation and suite of automated tools enable you to effortlessly create robust and scalable dApps exactly the way you envision.",
            buttonProps: {
              className: styles.button,
              text: "Read Docs",
            },
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextThirdPart}
        imageClassName={styles.image}
        imageWidth={thirdImageWidth}
        rowGap={thirdRowGap}
        imageSrc={LandingBlockIllustrationEarth}
        contentList={[
          {
            title: "Be part of our growing community",
            description:
              "Whether you are new to Web3 or an OG, we welcome you to join our growing community of developers, creators and users to exchange ideas and collaborate together.",
            buttonProps: {
              className: styles.button,
              text: "Join Community",
            },
          },
        ]}
      />
    </CommonSection>
  );
}
