import clsx from "clsx";
import CommonImage from "../CommonImage";
import CommonButton from "../CommonButton";
import styles from "./styles.module.scss";

export enum CommonImageTextPartImagePosition {
  Left = "left",
  Right = "right",
}

interface IContentItemButtonProps {
  className?: string;
  text: string;
  onClick?: () => void;
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
  imageWidth?: number;
  rowGap?: number;
  contentList: ICommonImageTextPartContentItem[];
}

const DEFAULT_IMAGE_WIDTH = 506;

const DEFAULT_ROW_GAP = 157;

export default function CommonImageTextPart({
  className,
  imageClassName,
  imagePosition = CommonImageTextPartImagePosition.Left,
  imageSrc,
  imageWidth = DEFAULT_IMAGE_WIDTH,
  rowGap = DEFAULT_ROW_GAP,
  contentList,
}: ICommonImageTextPartProps) {
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
      className={clsx(styles.commonImageTextPart, className, {
        [styles.directionReverse]:
          imagePosition === CommonImageTextPartImagePosition.Right,
      })}
      style={{ gap: rowGap }}
    >
      <CommonImage
        className={clsx(styles.image, imageClassName)}
        style={{ width: imageWidth }}
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
