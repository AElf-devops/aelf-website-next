import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonSection, {
  MobilePaddingLeftAndRightSize,
} from "@/components/CommonSection";
import SectionTitle from "../SectionTitle";
import GuideCardItem, { IGuideCardItemProps } from "./GuideCardItem";
import * as DeveloperGuideCard from "@/assets/developer-center/developerGuideCard";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const GUIDE_CARD_CONFIG: IGuideCardItemProps[] = [
  {
    imageSrc: DeveloperGuideCard.DeveloperGuideCard1,
    title: "Build on aelf",
    description: "Build next gen dApps on aelf.",
    buttonProps: {
      text: "Start Building",
      href: "https://docs.aelf.com/quick-start/developers/",
    },
  },
  {
    imageSrc: DeveloperGuideCard.DeveloperGuideCard2,
    title: "aelf’s architecture",
    description: "Deep dive into aelf blockchain's architecture.",
    buttonProps: {
      text: "Explore More",
      href: "https://docs.aelf.com/learn/",
    },
  },
  {
    imageSrc: DeveloperGuideCard.DeveloperGuideCard3,
    title: "Setup local environment",
    description: "Configure your development environment.",
    buttonProps: {
      text: "Set it Up",
      href: "https://docs.aelf.com/tools/setup-local-environment/",
    },
  },
  {
    imageSrc: DeveloperGuideCard.DeveloperGuideCard4,
    title: "Playground",
    description:
      "Build, deploy and test aelf programs and smart contracts from a browser IDE.",
    buttonProps: {
      text: "Try it Out",
      href: "https://docs.aelf.com/tools/aelf-playground/",
    },
  },
];

export default function GuideCard() {
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
      <SectionTitle className={styles.sectionTitle}>
        How would you like to get started?
      </SectionTitle>
      <Row gutter={[16, 16]}>
        {GUIDE_CARD_CONFIG.map((cardConfig, index) => (
          <Col key={index} span={colSpan}>
            <GuideCardItem className={styles.cardItem} {...cardConfig} />
          </Col>
        ))}
      </Row>
    </CommonSection>
  );
}
