import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import CommonImage from "@/components/CommonImage";
import styles from "./styles.module.scss";

export interface IEdgeItemProps {
  className?: string;
  icon: any;
  title: string;
  description: string;
}

export default function EdgeItem({
  className,
  icon,
  title,
  description,
}: IEdgeItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.edgeItem, deviceClassName, className)}>
      <CommonImage className={styles.icon} src={icon} />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
