import clsx from "clsx";
import CommonLink from "@/components/CommonLink";
import CommonImage from "@/components/CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";
import { toSnakeCase } from "../../../../utils";

export interface IBlogItemProps {
  className?: string;
  imageSrc: any;
  imageAlt?: string;
  date: string;
  title: string;
  slug: string;
}

export default function BlogItem({
  className,
  imageSrc,
  imageAlt,
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
      onClick={() => {
        window.hj("event", `click_posts_${toSnakeCase(slug)}`);
      }}
    >
      <CommonImage
        className={styles.image}
        src={imageSrc}
        alt={imageAlt}
        fill
      />
      <div className={styles.info}>
        <div className={styles.date}>{date}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </CommonLink>
  );
}
