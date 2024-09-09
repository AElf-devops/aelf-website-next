import { Fragment, useMemo, ReactNode } from "react";
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

interface IDescriptionListItem {
  label: string;
  content: string;
}

interface IButtonProps
  extends Pick<
    ICommonButtonProps,
    "className" | "type" | "href" | "isExternalLinkTargetSelf" | "onClick"
  > {
  text: string;
}

export interface ICommonImageTextPartContentItem {
  title: string;
  description?: string;
  descriptionList?: IDescriptionListItem[];
  buttonProps?: IButtonProps;
}

type TCommonImageTextPartProps = {
  className?: string;
  contentWrapClassName?: string;
  contentListWrapClassName?: string;
  contentItemClassName?: string;
  desktopAndTabletImagePosition?: CommonImageTextPartImagePosition;
  contentList: ICommonImageTextPartContentItem[];
  contentBottomButtonProps?: IButtonProps;
} & (
  | {
      imageClassName?: string;
      imageSrc: any;
      imageAlt?: string;
      imageWidth?: number;
      imageElement?: never;
    }
  | {
      imageClassName?: never;
      imageSrc?: never;
      imageAlt?: never;
      imageWidth?: never;
      imageElement: ReactNode;
    }
);

export default function CommonImageTextPart({
  className,
  imageClassName,
  contentWrapClassName,
  contentListWrapClassName,
  contentItemClassName,
  desktopAndTabletImagePosition = CommonImageTextPartImagePosition.LEFT,
  imageSrc,
  imageAlt,
  imageWidth,
  imageElement,
  contentList,
  contentBottomButtonProps,
}: TCommonImageTextPartProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const defaultImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 325;
      case DeviceWidthType.DESKTOP:
      default:
        return 521;
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
    descriptionList,
    buttonProps,
  }: { index: number } & ICommonImageTextPartContentItem) => {
    return (
      <div
        key={index}
        className={clsx(styles.contentItem, contentItemClassName)}
      >
        <div className={styles.contentItemTitle}>{title}</div>
        {description && (
          <div className={styles.contentItemDescription}>{description}</div>
        )}
        {!!descriptionList?.length && (
          <ul className={styles.contentItemDescriptionList}>
            {descriptionList.map((item, idx) => (
              <Fragment key={idx}>
                {idx !== 0 && <br />}
                <li>
                  <span className={styles.descriptionListLabel}>
                    {item.label}:&nbsp;
                  </span>
                  <span>{item.content}</span>
                </li>
              </Fragment>
            ))}
          </ul>
        )}
        {buttonProps && (
          <CommonButton
            {...buttonProps}
            className={clsx(styles.contentItemButton, buttonProps.className)}
            size={contentItemButtonSize}
            hjId={buttonProps.text}
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
      {imageElement || (
        <CommonImage
          className={imageClassName}
          width={imageWidth || defaultImageWidth}
          src={imageSrc}
          alt={imageAlt}
        />
      )}
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
            {...contentBottomButtonProps}
            size={contentBottomButtonSize}
            hjId={contentBottomButtonProps.text}
          >
            {contentBottomButtonProps.text}
          </CommonButton>
        )}
      </div>
    </div>
  );
}
