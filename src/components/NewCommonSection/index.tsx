import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface ICommonSectionProps {
  sectionClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}
export default function CommonSection({
  sectionClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  title,
  description,
  children,
}: ICommonSectionProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <section
      className={clsx([
        styles.commonSection,
        deviceClassName,
        sectionClassName,
      ])}
    >
      <div className={clsx([styles.commonContent, contentClassName])}>
        {title && (
          <div className={clsx(styles.title, titleClassName)}>{title}</div>
        )}
        {description && (
          <div className={clsx(styles.description, descriptionClassName)}>
            {description}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
