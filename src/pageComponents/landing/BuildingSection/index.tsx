import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import { CommonButtonType } from "@/components/CommonButton";
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
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 258;
      case DeviceWidthType.DESKTOP:
      default:
        return 516;
    }
  }, [deviceWidthType]);

  const secondImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 229;
      case DeviceWidthType.DESKTOP:
      default:
        return 457;
    }
  }, [deviceWidthType]);

  const thirdImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 211;
      case DeviceWidthType.DESKTOP:
      default:
        return 422;
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
        imageSrc={LandingBlockIllustrationDoc}
        contentList={[
          {
            title: "Easy to use Templates & SDKs",
            description:
              "aelf offers a suite of templates and SDKs for rapid and seamless development and deployment, whether you are more familiar with C#, Java, JS, Python, or Go.",
            buttonProps: {
              type: CommonButtonType.GHOST_BLACK,
              text: "Start Building",
              href: "/developer-center",
            },
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextSecondPart}
        imageClassName={styles.image}
        imageWidth={secondImageWidth}
        desktopAndTabletImagePosition={CommonImageTextPartImagePosition.RIGHT}
        imageSrc={LandingBlockIllustrationRocket}
        contentList={[
          {
            title: "Clear documentation and automated tools",
            description:
              "aelf’s comprehensive documentation and suite of automated tools enable you to effortlessly create robust and scalable dApps exactly the way you envision.",
            buttonProps: {
              type: CommonButtonType.GHOST_BLACK,
              text: "Read Docs",
              href: "https://docs.aelf.com",
            },
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextThirdPart}
        imageClassName={styles.image}
        imageWidth={thirdImageWidth}
        imageSrc={LandingBlockIllustrationEarth}
        contentList={[
          {
            title: "Be part of our growing community",
            description:
              "Whether you are new to Web3 or an OG, we welcome you to join our growing community of developers, creators and users to exchange ideas and collaborate together.",
            buttonProps: {
              type: CommonButtonType.GHOST_BLACK,
              text: "Join Community",
              href: "https://github.com/AElfProject/AElf",
            },
          },
        ]}
      />
    </CommonSection>
  );
}
