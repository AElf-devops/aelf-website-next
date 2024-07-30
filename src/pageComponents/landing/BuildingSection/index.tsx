import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import { CommonButtonType } from "@/components/CommonButton";
import LandingIllustrationComputer from "@/assets/landing/LandingIllustrationComputer.png";
import LandingIllustrationTool from "@/assets/landing/LandingIllustrationTool.png";
import LandingIllustrationCommunity from "@/assets/landing/LandingIllustrationCommunity.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export default function BuildingSection() {
  const deviceClassName = useDeviceClass(styles);

  return (
    <CommonSection
      sectionClassName={clsx(styles.buildingSection, deviceClassName)}
      contentClassName={styles.buildingContent}
      title="We simplify building on Web3"
      description="aelf offers developers and creators AI powered easy to use tools coupled with a high-performance infrastructure to build, deploy and manage your ideal dApp."
    >
      <CommonImageTextPart
        imageSrc={LandingIllustrationComputer}
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
        desktopAndTabletImagePosition={CommonImageTextPartImagePosition.RIGHT}
        imageSrc={LandingIllustrationTool}
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
        imageSrc={LandingIllustrationCommunity}
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
