import { useMemo, useState } from "react";
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
import * as AIPartnersIcon from "@/assets/aiPartners";
import * as DappIcon from "@/assets/dapp";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { SECTION_ID } from "@/constants/sectionId";
import styles from "./styles.module.scss";

enum TabKey {
  AI_PARTNERS = "AI Partners",
  DAPPS = "dApps",
}

const TAB_ITEMS = [
  {
    label: TabKey.AI_PARTNERS,
    key: TabKey.AI_PARTNERS,
  },
  {
    label: TabKey.DAPPS,
    key: TabKey.DAPPS,
  },
];

const AI_PARTNERS_LIST: ICommonCardProps[] = [
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AINetmind,
    iconAlt: "Netmind - aelf AI Partner",
    name: "Netmind",
    tagList: ["Compute", "Dataset", "Model", "Agent"],
    description:
      "Netmind is building the decentralized infrastructure and interconnected ecosystem that will underpin the future of Artificial General Intelligence (AGI).",
    arrowText: "Learn more",
    href: "https://netmind.ai/home",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AIEmc,
    iconAlt: "EMC - aelf AI Partner",
    name: "EMC",
    tagList: ["Compute"],
    description:
      "EMC is a leading multi-chain AI infrastructure paving the way for the future of Decentralized AI (DeAI).",
    arrowText: "Learn more",
    href: "https://emc.network/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AiChaingpt,
    iconAlt: "ChainGPT - aelf AI Partner",
    name: "ChainGPT",
    tagList: ["Chatbot", "NFT Generator"],
    description:
      "ChainGPT is an advanced AI infrastructure that develops AI-powered technologies for the Web3, Blockchain, and Crypto space.",
    arrowText: "Learn more",
    href: "https://www.chaingpt.org/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AIInferium,
    iconAlt: "Inferium - aelf AI Partner",
    name: "Inferium",
    tagList: ["Dataset", "Model"],
    description:
      "Inferium is the pioneer ML-driven intelligent store and aggregator for AI inference.",
    arrowText: "Learn more",
    href: "https://www.inferium.io/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AIW3ai,
    iconAlt: "W3AI - aelf AI Partner",
    name: "W3AI",
    tagList: ["Compute", "Model"],
    description:
      "W3AI is an AI-as-a-service platform powered by DePIN GPUs, a Web3-incentivized collaborative AI marketplace, and AI data storage.",
    arrowText: "Learn more",
    href: "https://aioz.network/w3ai",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AIMagnetai,
    iconAlt: "Magnet.ai - aelf AI Partner",
    name: "Magnet.ai",
    tagList: ["Agent"],
    description:
      "Magnet is a platform that lets users create, share and use action agents.",
    arrowText: "Learn more",
    href: "https://www.magnetlabs.xyz/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AIFlockio,
    iconAlt: "Flock.io - aelf AI Partner",
    name: "Flock.io",
    tagList: ["Model"],
    description:
      "FLock.io is a decentralised AI model training and validation network unicorn, enabling AI models to be trained while data stays local.",
    arrowText: "Learn more",
    href: "https://www.flock.io/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AINeurochain,
    iconAlt: "Neurochain - aelf AI Partner",
    name: "Neurochain",
    tagList: ["Dataset", "Model"],
    description:
      "NeurochainAI is revolutionizing the AI compute market with a consumer-grade hardware network and innovation in AI model quantization to power the AI-driven digital world.",
    arrowText: "Learn more",
    href: "https://www.neurochain.ai/",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: AIPartnersIcon.AINuklai,
    iconAlt: "Nukl.ai - aelf AI Partner",
    name: "Nukl.ai",
    tagList: ["Dataset"],
    description:
      "Nuklai is a layer 1 blockchain infrastructure that fuels LLMs with rich data and decentralized computational performance.",
    arrowText: "Learn more",
    href: "https://www.nukl.ai/",
  },
];

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

const TAB_ITEMS_CHILDREN_CONFIG = {
  [TabKey.AI_PARTNERS]: {
    title: "AI Partners",
    description: "Explore our AI solution partners.",
    listConfig: AI_PARTNERS_LIST,
  },
  [TabKey.DAPPS]: {
    title: "dApps",
    description: "Discover projects across the aelf Ecosystem.",
    listConfig: DAPP_LIST,
  },
};

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

  const [activeTabKey, setActiveTabKey] = useState(TabKey.AI_PARTNERS);

  const onTabsChange = (key: TabKey) => {
    setActiveTabKey(key);
  };

  return (
    <CommonSection
      id={SECTION_ID.ECOSYSTEM.DAPPS}
      sectionClassName={clsx(styles.dappsSection, deviceClassName)}
      contentClassName={styles.dappsContent}
      headerPosition={SectionHeaderPosition.CENTER}
      tabsProps={{
        items: TAB_ITEMS,
        activeKey: activeTabKey,
        onChange: onTabsChange,
      }}
      title={TAB_ITEMS_CHILDREN_CONFIG[activeTabKey].title}
      description={TAB_ITEMS_CHILDREN_CONFIG[activeTabKey].description}
    >
      <Row gutter={rowGutter}>
        {TAB_ITEMS_CHILDREN_CONFIG[activeTabKey].listConfig.map(
          (item, index) => (
            <Col key={index} span={colSpan}>
              <CommonCard className={styles.dappCard} {...item} />
            </Col>
          )
        )}
      </Row>
      {activeTabKey === TabKey.DAPPS && (
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
      )}
    </CommonSection>
  );
}
