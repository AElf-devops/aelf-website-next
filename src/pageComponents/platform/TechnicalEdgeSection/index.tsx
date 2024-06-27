import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection from "@/components/CommonSection";
import EdgeItem, { IEdgeItemProps } from "./EdgeItem";
import PlatformCode from "@/assets/platform/PlatformCode.svg";
import PlatformNumber from "@/assets/platform/PlatformNumber.svg";
import PlatformOptimization from "@/assets/platform/PlatformOptimization.svg";
import PlatformShell from "@/assets/platform/PlatformShell.svg";
import PlatformTrafficLight from "@/assets/platform/PlatformTrafficLight.svg";
import PlatformUser from "@/assets/platform/PlatformUser.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const EDGE_LIST_CONFIG: IEdgeItemProps[] = [
  {
    icon: PlatformShell,
    title: "Envisioned as the AI powered 'Linux system' for Blockchain",
    description:
      "aelf offers a customizable shell for diverse applications along with AI driven enhancements.",
  },
  {
    icon: PlatformCode,
    title: "Build on C#",
    description: "Top 5 most popular coding language",
  },
  {
    icon: PlatformNumber,
    title: "aelf’s Commitment",
    description: "to growing & supporting developers",
  },
  {
    icon: PlatformOptimization,
    title: "Continuous Optimization",
    description: "& upgrades to aelf technology stack",
  },
  {
    icon: PlatformTrafficLight,
    title: "Anti-Congestion",
    description:
      "Experience smooth operations with our anti-congestion measures powered by AI agents",
  },
  {
    icon: PlatformUser,
    title: "Wallet Gateway to Web3",
    description: "No need for seed phrases, simply access via social logins",
  },
];

export default function TechnicalEdgeSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const rowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return [48, 48];
      case DeviceWidthType.DESKTOP:
      default:
        return [48, 64];
    }
  }, [deviceWidthType]);

  const colSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 12;
      case DeviceWidthType.TABLET:
      case DeviceWidthType.DESKTOP:
      default:
        return 8;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.technicalEdgeSection, deviceClassName)}
      headerClassName={styles.technicalEdgeHeader}
      title="aelf’s Technical Edge"
      description="aelf aims to create a highly efficient, scalable, and customizable blockchain infrastructure to support a wide range of applications and industries."
    >
      <Row className={styles.edgeList} gutter={rowGutter}>
        {EDGE_LIST_CONFIG.map((config, index) => (
          <Col key={index} span={colSpan}>
            <EdgeItem className={styles.edgeItem} {...config} />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
