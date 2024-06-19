import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

interface ISectionTitle {
  className?: string;
  children?: React.ReactNode;
}

export default function SectionTitle({ className, children }: ISectionTitle) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.sectionTitle, deviceClassName, className)}>
      {children}
    </div>
  );
}
