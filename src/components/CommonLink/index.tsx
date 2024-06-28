import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import styles from "./styles.module.scss";

export interface ICommonLinkProps extends Omit<LinkProps, "href"> {
  className?: string;
  href?: LinkProps["href"];
  isExternalLinkTargetSelf?: boolean;
  children?: React.ReactNode;
}

export default function CommonLink({
  className,
  href,
  isExternalLinkTargetSelf = false,
  children,
  ...props
}: ICommonLinkProps) {
  const isExternalLink =
    typeof href === "string" &&
    (href.startsWith("http://") || href.startsWith("https://"));

  if (isExternalLink) {
    return (
      <a
        {...props}
        className={clsx(styles.commonLink, className)}
        href={href}
        target={isExternalLinkTargetSelf ? "_self" : "_blank"}
      >
        {children}
      </a>
    );
  } else {
    return (
      <Link
        {...props}
        className={clsx(styles.commonLink, className)}
        href={href || ""}
      >
        {children}
      </Link>
    );
  }
}
