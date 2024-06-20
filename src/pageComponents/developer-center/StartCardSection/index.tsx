import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, { MobilePaddingLeftAndRightSize } from "@/components/NewCommonSection";
import SectionTitle from "../SectionTitle";
import StartCardItem, { IStartCardItemProps } from "./StartCardItem";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const START_CARD_LIST_CONFIG: IStartCardItemProps[] = [
  {
    text: "Setup your development environment",
  },
  {
    text: "Create your first web3 dApp",
  },
  {
    text: "Run aelf side chain",
  },
];

export default function StartCardSection() {
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
        return 8;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.startCardSection, deviceClassName)}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <SectionTitle className={styles.sectionTitle}>
        Let’s get it on
      </SectionTitle>
      <Row gutter={[16, 16]}>
        {START_CARD_LIST_CONFIG.map((config, index) => (
          <Col key={index} span={colSpan}>
            <StartCardItem className={styles.startCardItem} {...config} />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
