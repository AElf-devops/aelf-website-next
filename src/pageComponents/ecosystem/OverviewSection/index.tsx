import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import EcosystemOverview1 from "@/assets/ecosystem/EcosystemOverview1.svg";
import EcosystemOverview2 from "@/assets/ecosystem/EcosystemOverview2.svg";
import EcosystemOverview3 from "@/assets/ecosystem/EcosystemOverview3.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function OverviewSection() {
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
        return 487;
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
        return 480;
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
        return 478;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.overviewSection, deviceClassName)}
      contentClassName={styles.overviewContent}
      headerClassName={styles.overviewHeader}
      title="aelf Ecosystem Overview"
      description="The aelf ecosystem is designed to provide a seamless and integrated experience for developers and users. It encompasses the Portkey Wallet for secure asset management, a variety of decentralized applications (dApps) for different use cases, and the aelevate gaming platform for cutting-edge blockchain gaming."
    >
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageWidth={firstImageWidth}
        desktopAndTabletImagePosition={CommonImageTextPartImagePosition.RIGHT}
        imageSrc={EcosystemOverview1}
        contentList={[
          {
            title: "Portkey Wallet",
            description:
              "Portkey Wallet is a user-friendly and secure account abstraction wallet that facilitates seamless asset management and a smooth Web3 experience. With robust security features and an intuitive interface, Portkey Wallet is the gateway to managing digital assets and interacting with decentralized applications on the aelf blockchain.",
            buttonProps: {
              text: "Learn more",
            },
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageWidth={secondImageWidth}
        imageSrc={EcosystemOverview2}
        contentList={[
          {
            title: "TMRWDAO",
            description:
              "TMRWDAO by aelf is a decentralized autonomous organization that empowers community-driven decision-making and collaboration within the blockchain ecosystem. It promotes decentralization, transparency, and incentivizes contributions, fostering innovation and growth through a democratic governance model where participants share in the ecosystem’s success.",
            buttonProps: {
              text: "Learn more",
            },
          },
        ]}
      />
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageWidth={thirdImageWidth}
        desktopAndTabletImagePosition={CommonImageTextPartImagePosition.RIGHT}
        imageSrc={EcosystemOverview3}
        contentList={[
          {
            title: "Forest",
            description:
              "An NFT marketplace, Forest offers low minting fees, flexible transactions, and personalisation.",
            buttonProps: {
              text: "Learn more",
            },
          },
        ]}
      />
    </CommonSection>
  );
}
