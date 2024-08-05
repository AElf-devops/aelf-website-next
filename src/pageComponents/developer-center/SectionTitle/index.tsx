import { useMemo } from "react";
import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

interface ISectionTitle {
  className?: string;
  icon?: any;
  children?: React.ReactNode;
}

export default function SectionTitle({
  className,
  icon,
  children,
}: ISectionTitle) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const iconSize = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 30;
      case DeviceWidthType.TABLET:
      case DeviceWidthType.DESKTOP:
      default:
        return 36;
    }
  }, [deviceWidthType]);

  return (
    <div className={clsx(styles.sectionTitle, deviceClassName, className)}>
      {icon && <CommonImage src={icon} width={iconSize} height={iconSize} />}
      <span>{children}</span>
    </div>
  );
}
