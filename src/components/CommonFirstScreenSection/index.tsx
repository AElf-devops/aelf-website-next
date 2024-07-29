import { useCallback, useMemo } from "react";
import clsx from "clsx";
import CommonSection from "../CommonSection";
import CommonImage from "../CommonImage";
import CommonLink, { ICommonLinkProps } from "../CommonLink";
import CommonButton, { ICommonButtonProps } from "../CommonButton";
import GridBackground from "@/assets/GridBackground.svg";
import ArrowRightBlack from "@/assets/ArrowRightBlack.svg";
import ChevronRightWhite from "@/assets/ChevronRightWhite.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

interface INewTagConfig
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  text: string;
}

interface IButtonProps
  extends Pick<
    ICommonButtonProps,
    "className" | "type" | "href" | "isExternalLinkTargetSelf"
  > {
  text: string;
}

interface ICommonFirstScreenSectionProps {
  id?: string;
  heroImage: any;
  heroShape: any;
  heroAlt?: string;
  title: string | string[];
  description: string;
  newTagConfig?: INewTagConfig;
  buttonList?: IButtonProps[];
}

export default function CommonFirstScreenSection({
  id,
  heroImage,
  heroShape,
  heroAlt = "",
  title,
  description,
  newTagConfig,
  buttonList,
}: ICommonFirstScreenSectionProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const gridBackgroundWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 393;
      case DeviceWidthType.TABLET:
        return 400;
      case DeviceWidthType.DESKTOP:
      default:
        return 656;
    }
  }, [deviceWidthType]);

  const gridBackgroundHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 393;
      case DeviceWidthType.TABLET:
        return 400;
      case DeviceWidthType.DESKTOP:
      default:
        return 656;
    }
  }, [deviceWidthType]);

  const heroImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 345;
      case DeviceWidthType.TABLET:
        return 322;
      case DeviceWidthType.DESKTOP:
      default:
        return 672;
    }
  }, [deviceWidthType]);

  const heroImageHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 237;
      case DeviceWidthType.TABLET:
        return 221;
      case DeviceWidthType.DESKTOP:
      default:
        return 462;
    }
  }, [deviceWidthType]);

  const heroShapeWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 100;
      case DeviceWidthType.DESKTOP:
      default:
        return 225;
    }
  }, [deviceWidthType]);

  const heroShapeHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 100;
      case DeviceWidthType.DESKTOP:
      default:
        return 225;
    }
  }, [deviceWidthType]);

  const renderTitle = useCallback(() => {
    if (Array.isArray(title)) {
      return title.map((row, index) => <p key={index}>{row}</p>);
    } else {
      return title;
    }
  }, [title]);

  return (
    <CommonSection
      id={id}
      sectionClassName={clsx(styles.commonFirstScreenSection, deviceClassName)}
      contentClassName={styles.commonFirstScreenContent}
    >
      <CommonImage
        className={styles.gridBackground}
        src={GridBackground}
        width={gridBackgroundWidth}
        height={gridBackgroundHeight}
        priority
      />
      <div className={styles.introductionPart}>
        {newTagConfig && (
          <CommonLink
            className={styles.newTagWrapper}
            href={newTagConfig.href}
            isExternalLinkTargetSelf={newTagConfig.isExternalLinkTargetSelf}
          >
            <div className={styles.newTag}>NEW</div>
            <div>{newTagConfig.text}</div>
            <CommonImage
              src={ArrowRightBlack}
              width={20}
              height={20}
              priority
            />
          </CommonLink>
        )}
        <div className={styles.title}>{renderTitle()}</div>
        <div className={styles.description}>{description}</div>
        {!!buttonList?.length && (
          <div className={styles.buttonList}>
            {buttonList.map((buttonConfig, index) => (
              <CommonButton
                key={index}
                {...buttonConfig}
                className={clsx(styles.button, buttonConfig.className)}
              >
                <p>{buttonConfig.text}</p>
                <CommonImage
                  src={ChevronRightWhite}
                  width={16}
                  height={16}
                  priority
                />
              </CommonButton>
            ))}
          </div>
        )}
      </div>
      <div className={styles.heroPart}>
        <CommonImage
          className={styles.heroImage}
          src={heroImage}
          width={heroImageWidth}
          height={heroImageHeight}
          alt={heroAlt}
          priority
        />
        <CommonImage
          className={styles.heroShape}
          src={heroShape}
          width={heroShapeWidth}
          height={heroShapeHeight}
          priority
        />
      </div>
    </CommonSection>
  );
}
