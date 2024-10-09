import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import CommonTabs, { ICommonTabsProps } from "../CommonTabs";
import styles from "./styles.module.scss";

export enum MobilePaddingLeftAndRightSize {
  MD = "md",
  SM = "sm",
}

export enum SectionHeaderPosition {
  LEFT = "left",
  CENTER = "center",
}

export interface ICommonSectionProps<T> {
  id?: string;
  sectionClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  mobilePaddingLeftAndRightSize?: MobilePaddingLeftAndRightSize;
  headerPosition?: SectionHeaderPosition;
  tabsProps?: ICommonTabsProps<T>;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}
export default function CommonSection<T extends string>({
  id,
  sectionClassName,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  mobilePaddingLeftAndRightSize = MobilePaddingLeftAndRightSize.MD,
  headerPosition = SectionHeaderPosition.LEFT,
  tabsProps,
  title,
  description,
  children,
}: ICommonSectionProps<T>) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();
  return (
    <section
      id={id}
      className={clsx([
        styles.commonSection,
        deviceClassName,
        sectionClassName,
        {
          [styles[`${mobilePaddingLeftAndRightSize}MobilePaddingLeftAndRight`]]:
            deviceWidthType === DeviceWidthType.MOBILE,
        },
      ])}
    >
      <div className={clsx([styles.commonContent, contentClassName])}>
        {tabsProps && <CommonTabs {...tabsProps} />}
        {(title || description) && (
          <div
            className={clsx(
              styles.header,
              styles[`${headerPosition}Header`],
              headerClassName
            )}
          >
            {title && (
              <div className={clsx(styles.title, titleClassName)}>{title}</div>
            )}
            {description && (
              <div className={clsx(styles.description, descriptionClassName)}>
                {description}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
