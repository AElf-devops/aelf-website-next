import CommonImage from "@/components/CommonImage";
import styles from "./styles.module.scss";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { clsx } from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";

export interface IToolItemProps {
  img: string | StaticImport;
  title: string;
  content: string;
  className?: string;
}

export const ToolItem = ({
  img,
  title,
  content,
  className,
}: IToolItemProps) => {
  const deviceClassName = useDeviceClass(styles);

  return (
    <div className={clsx([styles.toolItemWrap, deviceClassName, className])}>
      <div className={styles.headWrap}>
        <CommonImage className={styles.toolItemImg} src={img} />
        <div className={styles.toolItemTitle}>{title}</div>
      </div>

      <div className={styles.toolItemContent}>{content}</div>
    </div>
  );
};
