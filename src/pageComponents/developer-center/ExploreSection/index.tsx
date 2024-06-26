import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/NewCommonSection";
import SectionTitle from "../SectionTitle";
import LinkList, { ILinkListProps } from "../LinkList";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const EXPLORE_LIST_CONFIG: ILinkListProps[] = [
  {
    title: "QuickStart",
    list: [
      {
        linkText: "Operating Nodes",
        description: "Start and run a node on aelf.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Joining TestNet",
        description: "Explore aelf's TestNet.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Joining MainNet",
        description: "Explore aelf's MainNet.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Running a side chain",
        description: "Explore running aelf's side chain.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Learn how to run on the cloud",
        description: "Explore running aelf on the cloud.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "DApp example",
        description: "Examples of how DApps work on aelf.",
        href: "https://docs.aelf.com/",
      },
    ],
  },
  {
    title: "Understanding aelf",
    list: [
      {
        linkText: "Consensus",
        description: "Understanding aelf's consensus mechanisms.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Network",
        description: "Exploring aelf's network architecture.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Addresses",
        description: "Managing aelf blockchain addresses.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Transactions",
        description: "Handling transaction processes.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Core",
        description: "aelf's core architecture.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Cross-chain",
        description: "aelf's cross-chain architecture.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Smart contract",
        description: "aelf's smart contract architecture.",
        href: "https://docs.aelf.com/",
      },
    ],
  },
  {
    title: "Documentation",
    list: [
      {
        linkText: "ACS Introduction",
        description: "An introduction to aelf contract system.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Integration Guides",
        description: "Learn how to integrate with other tools and DApps. ",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Design",
        description: "Explore aelf design library.",
        href: "https://docs.aelf.com/",
      },
      {
        linkText: "Faucet",
        description: "Test your dApp with aelf test tokens.",
        href: "https://docs.aelf.com/",
      },
    ],
  },
];

export default function ExploreSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const rowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return [16, 32];
      case DeviceWidthType.TABLET:
        return [16, 32];
      case DeviceWidthType.DESKTOP:
      default:
        return [32, 32];
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
      sectionClassName={clsx(styles.exploreSection, deviceClassName)}
      contentClassName={styles.exploreContent}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <SectionTitle className={styles.sectionTitle}>Explore aelf</SectionTitle>
      <Row gutter={rowGutter}>
        {EXPLORE_LIST_CONFIG.map((config, index) => (
          <Col key={index} span={colSpan}>
            <LinkList className={styles.exploreList} {...config} />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
