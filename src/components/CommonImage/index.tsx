/* eslint-disable @next/next/no-img-element */
import { ImageProps } from "next/image";
import { TPartialOption } from "@/types";
import styles from "./styles.module.scss";
import clsx from "clsx";

export type TCommonImageProps = TPartialOption<ImageProps, "alt"> & {
  src: any;
};

export default function CommonImage({
  className,
  style,
  alt = "img",
  fill = true,
  onClick,
  ...props
}: TCommonImageProps) {
  const src = typeof props.src === "string" ? props.src : props.src?.src;
  return (
    <div
      className={clsx([styles.commonImageWrap, className])}
      style={style}
      onClick={onClick}
    >
      <img src={src} alt={alt} />
    </div>
  );
}
