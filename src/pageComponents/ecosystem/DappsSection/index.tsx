import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection, {
  SectionHeaderPosition,
} from "@/components/CommonSection";
import CommonCard, {
  CommonCardTheme,
  ICommonCardProps,
} from "@/components/CommonCard";
import CommonButton, {
  CommonButtonSize,
  CommonButtonType,
} from "@/components/CommonButton";
import * as DappIcon from "@/assets/dapp";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { SECTION_ID } from "@/constants/sectionId";
import styles from "./styles.module.scss";

const DAPP_LIST: ICommonCardProps[] = [
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappPortkey,
    iconAlt: "Portkey - web3 AA wallet. aelf's ecosystem.",
    name: "Portkey",
    tagList: ["Wallet", "SDK", "Mainnet"],
    description:
      "An Account Abstraction Wallet for you to seamlessly transition from Web2 to Web3.",
    arrowText: "Learn more",
    href: "https://portkey.finance/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappSchrödinger,
    iconAlt: "Project Schrodinger - AI NFT platform. aelf's ecosystem.",
    name: "Project Schrödinger",
    tagList: ["AI", "Mainnet"],
    description:
      "Al-powered ACS-404 inscription allowing you to adopt cats and enjoy the fun of dynamic gameplay and unpredictable transformation.",
    arrowText: "Learn more",
    href: "https://schrodingernft.ai/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappForest,
    iconAlt: "Forest - NFT marketplace. aelf's ecosystem.",
    name: "Forest",
    tagList: ["Web3", "NFT", "Mainnet"],
    description:
      "An NFT marketplace that offers an easy way to create and trade NFTs while enjoying low gas fees.",
    arrowText: "Learn more",
    href: "https://www.eforest.finance/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappBeanGoTown,
    iconAlt: "BeanGoTown - Web3 game. aelf's ecosystem.",
    name: "BeanGo Town",
    tagList: ["Game", "Mainnet"],
    description:
      "A fully on-chain Web3 game, powered by Portkey’s SDK and aelf blockchain.",
    arrowText: "Learn more",
    href: "https://beangotown.com/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappAwaken,
    iconAlt: "AwakenSwap - decentralised exchange DEX. aelf's ecosystem.",
    name: "AwakenSwap",
    tagList: ["DeFi", "Mainnet"],
    description: "Swap, lend and borrow crypto assets on one DeFi platform.",
    arrowText: "Learn more",
    href: "https://awaken.finance/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappETransfer,
    iconAlt: "ETransfer - Cross-chain bridge. aelf's ecosystem.",
    name: "ETransfer",
    tagList: ["DeFi", "Mainnet"],
    description:
      "A secure and efficient digital asset transfer solution to facilitate seamless transactions across different blockchain networks.",
    arrowText: "Learn more",
    href: "https://etransfer.exchange/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappEbridge,
    iconAlt: "eBridge - Token bridge. aelf's ecosystem.",
    name: "eBridge",
    tagList: ["Bridge", "Mainnet"],
    description:
      "Facilitate seamless token transfer between the aelf blockchain and Ethereum Virtual Machine (EVM) compatible networks.",
    arrowText: "Learn more",
    href: "https://ebridge.exchange/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappEwell,
    iconAlt: "ewell - Initial DEX Offering IDO launchpad. aelf's ecosystem.",
    name: "ewell",
    tagList: ["Launchpad", "Mainnet"],
    description:
      "An Initial DEX Offering (IDO) launchpad on the aelf network designed to facilitate decentralized fundraising and investment.",
    arrowText: "Learn more",
    href: "https://ewell.finance/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappIcon.DappSymbolMarket,
    iconAlt:
      "Symbol Market - Create your own token and NFT with SEEDs. aelf's ecosystem.",
    name: "Symbol Market",
    tagList: ["NFT", "Mainnet"],
    description:
      "A user-friendly platform that allows individuals to create their own tokens and NFTs by acquiring unique SEEDs.",
    arrowText: "Learn more",
    href: "https://www.eforest.finance/symbolmarket",
  },
];

export default function DappsSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const rowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return [16, 16];
      case DeviceWidthType.TABLET:
        return [16, 24];
      case DeviceWidthType.DESKTOP:
      default:
        return [24, 32];
    }
  }, [deviceWidthType]);

  const colSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 24;
      case DeviceWidthType.TABLET:
        return 12;
      case DeviceWidthType.DESKTOP:
      default:
        return 8;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      id={SECTION_ID.ECOSYSTEM.DAPPS}
      sectionClassName={clsx(styles.dappsSection, deviceClassName)}
      contentClassName={styles.dappsContent}
      headerPosition={SectionHeaderPosition.CENTER}
      title="dApps"
      description="Discover projects across the aelf Ecosystem."
    >
      <Row gutter={rowGutter}>
        {DAPP_LIST.map((item, index) => (
          <Col key={index} span={colSpan}>
            <CommonCard className={styles.dappCard} {...item} />
          </Col>
        ))}
      </Row>
      <CommonButton
        type={CommonButtonType.GHOST_BLACK}
        size={
          deviceWidthType === DeviceWidthType.DESKTOP
            ? CommonButtonSize.MD
            : CommonButtonSize.SM
        }
        href="https://form.aelf.com/submit-project"
        hjId="Submit a Project"
      >
        Submit a Project
      </CommonButton>
    </CommonSection>
  );
}
