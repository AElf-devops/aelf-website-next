import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface ITokenomicsItemProps {
  className?: string;
  img: any;
  title: string;
  description: string;
}

export default function TokenomicsItem({
  className,
  img,
  title,
  description,
}: ITokenomicsItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.tokenomicsItem, deviceClassName, className)}>
      <CommonImage className={styles.image} src={img} />
      <div className={styles.textWrap}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
