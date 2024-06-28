import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface IBlogItemProps {
  className?: string;
  imageSrc: any;
  date: string;
  title: string;
}

export default function BlogItem({
  className,
  imageSrc,
  date,
  title,
}: IBlogItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.blogItem, deviceClassName, className)}>
      <CommonImage className={styles.image} src={imageSrc} />
      <div className={styles.info}>
        <div className={styles.date}>{date}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
}
