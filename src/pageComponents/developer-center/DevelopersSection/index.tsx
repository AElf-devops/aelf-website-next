import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import SectionTitle from "../SectionTitle";
import LinkList, { ILinkListProps } from "../LinkList";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const LINK_LIST_CONFIG: ILinkListProps[] = [
  {
    title: "Tools & References",
    list: [
      {
        linkText: "Web API",
        description: "Interact with the aelf blockchain through the web.",
        href: "https://docs.aelf.com/docs/web-api/",
      },
      {
        linkText: "Smart Contract API",
        description: "Access smart contract functionalities using API.",
        href: "https://docs.aelf.com/docs/smart-contract-api/",
      },
      {
        linkText: "Chain SDK",
        description: "Develop blockchain-specific applications using ChainSDK.",
        href: "https://docs.aelf.com/tools/chain-sdk/",
      },
      {
        linkText: "aelf CLI",
        description: "Execute blockchain operations via CLI.",
        href: "https://docs.aelf.com/tools/aelf-cli/",
      },
      {
        linkText: "Smart Contract Templates",
        description: "Templates to quickly build your smart contracts.",
        href: "https://docs.aelf.com/tools/smart-contract-templates/",
      },
      {
        linkText: "Deploy Tools",
        description: "Tools to test and deploy your DApp.",
        href: "https://docs.aelf.com/tools/aelf-deploy/",
      },
      {
        linkText: "Faucet",
        description: "Test your dApp with aelf test tokens.",
        href: "https://docs.aelf.com/tools/faucet/",
      },
      {
        linkText: "Design",
        description: "Explore aelf design library.",
        href: "https://docs.aelf.com/tools/design/",
      },
    ],
  },
  {
    title: "Resources",
    list: [
      {
        linkText: "Integration Guide",
        description: "Learn how to integrate with other tools and DApps.",
        href: "https://docs.aelf.com/resources/integration-guide/",
      },
      {
        linkText: "Wallet and Block Explorer",
        description: "Manage your assets and explore aelf's blockchain data.",
        href: "https://docs.aelf.com/resources/wallet-and-block-explorer/",
      },
      {
        linkText: "AetherLink",
        description: "Transfer tamper-proof data from off-chain to on-chain.",
        href: "https://docs.aelf.com/resources/aetherLink/",
      },
      {
        linkText: "Browser Extension",
        description: "Explore Portkey wallet and other extensions.",
        href: "https://docs.aelf.com/resources/browser-extension/",
      },
      {
        linkText: "DevOps",
        description: "Tools to build and deploy efficiently.",
        href: "https://docs.aelf.com/resources/devops/",
      },
      {
        linkText: "aelf White Paper",
        description: "Read aelf's whitepaper.",
        href: "https://docs.aelf.com/resources/whitepaper/",
      },
      {
        linkText: "Protobuf Extension",
        description: "An open-source gRPC.",
        href: "https://docs.aelf.com/resources/protobuf-extension/",
      },
    ],
  },
];

export default function DevelopersSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const colSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 24;
      case DeviceWidthType.TABLET:
        return 12;
      case DeviceWidthType.DESKTOP:
      default:
        return 12;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.developersSection, deviceClassName)}
      contentClassName={styles.developersContent}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <SectionTitle className={styles.sectionTitle}>
        For Developers
      </SectionTitle>
      <Row gutter={[16, 16]}>
        {LINK_LIST_CONFIG.map((config, index) => (
          <Col key={index} span={colSpan}>
            <LinkList
              className={styles.linkList}
              listWrapGap={
                deviceWidthType === DeviceWidthType.MOBILE ? 32 : undefined
              }
              {...config}
            />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
