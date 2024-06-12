import clsx from "clsx";
import styles from "./styles.module.scss";

export enum CommonButtonType {
  Primary = "primary",
  Default = "default",
}

interface ICommonButtonProps {
  className?: string;
  type?: CommonButtonType;
  isRound?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function CommonButton({
  className,
  isRound = false,
  type = CommonButtonType.Default,
  children,
  onClick,
}: ICommonButtonProps) {
  return (
    <div
      className={clsx(className, styles.commonButton, styles[`${type}Button`], {
        [styles.round]: isRound,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
