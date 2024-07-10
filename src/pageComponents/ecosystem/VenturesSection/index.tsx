import { useMemo } from "react";
import clsx from "clsx";
import { Row, RowProps, Col } from "antd";
import CommonSection from "@/components/CommonSection";
import CommonImageTextPart, {
  CommonImageTextPartImagePosition,
} from "@/components/CommonImageTextPart";
import CommonCard, { ICommonCardProps } from "@/components/CommonCard";
import Ventures from "@/assets/ecosystem/Ventures.png";
import CrystalFunImg from "@/assets/ecosystem/CrystalFun.png";
import MythicProtocolImg from "@/assets/ecosystem/MythicProtocol.png";
import PlutoImg from "@/assets/ecosystem/Pluto.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { SECTION_ID } from "@/constants/sectionId";
import styles from "./styles.module.scss";

const CARD_LIST: ICommonCardProps[] = [
  {
    icon: CrystalFunImg,
    description:
      "Crystal Fun, a decentralized Web3 game ecosystem, ushering ground breaking experiences with high-quality Web3 games.",
    arrowText: "Learn more",
    href: "https://crystalfun.io/",
  },
  {
    icon: MythicProtocolImg,
    description:
      "Confiction (ex-name: Mythic Protocol) is developing an exhilarating gameplay-first roguelike ARPG with blockchain technology.",
    arrowText: "Learn more",
    href: "https://www.confiction.com/",
  },
  {
    icon: PlutoImg,
    description:
      "Pluto is a gaming studio, with a vision of bridging casual to midcore Web2 into Web3 games across Ton and multichain ecosystems.",
    arrowText: "Learn more",
    href: "https://www.pluto.vision/",
  },
];

export default function VenturesSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const imageTextPartImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 280;
      case DeviceWidthType.DESKTOP:
      default:
        return 422;
    }
  }, [deviceWidthType]);

  const cardRowGutter: RowProps["gutter"] = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return [16, 16];
      case DeviceWidthType.DESKTOP:
      default:
        return 24;
    }
  }, [deviceWidthType]);

  const cardRowSpan = useMemo(() => {
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
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageClassName={styles.imageTextPartImage}
        contentWrapClassName={styles.imageTextPartContentWrap}
        contentListWrapClassName={styles.imageTextPartContentListWrap}
        imageWidth={imageTextPartImageWidth}
        desktopAndTabletImagePosition={
          deviceWidthType === DeviceWidthType.DESKTOP
            ? CommonImageTextPartImagePosition.RIGHT
            : CommonImageTextPartImagePosition.TOP
        }
        imageSrc={Ventures}
        contentList={[
          {
            title: "Funding for Innovation",
            description:
              "aelf Ventures provides financial support to cutting-edge projects that demonstrate strong potential for growth and innovation in the blockchain space.",
          },
          {
            title: "Strategic Mentorship",
            description:
              "Our team of experts offers mentorship and guidance to help startups navigate the complexities of blockchain development and business growth.",
          },
          {
            title: "Building Ecosystem Partnerships",
            description:
              "By fostering strategic partnerships, aelf Ventures helps startups connect with industry leaders, enabling collaborative growth and success.",
          },
        ]}
        contentBottomButtonProps={{
          text: "Speak with Us",
          href: "mailto: ventures@aelf.io",
        }}
      />
      <div className={styles.cardPart}>
        <div className={styles.cardPartTitle}>Our Portfolio</div>
        <Row gutter={cardRowGutter}>
          {CARD_LIST.map((item, index) => (
            <Col key={index} className={styles.cardWrap} span={cardRowSpan}>
              <CommonCard
                className={styles.card}
                iconClassName={styles.cardIcon}
                {...item}
              />
            </Col>
          ))}
        </Row>
      </div>
    </CommonSection>
  );
}
