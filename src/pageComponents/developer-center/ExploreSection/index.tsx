import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import SectionTitle from "../SectionTitle";
import LinkList, { ILinkListProps } from "../LinkList";
import Explore from "@/assets/Explore.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const EXPLORE_LIST_CONFIG: ILinkListProps[] = [
  {
    title: "QuickStart",
    groups: [
      {
        subtitle: "For Developers:",
        list: [
          {
            linkText: "Hello World Contract",
            description: "Simplest contract to get you started.",
            href: "https://docs.aelf.com/quick-start/developers/hello-world-contract/",
          },
          {
            linkText: "Lottery Game Contract",
            description: "Moderately complex smart contract.",
            href: "https://docs.aelf.com/quick-start/developers/lottery-game-smart-contract/",
          },
          {
            linkText: "Vote Contract",
            description: "Slightly more complex contract.",
            href: "https://docs.aelf.com/quick-start/developers/vote-contract/",
          },
        ],
      },
      {
        subtitle: "For Node Operators:",
        list: [
          {
            linkText: "Operations",
            description: "Steps to become a BP.",
            href: "https://docs.aelf.com/quick-start/node-operators/operations/",
          },
          {
            linkText: "Run a Testnet Node",
            description: "Set up and run a node on Testnet.",
            href: "https://docs.aelf.com/quick-start/node-operators/run-a-testnet-node",
          },
          {
            linkText: "Run a Mainnet Node",
            description: "Learn how to join the Mainnet.",
            href: "https://docs.aelf.com/quick-start/node-operators/run-a-mainnet-node/",
          },
          {
            linkText: "Simulation in the Local Environment",
            description: "Explore setting up a full node.",
            href: "https://docs.aelf.com/quick-start/node-operators/simulation-in-local-environment/",
          },
          {
            linkText: "Creation of a Side Chain",
            description: "Explore how to create a side chain.",
            href: "https://docs.aelf.com/quick-start/node-operators/explore-running-aelf-side-chain/",
          },
        ],
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
        linkText: "Smart Contract",
        description: "aelf's smart contract architecture.",
        href: "https://docs.aelf.com/learn/smart-contract/",
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
        linkText: "ACS Introduction",
        description: "An introduction to aelf contract system.",
        href: "https://docs.aelf.com/learn/acs-introduction/",
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
        return 12;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.exploreSection, deviceClassName)}
      contentClassName={styles.exploreContent}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <SectionTitle className={styles.sectionTitle} icon={Explore}>
        Explore aelf
      </SectionTitle>
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
