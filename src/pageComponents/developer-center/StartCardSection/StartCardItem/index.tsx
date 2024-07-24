import clsx from "clsx";
import CommonLink, { ICommonLinkProps } from "@/components/CommonLink";
import CommonImage from "@/components/CommonImage";
import LogoCircle from "@/assets/LogoCircle.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export interface IStartCardItemProps
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  className?: string;
  text: string;
}

export default function StartCardItem({
  className,
  text,
  href,
  isExternalLinkTargetSelf,
}: IStartCardItemProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.startCardItem, deviceClassName, className)}>
      <CommonImage className={styles.logo} src={LogoCircle} />
      <CommonLink
        className={styles.text}
        href={href}
        isExternalLinkTargetSelf={isExternalLinkTargetSelf}
      >
        {text} ➔
      </CommonLink>
    </div>
  );
}
