import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import CommonButton, { CommonButtonType } from "@/components/CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface IGuideCardItemProps {
  className?: string;
  imageSrc: any;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function GuideCardItem({
  className,
  imageSrc,
  title,
  description,
  buttonText,
  onButtonClick,
}: IGuideCardItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.guideCardItem, deviceClassName, className)}>
      <CommonImage className={styles.image} src={imageSrc} />
      <div className={styles.textWrap}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <CommonButton
        className={styles.button}
        type={CommonButtonType.PRIMARY}
        onClick={onButtonClick}
      >
        {buttonText}
      </CommonButton>
    </div>
  );
}
