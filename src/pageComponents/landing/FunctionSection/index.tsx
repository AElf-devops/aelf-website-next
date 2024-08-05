import { useCallback, useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonButton, { CommonButtonSize } from "@/components/CommonButton";
import CommonCard, { ICommonCardProps } from "@/components/CommonCard";
import FunctionCardItem, { IFunctionCardItemProps } from "./FunctionCardItem";
import {
  DappPortkeyGray,
  DappEbridgeGray,
  DappForestGray,
} from "@/assets/dapp";
import ArchitectureIcon from "@/assets/Architecture.svg";
import SecurityIcon from "@/assets/Security.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const FUNCTION_CARD_CONFIG: IFunctionCardItemProps[] = [
  {
    icon: ArchitectureIcon,
    title: "Scalable Multi-Sidechain Architecture",
    description:
      "aelf’s unique multi-sidechain structure and AI-enhanced architecture enables parallel processing, ensuring the network can handle an increasing number of transactions without compromising performance.",
    buttonConfig: {
      text: "Learn More",
      href: "/platform",
    },
  },
  {
    icon: SecurityIcon,
    title: "High Security and Reliable Performance",
    description:
      "Featuring a modular and cloud-native architecture, aelf guarantees high security and efficiency. This makes it an ideal platform for developers and users seeking a secure and scalable blockchain solution for their AI or non AI dApps. ",
    buttonConfig: {
      text: "Read Docs",
      href: "https://docs.aelf.com",
    },
  },
];

const DAPP_LIST: ICommonCardProps[] = [
  {
    className: styles.dappCard,
    icon: DappPortkeyGray,
    iconAlt: "Portkey - web3 AA wallet. aelf's ecosystem.",
    name: "Portkey",
    tagList: ["Wallet"],
    description:
      "An Account Abstraction Wallet for you to seamlessly transition from Web2 to Web3.",
    href: "https://portkey.finance/",
  },
  {
    className: styles.dappCard,
    icon: DappEbridgeGray,
    iconAlt: "eBridge - Token bridge. aelf's ecosystem.",
    name: "eBridge",
    tagList: ["Bridge"],
    description:
      "A simple to use cross-chain bridge between aelf and the EVM compatible chains.",
    href: "https://ebridge.exchange/",
  },
  {
    className: styles.dappCard,
    icon: DappForestGray,
    iconAlt: "Forest - NFT marketplace. aelf's ecosystem.",
    name: "Forest",
    tagList: ["NFT"],
    description:
      "An NFT marketplace that offers an easy way to create and trade NFTs while enjoying low gas fees.",
    href: "https://www.eforest.finance/",
  },
];

export default function FunctionSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const buttonSize = useMemo(
    () =>
      deviceWidthType === DeviceWidthType.TABLET
        ? CommonButtonSize.SM
        : CommonButtonSize.MD,
    [deviceWidthType]
  );

  const renderExploreButton = useCallback(
    () => (
      <CommonButton
        className={styles.exploreButton}
        size={buttonSize}
        href="/ecosystem"
      >
        Explore dApps
      </CommonButton>
    ),
    [buttonSize]
  );

  return (
    <CommonSection
      sectionClassName={clsx(styles.functionSection, deviceClassName)}
      title="Elevate Your Blockchain Experience with aelf’s AI-enhanced Platform"
      description="We create a simple, scalable and secure environment for developers and users alike."
    >
      <div className={styles.functionCardWrap}>
        {FUNCTION_CARD_CONFIG.map((config, index) => (
          <FunctionCardItem
            {...config}
            key={index}
            className={styles.functionCardItem}
          />
        ))}
      </div>
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
          {deviceWidthType !== DeviceWidthType.MOBILE && renderExploreButton()}
        </div>
        <div className={styles.dappsPartList}>
          {DAPP_LIST.map((item, index) => (
            <CommonCard key={index} {...item} />
          ))}
        </div>
        {deviceWidthType === DeviceWidthType.MOBILE && renderExploreButton()}
      </div>
    </CommonSection>
  );
}
