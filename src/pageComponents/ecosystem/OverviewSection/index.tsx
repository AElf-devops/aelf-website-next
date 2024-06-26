import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import EcosystemOverview1 from "@/assets/ecosystem/EcosystemOverview1.png";
import EcosystemOverview2 from "@/assets/ecosystem/EcosystemOverview2.png";
import EcosystemOverview3 from "@/assets/ecosystem/EcosystemOverview3.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { SECTION_ID } from "@/constants/sectionId";
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
        return 460;
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
        return 422;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      id={SECTION_ID.ECOSYSTEM.OVERVIEW}
      sectionClassName={clsx(styles.overviewSection, deviceClassName)}
      contentClassName={styles.overviewContent}
      headerClassName={styles.overviewHeader}
      title="aelf Ecosystem Overview"
      description="The aelf ecosystem is designed to provide a seamless and integrated experience for developers and users. It encompasses the Portkey Wallet for secure cross-chain asset management, and a diverse array of decentralized applications (dApps) tailored to various use cases."
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
              href: "https://portkey.finance/",
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
            title: "Project Schrödinger",
            description:
              "Project Schrödinger is an Al-powered ACS-404 inscription allowing you to adopt cats and enjoy the fun of dynamic gameplay and unpredictable transformation.",
            buttonProps: {
              text: "Learn more",
              href: "https://schrodingernft.ai/",
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
            title: "ETransfer",
            description:
              "ETransfer is a secure and efficient digital asset transfer solution designed to facilitate seamless transactions across different blockchain networks, ensuring speed, reliability, and low transaction costs.",
            buttonProps: {
              text: "Learn more",
              href: "https://etransfer.exchange/",
            },
          },
        ]}
      />
    </CommonSection>
  );
}
