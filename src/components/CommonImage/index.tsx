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
  width,
  height,
  alt = "",
  onClick,
  ...props
}: TCommonImageProps) {
  return (
    <div
      className={clsx([styles.commonImageWrap, className])}
      style={{ width, height, ...style }}
      onClick={onClick}
    >
      <Image {...props} width={width} height={height} alt={alt} />
    </div>
  );
}
