import clsx from "clsx";
import CommonLink, { ICommonLinkProps } from "@/components/CommonLink";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

interface ILinkListItem
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  linkText: string;
  description: string;
}

export interface ILinkListProps {
  className?: string;
  listWrapGap?: number;
  title: string;
  list: ILinkListItem[];
}

export default function LinkList({
  className,
  listWrapGap,
  title,
  list,
}: ILinkListProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.linkList, deviceClassName, className)}>
      <div className={styles.title}>{title}</div>
      <div
        className={styles.listWrap}
        style={listWrapGap ? { gap: listWrapGap } : undefined}
      >
        {list.map((item, index) => (
          <div key={index} className={styles.listItem}>
            <CommonLink
              className={styles.link}
              href={item.href}
              isExternalLinkTargetSelf={item.isExternalLinkTargetSelf}
            >
              {item.linkText}
            </CommonLink>
            <div className={styles.description}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
