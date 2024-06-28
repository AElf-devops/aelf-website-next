import { useCallback, useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImageTextPart from "@/components/CommonImageTextPart";
import CommonButton, {
  CommonButtonSize,
  CommonButtonType,
} from "@/components/CommonButton";
import CommonCard, {
  CommonCardTheme,
  ICommonCardProps,
} from "@/components/CommonCard";
import LandingBlockIllustrationLock from "@/assets/landing/LandingBlockIllustrationLock.svg";
import { DappPortkey, DappEbridge, DappForest } from "@/assets/dapp";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const DAPP_LIST: ICommonCardProps[] = [
  {
    className: styles.dappCard,
    theme: CommonCardTheme.WHITE,
    icon: DappPortkey,
    name: "Portkey",
    tagList: ["Wallet"],
    description:
      "An Account Abstraction Wallet for you to seamlessly transition from Web2 to Web3.",
    href: "https://portkey.finance/",
  },
  {
    className: styles.dappCard,
    theme: CommonCardTheme.WHITE,
    icon: DappEbridge,
    name: "eBridge",
    tagList: ["Bridge"],
    description:
      "A simple to use cross-chain bridge between aelf and the EVM compatible chains.",
    href: "https://ebridge.exchange/",
  },
  {
    className: styles.dappCard,
    theme: CommonCardTheme.WHITE,
    icon: DappForest,
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
        type={CommonButtonType.GHOST_BLACK}
        size={buttonSize}
        isRound
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
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageClassName={styles.imageTextPartImage}
        imageSrc={LandingBlockIllustrationLock}
        contentList={[
          {
            title: "Scalable Multi-Sidechain Architecture",
            description:
              "aelf’s unique multi-sidechain structure and AI-enhanced architecture enables parallel processing, ensuring the network can handle an increasing number of transactions without compromising performance.",
            buttonProps: {
              type: CommonButtonType.GHOST_BLACK,
              text: "Learn More",
              href: "/platform",
            },
          },
          {
            title: "High Security and Reliable Performance",
            description:
              "Featuring a modular and cloud-native architecture, aelf guarantees high security and efficiency. This makes it an ideal platform for developers and users seeking a secure and scalable blockchain solution for their AI or non AI dApps. ",
            buttonProps: {
              type: CommonButtonType.GHOST_BLACK,
              text: "Read Docs",
              href: "https://docs.aelf.com",
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
