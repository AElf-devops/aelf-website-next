import clsx from "clsx";
import CommonImage from "../CommonImage";
import ArrowRightWhite from "@/assets/ArrowRightWhite.svg";
import ArrowRightBlack from "@/assets/ArrowRightBlack.svg";
import styles from "./styles.module.scss";

export enum CommonCardTheme {
  WHITE = "white",
  BLACK = "black",
}

export interface ICommonCardProps {
  className?: string;
  iconClassName?: string;
  theme?: CommonCardTheme;
  icon: any;
  name?: string;
  tagList?: string[];
  description: string;
  arrowText?: string;
}

export default function CommonCard({
  className,
  iconClassName,
  theme = CommonCardTheme.BLACK,
  icon,
  name,
  tagList,
  description,
  arrowText,
}: ICommonCardProps) {
  return (
    <div
      className={clsx(styles.commonCard, className, styles[`${theme}Theme`])}
    >
      <div className={styles.header}>
        <CommonImage className={clsx(styles.icon, iconClassName)} src={icon} />
        {(name || !!tagList?.length) && (
          <div className={styles.headerRight}>
            <div className={styles.name}>{name}</div>
            {!!tagList?.length && (
              <div className={styles.tagList}>
                {tagList.map((text, index) => (
                  <div key={index} className={styles.tag}>
                    {text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.description}>{description}</div>
      {arrowText && (
        <div className={styles.arrowWrap}>
          <span>{arrowText}</span>
          <CommonImage
            className={styles.arrow}
            src={
              theme === CommonCardTheme.WHITE
                ? ArrowRightWhite
                : ArrowRightBlack
            }
          />
        </div>
      )}
    </div>
  );
}
