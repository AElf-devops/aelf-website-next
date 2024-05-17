/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import styles from "./styles.module.scss";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useCallback, useMemo } from "react";
import { useConfig } from "@/contexts/useConfig/hooks";
import { formattedDate } from "@/utils/index";
import getUrlConfig from "@/constants/network/cms";
import DefaultImg from "@/assets/blog/default.png";
import CommonImage from "@/components/CommonImage";

export default function BlogItem({
  blog,
  tagList = [],
  onViewDetail,
}: {
  blog: IBlog;
  tagList: ITag[];
  onViewDetail: (id: number) => void;
}) {
  const deviceClassName = useDeviceClass(styles);
  const { isMobile } = useConfig();

  const tagMap = useMemo(() => {
    const obj: any = {};
    tagList?.forEach((item) => {
      obj[item.id] = item.tag;
    });
    return obj;
  }, [tagList]);

  const time = useMemo(() => {
    const time = blog.publishDate || blog.date_created;
    if (isMobile) {
      return formattedDate(time, "DMY");
    } else {
      return formattedDate(time, "MDY");
    }
  }, [blog, isMobile]);

  const imgUrl = useMemo(() => {
    const item =
      blog.content?.blocks?.find((item: any) => {
        return item.type === "image";
      }) || [];
    const urlConfig = getUrlConfig();
    if (item?.data?.file?.url) {
      return urlConfig.cms + item.data.file.url;
    } else {
      return "";
    }
  }, [blog]);

  return (
    <a
      className={clsx([styles.blogItem, deviceClassName])}
      href={`/blog-detail?id=${blog.id}`}
    >
      {/* <div className={styles.blogItemImg}> */}
      {/* <Image src={imgUrl} alt="" width={500} height={200} /> */}
      {imgUrl ? (
        <img src={imgUrl} alt="" className={styles.blogItemImg}></img>
      ) : (
        <CommonImage src={DefaultImg} alt="" className={styles.blogItemImg} />
      )}

      {/* </div> */}
      <div className={styles.content}>
        <div className={styles.itemTime}>{time}</div>
        <div className={styles.itemTitle}>{blog.title}</div>
        {!isMobile && <div className={styles.btn}>Read Full Post</div>}
        <div className={styles.tagContent}>
          {blog.tags.map((item) => (
            <div key={item} className={styles.tag}>
              {tagMap[item]}
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
