import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
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
        linkText: "Intro to aelf Development",
        description: "Developer documentation overview.",
        href: "https://docs.aelf.com/quick-start/intro-to-aelf-development/",
      },
      {
        linkText: "Develop your first aelf Smart Contract",
        description: "Smart contract developing demos.",
        href: "https://docs.aelf.com/quick-start/develop-your-first-aelf-smart-contract/",
      },
      {
        linkText: "Become a Node Operator",
        description: "Guide on how to become a BP.",
        href: "https://docs.aelf.com/quick-start/become-a-node-operator/",
      },
      {
        linkText: "Learn how to run on the cloud",
        description: "Explore running aelf on the cloud.",
        href: "https://docs.aelf.com/quick-start/start-and-run-a-node-on-aelf-locally-or-on-cloud/",
      },
      {
        linkText: "Running a side chain",
        description: "Explore running aelf's side chain.",
        href: "https://docs.aelf.com/quick-start/run-a-side-chain/",
      },
      {
        linkText: "Requesting Side Chain Creation",
        description: "Explore requesting the creation of a side chain.",
        href: "https://docs.aelf.com/quick-start/explore-running-aelf-side-chain/",
      },
    ],
  },
  {
    title: "Understanding aelf",
    list: [
      {
        linkText: "Core",
        description: "aelf's core architecture.",
        href: "https://docs.aelf.com/learn/core/",
      },
      {
        linkText: "Cross-chain",
        description: "aelf's cross-chain architecture.",
        href: "https://docs.aelf.com/learn/cross-chain/",
      },
      {
        linkText: "Consensus",
        description: "Understanding aelf's consensus mechanisms.",
        href: "https://docs.aelf.com/learn/consensus/",
      },
      {
        linkText: "Network",
        description: "Exploring aelf's network architecture.",
        href: "https://docs.aelf.com/learn/network/",
      },
      {
        linkText: "Addresses",
        description: "Managing aelf blockchain addresses.",
        href: "https://docs.aelf.com/learn/addresses/",
      },
      {
        linkText: "Transactions",
        description: "Handling transaction processes.",
        href: "https://docs.aelf.com/learn/transactions/",
      },

      {
        linkText: "Smart contract",
        description: "aelf's smart contract architecture.",
        href: "https://docs.aelf.com/learn/smart-contract/",
      },
      {
        linkText: "ACS Introduction",
        description: "An introduction to aelf contract system.",
        href: "https://docs.aelf.com/learn/acs-introduction/",
      },
    ],
  },
  {
    title: "Tutorials",
    list: [
      {
        linkText: "Smart Contract Development",
        description: "Smart contract developing demos.",
        href: "https://docs.aelf.com/quick-start/develop-your-first-aelf-smart-contract/",
      },
      {
        linkText: "Run a Testnet Node",
        description: "Learn how to join the testnet.",
        href: "https://docs.aelf.com/tutorials/operate-a-node/run-a-testnet-node/",
      },
      {
        linkText: "Run a Mainnet Node",
        description: "Learn how to join the mainnet.",
        href: "https://docs.aelf.com/tutorials/operate-a-node/run-a-mainnet-node/",
      },
      {
        linkText: "Run a Side Chain",
        description: "Learn how to run a side chain.",
        href: "https://docs.aelf.com/tutorials/operate-a-node/run-a-side-chain/",
      },
      {
        linkText: "Run aelf on Cloud",
        description: "Getting started with Google Cloud.",
        href: "https://docs.aelf.com/tutorials/operate-a-node/run-aelf-on-cloud/",
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
