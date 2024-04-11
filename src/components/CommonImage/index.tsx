/* eslint-disable @next/next/no-img-element */
import Image, { ImageProps } from "next/image";
import { TPartialOption } from "@/types";
import styles from "./styles.module.scss";
import clsx from "clsx";

export type TCommonImageProps = TPartialOption<ImageProps, "alt"> & {
  src: any;
};

export default function CommonImage({
  className,
  alt = "img",
  fill = true,
  ...props
}: TCommonImageProps) {
  return (
    <div className={clsx([styles.commonImageWrap, className])}>
      {/* <Image quality={100} {...props} alt={alt} priority /> */}
      <img src={props?.src?.src} alt={alt} />
    </div>
  );
}
