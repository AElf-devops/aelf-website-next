import clsx from "clsx";
import CommonLink, { ICommonLinkProps } from "@/components/CommonLink";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";
import { toSnakeCase } from "../../../utils";

interface ILinkListItem
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  linkText: string;
  description: string;
}

interface IGroupItem {
  subtitle?: string;
  list: ILinkListItem[];
}

export interface ILinkListProps {
  className?: string;
  listWrapGap?: number;
  title: string;
  list?: ILinkListItem[];
  groups?: IGroupItem[];
}

export default function LinkList({
  className,
  listWrapGap,
  title,
  list,
  groups,
}: ILinkListProps) {
  const deviceClassName = useDeviceClass(styles);

  const renderList = (data: ILinkListItem[]) => (
    <div
      className={styles.listWrap}
      style={listWrapGap ? { gap: listWrapGap } : undefined}
    >
      {data.map((item, index) => (
        <div key={index} className={styles.listItem}>
          <CommonLink
            className={styles.link}
            href={item.href}
            isExternalLinkTargetSelf={item.isExternalLinkTargetSelf}
            onClick={() => {
              window.hj("event", `click_${toSnakeCase(item.linkText)}`);
            }}
          >
            {item.linkText}
          </CommonLink>
          <div className={styles.description}>{item.description}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={clsx(styles.linkList, deviceClassName, className)}>
      <div className={styles.title}>{title}</div>
      {groups?.length ? (
        <div className={styles.groupWrap}>
          {groups.map((group, index) => (
            <div key={index} className={styles.group}>
              {group.subtitle && (
                <div className={styles.subtitle}>{group.subtitle}</div>
              )}
              {renderList(group.list)}
            </div>
          ))}
        </div>
      ) : (
        renderList(list || [])
      )}
    </div>
  );
}
