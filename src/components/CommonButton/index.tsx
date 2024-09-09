import clsx from "clsx";
import CommonLink, { ICommonLinkProps } from "../CommonLink";
import styles from "./styles.module.scss";
import { toSnakeCase } from "../../utils";

export enum CommonButtonType {
  PRIMARY = "primary",
  DEFAULT = "default",
  GHOST_BLACK = "ghostBlack",
  GHOST_BLUE = "ghostBlue",
  WHITE = "white",
  LINK = "link",
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
  ghostHoverTextColor?: string;
  children?: React.ReactNode;
  hjId?: string;
  onClick?: () => void;
}

export default function CommonButton({
  className,
  type = CommonButtonType.DEFAULT,
  size = CommonButtonSize.MD,
  children,
  href,
  isExternalLinkTargetSelf,
  hjId,
  onClick,
}: ICommonButtonProps) {
  const containerProps = {
    className: clsx(
      className,
      styles.commonButton,
      styles[`${type}Button`],
      styles[`${size}Button`]
    ),
    onClick: () => {
      if (hjId) {
        window.hj("event", `click_${toSnakeCase(hjId)}`);
      }
      onClick?.();
    },
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
