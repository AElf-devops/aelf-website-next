import clsx from "clsx";
import CommonImage from "../CommonImage";
import styles from "./styles.module.scss";

export interface ICommonDappCardProps {
  className?: string;
  icon: any;
  name: string;
  tagList?: string[];
  description: string;
}

export default function CommonDappCard({
  className,
  icon,
  name,
  tagList,
  description,
}: ICommonDappCardProps) {
  return (
    <div className={clsx(styles.commonDappCard, className)}>
      <div className={styles.header}>
        <CommonImage className={styles.dappIcon} src={icon} />
        <div className={styles.headerRight}>
          <div className={styles.dappName}>{name}</div>
          {!!tagList?.length && (
            <div className={styles.dappTagList}>
              {tagList.map((text, index) => (
                <div key={index} className={styles.dappTag}>{text}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
