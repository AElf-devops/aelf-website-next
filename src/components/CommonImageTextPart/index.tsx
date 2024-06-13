import { useMemo } from "react";
import clsx from "clsx";
import CommonImage from "../CommonImage";
import CommonButton, { CommonButtonSize, ICommonButtonProps } from "../CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { DeviceWidthType } from "@/constants/breakpoints";
import { useConfig } from "@/contexts/useConfig/hooks";
import styles from "./styles.module.scss";

export enum CommonImageTextPartImagePosition {
  Left = "left",
  Right = "right",
}

interface IContentItemButtonProps
  extends Pick<ICommonButtonProps, "className" | "onClick"> {
  text: string;
}

export interface ICommonImageTextPartContentItem {
  title: string;
  description: string;
  buttonProps?: IContentItemButtonProps;
}

interface ICommonImageTextPartProps {
  className?: string;
  imageClassName?: string;
  imagePosition?: CommonImageTextPartImagePosition;
  imageSrc: any;
  imageWidth?: number | string;
  rowGap?: number;
  contentList: ICommonImageTextPartContentItem[];
}

export default function CommonImageTextPart({
  className,
  imageClassName,
  imagePosition = CommonImageTextPartImagePosition.Left,
  imageSrc,
  imageWidth,
  rowGap,
  contentList,
}: ICommonImageTextPartProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const defaultImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return "auto";
      case DeviceWidthType.Tablet:
        return 303;
      case DeviceWidthType.Desktop:
      default:
        return 506;
    }
  }, [deviceWidthType]);

  const defaultRowGap = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return 48;
      case DeviceWidthType.Tablet:
        return 38;
      case DeviceWidthType.Desktop:
      default:
        return 157;
    }
  }, [deviceWidthType]);

  const buttonSize = useMemo(
    () =>
      deviceWidthType === DeviceWidthType.Tablet
        ? CommonButtonSize.SM
        : CommonButtonSize.MD,
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
            size={buttonSize}
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
        [styles.directionReverse]:
          imagePosition === CommonImageTextPartImagePosition.Right,
      })}
      style={{ gap: rowGap || defaultRowGap }}
    >
      <CommonImage
        className={clsx(styles.image, imageClassName)}
        style={{ width: imageWidth || defaultImageWidth }}
        src={imageSrc}
      />
      <div className={styles.contentWrap}>
        {contentList.map((item, index) =>
          renderContentItem({
            index,
            ...item,
          })
        )}
      </div>
    </div>
  );
}
