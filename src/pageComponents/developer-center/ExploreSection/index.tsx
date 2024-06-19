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
        linkText: "Overview",
        description: "Introduction to aelf blockchain.",
      },
      {
        linkText: "Development environment",
        description: "Setting up your development environment.",
      },
      {
        linkText: "Smart contracts",
        description: "Writing and deploying smart contracts on aelf.",
      },
      {
        linkText: "Build a web3 dApp",
        description: "Creating your first web3 dApp.",
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
    ],
  },
  {
    title: "Documentation",
    list: [
      {
        linkText: "Core",
        description: "Fundamental blockchain architecture components.",
      },
      {
        linkText: "Cross-chain",
        description: "Understand aelf's mainchain and sidechain.",
      },
      {
        linkText: "Smart contract",
        description: "Understand the execution of decentralised code.",
      },
    ],
  },
];

export default function ExploreSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const rowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return [16, 32];
      case DeviceWidthType.Tablet:
        return [16, 32];
      case DeviceWidthType.Desktop:
      default:
        return [32, 32];
    }
  }, [deviceWidthType]);

  const colSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return 24;
      case DeviceWidthType.Tablet:
        return 12;
      case DeviceWidthType.Desktop:
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
