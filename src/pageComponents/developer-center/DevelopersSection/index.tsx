import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/NewCommonSection";
import SectionTitle from "../SectionTitle";
import LinkList, { ILinkListProps } from "../LinkList";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const LINK_LIST_CONFIG: ILinkListProps[] = [
  {
    title: "Tools",
    list: [
      {
        linkText: "Web API",
        description: "Interact with the aelf blockchain through the web.",
      },
      {
        linkText: "Smart Contract API",
        description: "Access smart contract functionalities using API.",
      },
      {
        linkText: "Chain SDK",
        description: "Develop blockchain-specific applications using ChainSDK.",
      },
      {
        linkText: "Contract SDK",
        description: "Build and deploy smart contracts with Contract SDK.",
      },
      {
        linkText: "Web Login",
        description: "An SDK for dApp web login.",
      },
      {
        linkText: "aelf CLI",
        description: "Execute blockchain operations via CLI.",
      },
      {
        linkText: "Smart Contract Templates",
        description: "Templates to quickly build your smart contracts.",
      },
      {
        linkText: "Deploy Tools",
        description: "Tools to test and deploy your DApp.",
      },
    ],
  },
  {
    title: "Resources",
    list: [
      {
        linkText: "Wallet and Block Explorer",
        description: "Manage your assets and explore aelf's blockchain data.",
      },
      {
        linkText: "AetherLink",
        description: "Transfer tamper-proof data from off-chain to on-chain.",
      },
      {
        linkText: "Browser Extension",
        description: "Explore Portkey wallet and other extensions.",
      },
      {
        linkText: "DevOps",
        description: "Tools to build and deploy efficiently.",
      },
      {
        linkText: "aelf White Paper",
        description: "Read aelf's whitepaper.",
      },
      {
        linkText: "Protobuf Extension",
        description: "An open-source gRPC.",
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
