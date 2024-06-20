import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import ArrowRightWhite from "@/assets/ArrowRightWhite.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

interface IExperienceCardButtonProps {
  text: string;
  onClick?: () => void;
}

interface IExperienceCardProps {
  className?: string;
  icon: any;
  title: string;
  description: string;
  buttonProps: IExperienceCardButtonProps;
}

export default function ExperienceCard({
  className,
  icon,
  title,
  description,
  buttonProps,
}: IExperienceCardProps) {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.experienceCard, deviceClassName, className)}>
      <CommonImage className={styles.icon} src={icon} />
      <div className={styles.experienceCardContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.linkButton} onClick={buttonProps.onClick}>
          <span>{buttonProps.text}</span>
          <CommonImage className={styles.arrowRight} src={ArrowRightWhite} />
        </div>
      </div>
    </div>
  );
}
