import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart from "@/components/CommonImageTextPart";
import CommonButton from "@/components/CommonButton";
import CommonDappCard, {
  ICommonDappCardProps,
} from "@/components/CommonDappCard";
import LandingBlockIllustrationLock from "@/assets/landing/LandingBlockIllustrationLock.svg";
import DappPortkey from "@/assets/dapp/DappPortkey.svg";
import DappEbridge from "@/assets/dapp/DappEbridge.svg";
import DappForest from "@/assets/dapp/DappForest.svg";
import styles from "./styles.module.scss";

const DAPP_LIST: ICommonDappCardProps[] = [
  {
    className: styles.dappCard,
    icon: DappPortkey,
    name: "Portkey",
    tagList: ["Wallet"],
    description:
      "An Account Abstraction Wallet for you to seamlessly transition from Web2 to Web3.",
  },
  {
    className: styles.dappCard,
    icon: DappEbridge,
    name: "eBridge",
    tagList: ["Bridge"],
    description:
      "A simple to use cross-chain bridge between aelf and the EVM compatible chains.",
  },
  {
    className: styles.dappCard,
    icon: DappForest,
    name: "Forest",
    tagList: ["NFT"],
    description:
      "An NFT marketplace that offers an easy way to create and trade NFTs while enjoying low gas fees.",
  },
];

export default function FunctionSection() {
  return (
    <CommonSection
      sectionClassName={styles.functionSection}
      contentClassName={styles.functionContent}
      title="Elevate Your Blockchain Experience with aelf’s AI-enhanced Platform"
      description="We create a simple, scalable and secure environment for developers and users alike."
    >
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageSrc={LandingBlockIllustrationLock}
        contentList={[
          {
            title: "Scalable Multi-Sidechain Architecture",
            description:
              "aelf’s unique multi-sidechain structure and AI-enhanced architecture enables parallel processing, ensuring the network can handle an increasing number of transactions without compromising performance.",
            buttonProps: {
              className: styles.button,
              text: "Learn More",
            },
          },
          {
            title: "High Security and Reliable Performance",
            description:
              "Featuring a modular and cloud-native architecture, aelf guarantees high security and efficiency. This makes it an ideal platform for developers and users seeking a secure and scalable blockchain solution for their AI or non AI dApps. ",
            buttonProps: {
              className: styles.button,
              text: "Read Docs",
            },
          },
        ]}
      />
      <div className={styles.dappsPart}>
        <div className={styles.dappsPartHeader}>
          <div className={styles.dappsPartHeaderLeftWrap}>
            <div className={styles.dappsPartTitle}>
              A Growing Ecosystem of dApps
            </div>
            <div className={styles.dappsPartDescription}>
              Explore and be part of aelf’s growing ecosystem of dApps.
            </div>
          </div>
          <CommonButton className={styles.button} isRound>
            Explore dApps
          </CommonButton>
        </div>
        <div className={styles.dappsPartList}>
          {DAPP_LIST.map((item, index) => (
            <CommonDappCard key={index} {...item} />
          ))}
        </div>
      </div>
    </CommonSection>
  );
}
