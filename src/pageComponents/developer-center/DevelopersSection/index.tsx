import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import SectionTitle from "../SectionTitle";
import LinkList, { ILinkListProps } from "../LinkList";
import Developer from "@/assets/Developer.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const LINK_LIST_CONFIG: ILinkListProps[] = [
  {
    title: "Tools & References",
    list: [
      {
        linkText: "Playground",
        description: "An easy to use sandbox for smart contract development.",
        href: "https://docs.aelf.com/tools/aelf-playground/",
      },
      {
        linkText: "Wallet",
        description: "Integrate your dApp with Portkey wallet.",
        href: "https://portkey.finance/",
      },
      {
        linkText: "Faucet",
        description: "Test your dApp with aelf test tokens.",
        href: "https://docs.aelf.com/tools/faucet/",
      },
      {
        linkText: "Oracle",
        description: "Transfer tamper-proof data from off-chain to on-chain.",
        href: "https://docs.aelf.com/tools/oracle/",
      },
      {
        linkText: "Indexer",
        description: "Query blockchain data from a database.",
        href: "https://www.aefinder.io/",
      },
      {
        linkText: "aelf SDK",
        description: "Develop blockchain specific applications using aelf SDK.",
        href: "https://docs.aelf.com/tools/chain-sdk/",
      },
      {
        linkText: "aelf CLI",
        description: "Execute blockchain operations via CLI.",
        href: "https://docs.aelf.com/tools/aelf-cli/",
      },
    ],
  },
  {
    title: "Resources",
    list: [
      {
        linkText: "Whitepaper 2.0",
        description: "Featuring AI + Blockchain.",
        href: "https://docs.aelf.com/resources/whitepaper-2/",
      },
      {
        linkText: "Tokenomics",
        description: "Economic and Governance.",
        href: "https://docs.aelf.com/resources/tokenomics/",
      },
      {
        linkText: "Other",
        description: "Other resources.",
        href: "https://docs.aelf.com/resources/",
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
      <SectionTitle className={styles.sectionTitle} icon={Developer}>
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
