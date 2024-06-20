import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection, { MobilePaddingLeftAndRightSize } from "@/components/NewCommonSection";
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
      },
      {
        linkText: "Joining TestNet",
        description: "Explore aelf's TestNet.",
      },
      {
        linkText: "Joining MainNet",
        description: "Explore aelf's MainNet.",
      },
      {
        linkText: "Running a side chain",
        description: "Explore running aelf's side chain.",
      },
      {
        linkText: "Learn how to run on the cloud",
        description: "Explore running aelf on the cloud.",
      },
      {
        linkText: "DApp example",
        description: "Examples of how DApps work on aelf.",
      },
    ],
  },
  {
    title: "Understanding aelf",
    list: [
      {
        linkText: "Consensus",
        description: "Understanding aelf's consensus mechanisms.",
      },
      {
        linkText: "Network",
        description: "Exploring aelf's network architecture.",
      },
      {
        linkText: "Addresses",
        description: "Managing aelf blockchain addresses.",
      },
      {
        linkText: "Transactions",
        description: "Handling transaction processes.",
      },
      {
        linkText: "Core",
        description: "aelf's core architecture.",
      },
      {
        linkText: "Cross-chain",
        description: "aelf's cross-chain architecture.",
      },
      {
        linkText: "Smart contract",
        description: "aelf's smart contract architecture.",
      },
    ],
  },
  {
    title: "Documentation",
    list: [
      {
        linkText: "ACS Introduction",
        description: "An introduction to aelf contract system.",
      },
      {
        linkText: "Integration Guides",
        description: "Learn how to integrate with other tools and DApps. ",
      },
      {
        linkText: "Design",
        description: "Explore aelf design library.",
      },
      {
        linkText: "Faucet",
        description: "Test your dApp with aelf test tokens.",
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
