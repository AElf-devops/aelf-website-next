import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection, {
  SectionHeaderPosition,
} from "@/components/NewCommonSection";
import CommonCard, {
  CommonCardTheme,
  ICommonCardProps,
} from "@/components/CommonCard";
import CommonButton, {
  CommonButtonSize,
  CommonButtonType,
} from "@/components/CommonButton";
import {
  DappPortkey,
  DappSchrödinger,
  DappForest,
  DappBeanGoTown,
  DappAwaken,
  DappETransfer,
} from "@/assets/dapp";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const DAPP_LIST: ICommonCardProps[] = [
  {
    theme: CommonCardTheme.WHITE,
    icon: DappPortkey,
    name: "Portkey",
    tagList: ["Wallet", "SDK", "Mainnet"],
    description:
      "An Account Abstraction Wallet for you to seamlessly transition from Web2 to Web3.",
    arrowText: "Learn more",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappSchrödinger,
    name: "Project Schrödinger",
    tagList: ["AI", "Mainnet"],
    description:
      "Al-powered ACS-404 inscription allowing you to adopt cats and enjoy the fun of dynamic gameplay and unpredictable transformation.",
    arrowText: "Learn more",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappForest,
    name: "Forest",
    tagList: ["Web3", "NFT", "Mainnet"],
    description:
      "An NFT marketplace that offers an easy way to create and trade NFTs while enjoying low gas fees.",
    arrowText: "Learn more",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappBeanGoTown,
    name: "BeanGo Town",
    tagList: ["Game", "Wallet"],
    description:
      "A fully on-chain Web3 game, powered by Portkey’s SDK and aelf blockchain.",
    arrowText: "Learn more",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappAwaken,
    name: "AwakenSwap",
    tagList: ["DeFi", "Mainnet"],
    description: "Swap, lend and borrow crypto assets on one DeFi platform.",
    arrowText: "Learn more",
  },
  {
    theme: CommonCardTheme.WHITE,
    icon: DappETransfer,
    name: "ETransfer",
    tagList: ["DeFi", "Mainnet"],
    description:
      "A secure and efficient digital asset transfer solution to facilitate seamless transactions across different blockchain networks.",
    arrowText: "Learn more",
  },
];

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

  return (
    <CommonSection
      sectionClassName={clsx(styles.dappsSection, deviceClassName)}
      contentClassName={styles.dappsContent}
      headerPosition={SectionHeaderPosition.CENTER}
      title="dApps"
      description="Discover projects across the aelf Ecosystem."
    >
      <Row gutter={rowGutter}>
        {DAPP_LIST.map((item, index) => (
          <Col key={index} span={colSpan}>
            <CommonCard className={styles.dappCard} {...item} />
          </Col>
        ))}
      </Row>
      <CommonButton
        type={CommonButtonType.GHOST_BLACK}
        size={
          deviceWidthType === DeviceWidthType.DESKTOP
            ? CommonButtonSize.MD
            : CommonButtonSize.SM
        }
        isRound
      >
        Submit a Project
      </CommonButton>
    </CommonSection>
  );
}
