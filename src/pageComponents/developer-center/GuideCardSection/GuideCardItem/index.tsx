import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import CommonButton, {
  CommonButtonType,
  ICommonButtonProps,
} from "@/components/CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

interface IButtonProps
  extends Pick<
    ICommonButtonProps,
    "href" | "isExternalLinkTargetSelf" | "onClick"
  > {
  text: string;
}

export interface IGuideCardItemProps {
  className?: string;
  imageSrc: any;
  title: string;
  description: string;
  buttonProps: IButtonProps;
}

export default function GuideCardItem({
  className,
  imageSrc,
  title,
  description,
  buttonProps,
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
        {...buttonProps}
        className={styles.button}
        type={CommonButtonType.PRIMARY}
        hjId={buttonProps.text}
      >
        {buttonProps.text}
      </CommonButton>
    </div>
  );
}
