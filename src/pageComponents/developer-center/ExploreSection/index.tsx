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
            description:
              "Learn the basics of smart contract syntax and deployment on the aelf blockchain.",
            href: "https://docs.aelf.com/quick-start/developers/hello-world-contract/",
          },
          {
            linkText: "Lottery Game Contract",
            description:
              "Build a simple lottery game showcasing state variables, user interaction, and random number generation.",
            href: "https://docs.aelf.com/quick-start/developers/lottery-game-smart-contract/",
          },
          {
            linkText: "DAO dApp",
            description:
              "Master advanced smart contract logic, security practices, and data management in decentralized autonomous organizations.",
            href: "https://docs.aelf.com/quick-start/developers/dao-dapp/",
          },
          {
            linkText: "NFT dApp",
            description:
              "Explore NFT creation, minting, and token transfers using aelf’s multi-token contract to build your own NFT collection.",
            href: "https://docs.aelf.com/quick-start/developers/nft-dapp/",
          },
          {
            linkText: "ToDo dApp",
            description:
              "Develop a task management system with a focus on state handling, user input, and contract updates in aelf.",
            href: "https://docs.aelf.com/quick-start/developers/todo-dapp/",
          },
          {
            linkText: "Tic-Tac-Toe dApp",
            description:
              "Learn to create a transparent, immutable Tic-Tac-Toe game, applying core concepts of smart contract and dApp development.",
            href: "https://docs.aelf.com/quick-start/developers/tic-tac-toe-dapp/",
          },
        ],
      },
      {
        subtitle: "For Node Operators:",
        list: [
          {
            linkText: "Simulate a BP Node",
            description: "Simulating a block producer (BP) node.",
            href: "https://docs.aelf.com/quick-start/node-operators/simulating-a-bp-node/",
          },
          {
            linkText: "Set up a Testnet Node",
            description: "Set up and run a node on Testnet.",
            href: "https://docs.aelf.com/quick-start/node-operators/set-up-a-node-on-testnet/",
          },
          {
            linkText: "Set up a Mainnet Node",
            description: "Set up and run a node on Mainnet.",
            href: "https://docs.aelf.com/quick-start/node-operators/set-up-a-node-on-mainnet/",
          },
          {
            linkText: "Apply to be a BP",
            description: "Participate in the BP election process.",
            href: "https://docs.aelf.com/quick-start/node-operators/apply-to-be-a-bp/",
          },
          {
            linkText: "Set Up a Side Chain",
            description: "Explore setting up a side chain. ",
            href: "https://docs.aelf.com/quick-start/node-operators/set-up-a-side-chain/",
          },
          {
            linkText: "Run aelf on Cloud",
            description: "Run an aelf node on Google Cloud Platform (GCP).",
            href: "https://docs.aelf.com/quick-start/node-operators/run-aelf-on-cloud/",
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
        linkText: "Boot Sequence",
        description: "Learn about aelf's boot sequence.",
        href: "https://docs.aelf.com/learn/boot-sequence/",
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
        linkText: "Smart Contract",
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
