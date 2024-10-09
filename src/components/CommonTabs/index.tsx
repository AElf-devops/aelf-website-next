import clsx from "clsx";
import styles from "./styles.module.scss";

interface IItem<T> {
  label: string;
  key: T;
}

export interface ICommonTabsProps<T> {
  items: IItem<T>[];
  activeKey: string;
  onChange: (key: T) => void;
}

export default function CommonTabs<T extends string>({
  items,
  activeKey,
  onChange,
}: ICommonTabsProps<T>) {
  return (
    <div className={styles.commonTabs}>
      {items.map(({ label, key }) => (
        <div
          key={key}
          className={clsx(styles.tabItem, {
            [styles.activeTabItem]: key === activeKey,
          })}
          onClick={() => onChange(key)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
