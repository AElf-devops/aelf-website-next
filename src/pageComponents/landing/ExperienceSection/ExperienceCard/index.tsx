import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import ArrowRight from "@/assets/ArrowRight.svg";
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
  return (
    <div className={clsx(styles.experienceCard, className)}>
      <CommonImage className={styles.icon} src={icon} />
      <div className={styles.experienceCardContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.linkButton} onClick={buttonProps.onClick}>
          <span>{buttonProps.text}</span>
          <CommonImage className={styles.arrowRight} src={ArrowRight} />
        </div>
      </div>
    </div>
  );
}
