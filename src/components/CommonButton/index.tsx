import clsx from "clsx";
import styles from "./styles.module.scss";

export enum CommonButtonType {
  Primary = "primary",
  Default = "default",
  Ghost = "ghost",
}

export enum CommonButtonSize {
  MD = 'md',
  SM = 'sm',
}

export interface ICommonButtonProps {
  className?: string;
  type?: CommonButtonType;
  size?: CommonButtonSize;
  isRound?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function CommonButton({
  className,
  isRound = false,
  type = CommonButtonType.Default,
  size = CommonButtonSize.MD,
  children,
  onClick,
}: ICommonButtonProps) {
  return (
    <div
      className={clsx(className, styles.commonButton, styles[`${type}Button`], styles[`${size}Button`], {
        [styles.round]: isRound,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
