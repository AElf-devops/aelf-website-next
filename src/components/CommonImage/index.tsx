import Image, { ImageProps } from "next/image";
import { TPartialOption } from "@/types";
import styles from "./styles.module.scss";
import clsx from "clsx";

export type TCommonImageProps = TPartialOption<ImageProps, "alt"> & {
  src: any;
};

export default function CommonImage({
  className,
  style,
  alt = "",
  onClick,
  ...props
}: TCommonImageProps) {
  return (
    <div
      className={clsx([styles.commonImageWrap, className])}
      style={style}
      onClick={onClick}
    >
      <Image {...props} alt={alt} />
    </div>
  );
}
