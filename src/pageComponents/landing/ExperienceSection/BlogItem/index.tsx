import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
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
  return (
    <div className={clsx(styles.blogItem, className)}>
      <CommonImage className={styles.image} src={imageSrc} />
      <div className={styles.info}>
        <div className={styles.date}>{date}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
}
