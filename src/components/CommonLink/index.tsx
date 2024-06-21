import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import styles from "./styles.module.scss";

interface ICommonLinkProps extends Omit<LinkProps, "href"> {
  className?: string;
  href?: LinkProps["href"];
  children?: React.ReactNode;
}

export default function CommonLink({
  className,
  href,
  ...props
}: ICommonLinkProps) {
  return (
    <Link
      {...props}
      href={href || ""}
      className={clsx(styles.commonLink, className)}
    />
  );
}
