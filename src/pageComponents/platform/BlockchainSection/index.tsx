import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import PlatformIllustrationPlane from "@/assets/platform/PlatformIllustrationPlane.png";
import PlatformIllustrationMachine from "@/assets/platform/PlatformIllustrationMachine.png";
import PlatformIllustrationRoom from "@/assets/platform/PlatformIllustrationRoom.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export default function BlockchainSection() {
  const deviceClassName = useDeviceClass(styles);

  return (
    <CommonSection
      sectionClassName={clsx(styles.platformSection, deviceClassName)}
      contentClassName={styles.platformContent}
      headerClassName={styles.platformHeader}
      title="The aelf Blockchain"
      description="aelf’s innovative multi-chain architecture, featuring a main chain and multiple side chains, coupled with AI agents, boosts scalability and enables efficient handling of complex transactions."
    >
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageSrc={PlatformIllustrationPlane}
        contentList={[
          {
            title: "Scalability & Speed",
            descriptionList: [
              {
                label: "Efficient Side-Chains",
                content:
                  "Customizable side-chains offer dedicated environments tailored for diverse business needs.",
              },
              {
                label: "Parallel Processing",
                content:
                  "Multiple nodes operate concurrently, reducing congestion and enhancing speed.",
              },
              {
                label: "High TPS",
                content:
                  "Each side-chain can handle up to 35,000 transactions per second, ensuring rapid processing.",
              },
            ],
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageSrc={PlatformIllustrationMachine}
        desktopAndTabletImagePosition={CommonImageTextPartImagePosition.RIGHT}
        contentList={[
          {
            title: "Node Validation",
            descriptionList: [
              {
                label: "Smart Indexing",
                content:
                  "The main-chain tracks side-chain activities with Merkle Tree Root indexing.",
              },
              {
                label: "Efficient Validation",
                content:
                  "P2P messaging and Delegated Proof-of-Stake (DPoS) ensure swift and reliable transaction validation.",
              },
            ],
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageSrc={PlatformIllustrationRoom}
        contentList={[
          {
            title: "Democratic Governance",
            descriptionList: [
              {
                label: "Decentralized DAO",
                content: "Fully decentralized DAO governance.",
              },
              {
                label: "Node Election",
                content: "Production and candidate nodes share rewards.",
              },
              {
                label: "Transparent Voting",
                content:
                  "Customizable, incentivized voting ensures collective decision-making.",
              },
              {
                label: "Independent Side-Chains",
                content:
                  "Encourages innovation and prioritizes high-performing alternatives.",
              },
            ],
          },
        ]}
      />
    </CommonSection>
  );
}
