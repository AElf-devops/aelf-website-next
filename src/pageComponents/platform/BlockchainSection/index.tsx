import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import PlatformBlockchain1 from "@/assets/platform/PlatformBlockchain1.png";
import PlatformBlockchain2 from "@/assets/platform/PlatformBlockchain2.png";
import PlatformBlockchain3 from "@/assets/platform/PlatformBlockchain3.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function BlockchainSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const firstImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 280;
      case DeviceWidthType.DESKTOP:
      default:
        return 422;
    }
  }, [deviceWidthType]);

  const secondImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 280;
      case DeviceWidthType.DESKTOP:
      default:
        return 516;
    }
  }, [deviceWidthType]);

  const thirdImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 280;
      case DeviceWidthType.DESKTOP:
      default:
        return 480;
    }
  }, [deviceWidthType]);

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
        imageWidth={firstImageWidth}
        imageSrc={PlatformBlockchain1}
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
        imageWidth={secondImageWidth}
        imageSrc={PlatformBlockchain2}
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
        imageWidth={thirdImageWidth}
        imageSrc={PlatformBlockchain3}
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
                content: "Customizable, incentivized voting ensures collective decision-making.",
              },
              {
                label: "Independent Side-Chains",
                content: "Encourages innovation and prioritizes high-performing alternatives.",
              },
            ],
          },
        ]}
      />
    </CommonSection>
  );
}
