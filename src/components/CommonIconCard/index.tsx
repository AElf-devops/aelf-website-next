import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import CommonImage from "@/components/CommonImage";
import styles from "./styles.module.scss";

export interface ICommonIconCardProps {
  className?: string;
  titleClassName?: string;
  icon: any;
  iconWidth?: number;
  iconHeight?: number;
  title: string;
  description: string;
}

const DEFAULT_ICON_WIDTH = 48;
const DEFAULT_ICON_HEIGHT = 48;

export default function CommonIconCard({
  className,
  titleClassName,
  icon,
  iconWidth,
  iconHeight,
  title,
  description,
}: ICommonIconCardProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.commonIconCard, deviceClassName, className)}>
      <CommonImage
        src={icon}
        width={iconWidth ?? DEFAULT_ICON_WIDTH}
        height={iconHeight ?? DEFAULT_ICON_HEIGHT}
      />
      <div className={clsx(styles.title, titleClassName)}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
