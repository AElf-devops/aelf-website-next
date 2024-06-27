import { useMemo } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImageTextPart, { CommonImageTextPartImagePosition } from "@/components/CommonImageTextPart";
import PlatformBridge from "@/assets/platform/PlatformBridge.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export default function BridgeSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const imageWidth = useMemo(() => {
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

  return (
    <CommonSection
      sectionClassName={clsx(styles.bridgeSection, deviceClassName)}
      headerClassName={styles.bridgeHeader}
      title="Overcoming the Web3 Adoption Barrier"
      description="aelf’s technology bridges the gap between Web2 and Web3, enabling seamless integration for businesses and developers."
    >
      <CommonImageTextPart
        className={styles.imageTextPart}
        imageClassName={styles.imageTextPartImage}
        contentListWrapClassName={styles.imageTextPartContentListWrap}
        contentItemClassName={styles.imageTextPartContentItem}
        imageWidth={imageWidth}
        desktopAndTabletImagePosition={
          deviceWidthType === DeviceWidthType.DESKTOP
            ? CommonImageTextPartImagePosition.RIGHT
            : CommonImageTextPartImagePosition.TOP
        }
        imageSrc={PlatformBridge}
        contentList={[
          {
            title: "Simplified Gateway into web3",
            description:
              "Portkey wallet simplifies web3 interaction with a user-friendly social login interface, enhancing overall user experience.",
          },
          {
            title: "Anti-scam safeguards",
            description:
              "SEED credentials, an anti-scam mechanism, safeguard users from counterfeit tokens and fraudulent activities.",
          },
          {
            title: "Trusted enterprise content",
            description:
              "Friendly towards developers and projects built on Web2 platforms.",
          },
          {
            title: "Web3 Starter Pack",
            description:
              "The Web3 Starter Pack provides developers with easy to use resources and guidance, facilitating innovation and project development.",
          },
        ]}
      />
    </CommonSection>
  );
}
