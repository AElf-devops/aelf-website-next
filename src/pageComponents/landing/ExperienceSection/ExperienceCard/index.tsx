import clsx from "clsx";
import CommonLink, { ICommonLinkProps } from "@/components/CommonLink";
import CommonImage from "@/components/CommonImage";
import ArrowRightWhite from "@/assets/ArrowRightWhite.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";
import { toSnakeCase } from "../../../../utils";

interface IExperienceCardProps
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  className?: string;
  icon: any;
  title: string;
  description: string;
  arrowText: string;
}

export default function ExperienceCard({
  className,
  icon,
  title,
  description,
  arrowText,
  href,
  isExternalLinkTargetSelf,
}: IExperienceCardProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.experienceCard, deviceClassName, className)}>
      <CommonImage className={styles.icon} src={icon} />
      <div className={styles.experienceCardContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <CommonLink
          className={styles.linkButton}
          href={href}
          isExternalLinkTargetSelf={isExternalLinkTargetSelf}
          onClick={() => {
            window.hj("event", `click_${toSnakeCase(arrowText)}`);
          }}
        >
          <span>{arrowText}</span>
          <CommonImage className={styles.arrowRight} src={ArrowRightWhite} />
        </CommonLink>
      </div>
    </div>
  );
}
