import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import SectionTitle from "../SectionTitle";
import GuideCardItem, { IGuideCardItemProps } from "./GuideCardItem";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { TSectionTitleConfig } from "../type";
import styles from "./styles.module.scss";

export interface IGuideCardProps {
  sectionTitleConfig: TSectionTitleConfig;
  guideCardList: IGuideCardItemProps[];
}

export default function GuideCard({
  sectionTitleConfig,
  guideCardList,
}: IGuideCardProps) {
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
        return 6;
    }
  }, [deviceWidthType]);

  return (
    <CommonSection
      sectionClassName={clsx(styles.guideCardSection, deviceClassName)}
      mobilePaddingLeftAndRightSize={MobilePaddingLeftAndRightSize.SM}
    >
      <SectionTitle {...sectionTitleConfig} className={styles.sectionTitle} />
      <Row gutter={[16, 16]}>
        {guideCardList.map((cardConfig, index) => (
          <Col key={index} span={colSpan}>
            <GuideCardItem className={styles.cardItem} {...cardConfig} />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
