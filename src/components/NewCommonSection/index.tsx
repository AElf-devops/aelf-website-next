import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

export enum MobilePaddingLeftAndRightSize {
  MD = "md",
  SM = "sm",
}

export interface ICommonSectionProps {
  sectionClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  mobilePaddingLeftAndRightSize?: MobilePaddingLeftAndRightSize;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}
export default function CommonSection({
  sectionClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  mobilePaddingLeftAndRightSize = MobilePaddingLeftAndRightSize.MD,
  title,
  description,
  children,
}: ICommonSectionProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();
  return (
    <section
      className={clsx([
        styles.commonSection,
        deviceClassName,
        sectionClassName,
        {
          [styles[`${mobilePaddingLeftAndRightSize}MobilePaddingLeftAndRight`]]:
            deviceWidthType === DeviceWidthType.Mobile,
        },
      ])}
    >
      <div className={clsx([styles.commonContent, contentClassName])}>
        {title && (
          <div className={clsx(styles.title, titleClassName)}>{title}</div>
        )}
        {description && (
          <div className={clsx(styles.description, descriptionClassName)}>
            {description}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
