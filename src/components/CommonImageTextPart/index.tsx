import { useMemo } from "react";
import clsx from "clsx";
import CommonImage from "../CommonImage";
import CommonButton, {
  CommonButtonSize,
  ICommonButtonProps,
} from "../CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { DeviceWidthType } from "@/constants/breakpoints";
import { useConfig } from "@/contexts/useConfig/hooks";
import styles from "./styles.module.scss";

export enum CommonImageTextPartImagePosition {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
}

interface IButtonProps
  extends Pick<ICommonButtonProps, "className" | "type" | "onClick"> {
  text: string;
}

export interface ICommonImageTextPartContentItem {
  title: string;
  description: string;
  buttonProps?: IButtonProps;
}

interface ICommonImageTextPartProps {
  className?: string;
  imageClassName?: string;
  contentWrapClassName?: string;
  contentListWrapClassName?: string;
  desktopAndTabletImagePosition?: CommonImageTextPartImagePosition;
  imageSrc: any;
  imageWidth?: number | string;
  contentList: ICommonImageTextPartContentItem[];
  contentBottomButtonProps?: IButtonProps;
}

export default function CommonImageTextPart({
  className,
  imageClassName,
  contentWrapClassName,
  contentListWrapClassName,
  desktopAndTabletImagePosition = CommonImageTextPartImagePosition.LEFT,
  imageSrc,
  imageWidth,
  contentList,
  contentBottomButtonProps,
}: ICommonImageTextPartProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const defaultImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return "auto";
      case DeviceWidthType.TABLET:
        return 303;
      case DeviceWidthType.DESKTOP:
      default:
        return 506;
    }
  }, [deviceWidthType]);

  const contentItemButtonSize = useMemo(
    () =>
      deviceWidthType === DeviceWidthType.TABLET
        ? CommonButtonSize.SM
        : CommonButtonSize.MD,
    [deviceWidthType]
  );

  const contentBottomButtonSize = useMemo(
    () =>
      deviceWidthType === DeviceWidthType.DESKTOP
        ? CommonButtonSize.MD
        : CommonButtonSize.SM,
    [deviceWidthType]
  );

  const renderContentItem = ({
    index,
    title,
    description,
    buttonProps,
  }: { index: number } & ICommonImageTextPartContentItem) => {
    return (
      <div key={index} className={styles.contentItem}>
        <div className={styles.contentItemTitle}>{title}</div>
        <div className={styles.contentItemDescription}>{description}</div>
        {buttonProps && (
          <CommonButton
            className={clsx(styles.contentItemButton, buttonProps.className)}
            isRound
            size={contentItemButtonSize}
            type={buttonProps.type}
            onClick={buttonProps.onClick}
          >
            {buttonProps.text}
          </CommonButton>
        )}
      </div>
    );
  };

  return (
    <div
      className={clsx(styles.commonImageTextPart, deviceClassName, className, {
        [styles[`${desktopAndTabletImagePosition}Image`]]:
          deviceWidthType !== DeviceWidthType.MOBILE,
      })}
    >
      <CommonImage
        className={clsx(styles.image, imageClassName)}
        style={{ width: imageWidth || defaultImageWidth }}
        src={imageSrc}
      />
      <div className={clsx(styles.contentWrap, contentWrapClassName)}>
        <div className={clsx(styles.contentListWrap, contentListWrapClassName)}>
          {contentList.map((item, index) =>
            renderContentItem({
              index,
              ...item,
            })
          )}
        </div>
        {contentBottomButtonProps && (
          <CommonButton
            isRound
            size={contentBottomButtonSize}
            type={contentBottomButtonProps.type}
            onClick={contentBottomButtonProps.onClick}
          >
            {contentBottomButtonProps.text}
          </CommonButton>
        )}
      </div>
    </div>
  );
}
