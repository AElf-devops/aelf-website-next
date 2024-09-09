import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection from "@/components/CommonSection";
import CommonIconCard from "@/components/CommonIconCard";
import CommonCard from "@/components/CommonCard";
import CommonButton, { CommonButtonSize } from "@/components/CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { SECTION_ID } from "@/constants/sectionId";
import { ICON_CARD_LIST, PORTFOLIO_CARD_LIST } from "./constants";
import styles from "./styles.module.scss";

export default function VenturesSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const iconCardRowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return [16, 16];
      case DeviceWidthType.DESKTOP:
      default:
        return [48, 48];
    }
  }, [deviceWidthType]);

  const iconCardColSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 24;
      case DeviceWidthType.TABLET:
      case DeviceWidthType.DESKTOP:
      default:
        return 8;
    }
  }, [deviceWidthType]);

  const iconSize = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 48;
      case DeviceWidthType.DESKTOP:
      default:
        return 64;
    }
  }, [deviceWidthType]);

  const portfolioCardRowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return [16, 16];
      case DeviceWidthType.DESKTOP:
      default:
        return 24;
    }
  }, [deviceWidthType]);

  const portfolioCardRowSpan = useMemo(() => {
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
      id={SECTION_ID.ECOSYSTEM.VENTURES}
      sectionClassName={clsx(styles.venturesSection, deviceClassName)}
      headerClassName={styles.venturesHeader}
      title="aelf Ventures"
      description="aelf Ventures invests in cutting-edge blockchain technology and Web3 protocols. With a USD 50 million ecosystem fund, aelf Ventures is committed to expanding the aelf ecosystem and shaping the future of Web3."
    >
      <div className={styles.iconCardPart}>
        <Row className={styles.iconCardList} gutter={iconCardRowGutter}>
          {ICON_CARD_LIST.map((config, index) => (
            <Col key={index} span={iconCardColSpan}>
              <CommonIconCard
                {...config}
                className={styles.iconCardItem}
                titleClassName={styles.iconCardItemTitle}
                iconWidth={iconSize}
                iconHeight={iconSize}
              />
            </Col>
          ))}
        </Row>
        <CommonButton
          className={styles.speakButton}
          size={
            deviceWidthType === DeviceWidthType.TABLET
              ? CommonButtonSize.SM
              : CommonButtonSize.MD
          }
          href="mailto: ventures@aelf.io"
          hjId="Speak with Us"
        >
          Speak with Us
        </CommonButton>
      </div>
      <div className={styles.portfolioPart}>
        <div className={styles.portfolioPartTitle}>Our Portfolio</div>
        <Row gutter={portfolioCardRowGutter}>
          {PORTFOLIO_CARD_LIST.map((item, index) => (
            <Col
              key={index}
              className={styles.portfolioCardWrap}
              span={portfolioCardRowSpan}
            >
              <CommonCard
                className={styles.portfolioCard}
                iconClassName={styles.portfolioCardIcon}
                {...item}
              />
            </Col>
          ))}
        </Row>
      </div>
    </CommonSection>
  );
}
