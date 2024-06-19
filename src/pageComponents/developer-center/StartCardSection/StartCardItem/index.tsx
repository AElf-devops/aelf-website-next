import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import LogoCircle from "@/assets/LogoCircle.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface IStartCardItemProps {
  className?: string;
  text: string;
  url?: string;
}

export default function StartCardItem({
  className,
  text,
}: IStartCardItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.startCardItem, deviceClassName, className)}>
      <CommonImage className={styles.logo} src={LogoCircle} />
      <div className={styles.text}>{text} ➔</div>
    </div>
  );
}
