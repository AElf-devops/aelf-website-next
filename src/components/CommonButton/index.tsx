import clsx from "clsx";
import CommonLink, { ICommonLinkProps } from "../CommonLink";
import styles from "./styles.module.scss";

export enum CommonButtonType {
  PRIMARY = "primary",
  DEFAULT = "default",
  GHOST_BLACK = "ghostBlack",
  GHOST_BLUE = "ghostBlue",
  WHITE = "white",
}

export enum CommonButtonSize {
  MD = "md",
  SM = "sm",
}

export interface ICommonButtonProps
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  className?: string;
  type?: CommonButtonType;
  size?: CommonButtonSize;
  isRound?: boolean;
  ghostHoverTextColor?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function CommonButton({
  className,
  isRound = false,
  type = CommonButtonType.DEFAULT,
  size = CommonButtonSize.MD,
  children,
  href,
  isExternalLinkTargetSelf,
  onClick,
}: ICommonButtonProps) {
  const containerProps = {
    className: clsx(
      className,
      styles.commonButton,
      styles[`${type}Button`],
      styles[`${size}Button`],
      {
        [styles.round]: isRound,
      }
    ),
    onClick,
  };

  if (href) {
    return (
      <CommonLink
        {...containerProps}
        href={href}
        isExternalLinkTargetSelf={isExternalLinkTargetSelf}
      >
        {children}
      </CommonLink>
    );
  } else {
    return <div {...containerProps}>{children}</div>;
  }
}
