/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import styles from "../../styles.module.scss";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useCallback, useMemo } from "react";
import { useConfig } from "@/contexts/useConfig/hooks";
import { formattedDateToMDY, formattedDateToDMY } from "@/utils/index";
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
    const time = blog.date_updated || blog.date_created;
    if (isMobile) {
      return formattedDateToDMY(time);
    } else {
      return formattedDateToMDY(time);
    }
  }, [blog, isMobile]);

  const imgUrl = useMemo(() => {
    const item = blog.content.blocks.find((item: any) => {
      return item.type === "image";
    });
    const urlConfig = getUrlConfig();
    if (item?.data?.file?.url) {
      return urlConfig.cms + item.data.file.url;
    } else {
      return "";
    }
  }, [blog]);

  const handleViewDetail = useCallback(() => {
    onViewDetail(blog.id);
  }, [blog, onViewDetail]);

  return (
    <div className={clsx([styles.blogItem])} onClick={handleViewDetail}>
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
    </div>
  );
}