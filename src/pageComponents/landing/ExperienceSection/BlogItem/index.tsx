import clsx from "clsx";
import CommonLink from "@/components/CommonLink";
import CommonImage from "@/components/CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface IBlogItemProps {
  className?: string;
  imageSrc: any;
  date: string;
  title: string;
  slug: string;
}

export default function BlogItem({
  className,
  imageSrc,
  date,
  title,
  slug,
}: IBlogItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonLink
      className={clsx(styles.blogItem, deviceClassName, className)}
      href={`https://blog.aelf.com/posts/${slug}`}
      isExternalLinkTargetSelf
    >
      <CommonImage className={styles.image} src={imageSrc} fill />
      <div className={styles.info}>
        <div className={styles.date}>{date}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </CommonLink>
  );
}
