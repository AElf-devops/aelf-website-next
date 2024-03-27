import clsx from "clsx";
import styles from "./styles.module.scss";
import { useDeviceClass } from "@/hooks/useDeviceClass";

export interface ICommonSectionProps {
  sectionClassName?: string;
  contentClassName?: string;
  title?: string;
  children?: React.ReactNode;
}
export const CommonSection = ({
  sectionClassName,
  contentClassName,
  title,
  children,
}: ICommonSectionProps) => {
  const deviceClassName = useDeviceClass(styles);
  return (
    <section
      className={clsx([styles.commonPart, deviceClassName, sectionClassName])}
    >
      <div className={clsx([styles.partContent, contentClassName])}>
        {title && <div className={styles.partTitle}>{title}</div>}
        {children}
      </div>
    </section>
  );
};
