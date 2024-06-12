import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import LandingBlockIllustrationDoc from "@/assets/landing/LandingBlockIllustrationDoc.svg";
import LandingBlockIllustrationRocket from "@/assets/landing/LandingBlockIllustrationRocket.svg";
import LandingBlockIllustrationEarth from "@/assets/landing/LandingBlockIllustrationEarth.svg";
import styles from "./styles.module.scss";

export default function BuildingSection() {
  return (
    <CommonSection
      sectionClassName={styles.buildingSection}
      contentClassName={styles.buildingContent}
      title="We simplify building on Web3"
      description="aelf offers developers and creators AI powered easy to use tools coupled with a high-performance infrastructure to build, deploy and manage your ideal dApp."
    >
      <CommonImageTextPart
        className={styles.imageTextFirstPart}
        imageClassName={styles.image}
        imageWidth={516}
        rowGap={172}
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
        imageWidth={457}
        rowGap={181}
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
        imageWidth={442}
        rowGap={185}
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
