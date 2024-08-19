import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import SectionTitle from "../SectionTitle";
import LinkList from "../LinkList";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { TSectionTitleConfig } from "../type";
import styles from "./styles.module.scss";

export interface IDevelopersSectionProps {
  sectionTitleConfig: TSectionTitleConfig;
  developerDocList: IDeveloperDocListItem[];
}

export default function DevelopersSection({
  sectionTitleConfig,
  developerDocList,
}: IDevelopersSectionProps) {
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
      <SectionTitle {...sectionTitleConfig} className={styles.sectionTitle} />
      <Row gutter={[16, 16]}>
        {developerDocList.map((config, index) => (
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
