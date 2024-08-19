import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
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

export interface IExploreSectionProps {
  sectionTitleConfig: TSectionTitleConfig;
  exploreList: IExploreListItem[];
}

export default function ExploreSection({
  sectionTitleConfig,
  exploreList,
}: IExploreSectionProps) {
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
        return exploreList.length <= 2 ? 12 : 8;
      default:
        return 12;
    }
  }, [deviceWidthType, exploreList.length]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.exploreSection, deviceClassName)}
      contentClassName={styles.exploreContent}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <SectionTitle {...sectionTitleConfig} className={styles.sectionTitle} />
      <Row gutter={rowGutter}>
        {exploreList.map((config, index) => (
          <Col key={index} span={colSpan}>
            <LinkList className={styles.exploreList} {...config} />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
