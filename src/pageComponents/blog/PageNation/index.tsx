import React from "react";
import styles from "./styles.module.scss";
import { clsx } from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import Image from "next/image";
import LeftIcon from "@/assets/pageNation/left.svg";
import RightIcon from "@/assets/pageNation/right.svg";
import { Select } from "antd";

export default function PagiNation({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize?: number;
  total: number;
}) {
  const deviceClassName = useDeviceClass(styles);

  return (
    <div className={clsx([styles.PagiNation, deviceClassName])}>
      <div className={clsx([styles.commonBorder,styles.first])}>First</div>
      <div className={clsx([styles.commonBorder,styles.first])}>
        <Image src={LeftIcon} width={12} height={12} alt=""></Image>
      </div>
      <div className={clsx([styles.commonBorder,styles.first])}>
        <Image src={RightIcon} width={12} height={12} alt=""></Image>
      </div>
      <div className={clsx([styles.commonBorder,styles.first])}>Last</div>
      <Select className={styles.select}>
        
      </Select>
      
    </div>
  );
}
