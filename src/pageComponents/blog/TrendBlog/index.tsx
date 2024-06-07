/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import { Carousel } from "antd";
import { clsx } from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";
import { getTrendBlogList, getMostViewCountBlogList } from "@/api/request";
import getUrlConfig from "@/constants/network/cms";
import { formattedDate } from "@/utils/index";
import Image from "next/image";
import { useRouter } from "next/navigation";
import arrowLinkRightImg from "@/assets/ventures/arrow-link-right.svg";
import { useConfig } from "@/contexts/useConfig/hooks";
import DefaultImg from "@/assets/blog/default.png";
import CommonImage from "@/components/CommonImage";

const defaultNum = 4;

interface ITendBlog extends IDetailBlog {
  time?: string;
}

export default function TrendBlog() {
  const deviceClassName = useDeviceClass(styles);
  const [list, setList] = useState<ITendBlog[]>();
  const urlConfig = getUrlConfig();
  const [currentSlickBlog, setCurrentSlickBlog] = useState<ITendBlog>();
  const router = useRouter();
  const { isMobile } = useConfig();

  const contentStyle: React.CSSProperties = {
    height: isMobile ? "204px" : "385px",
    borderRadius: 8,
    cursor: "pointer",
  };

  const handleGetTrendBlog = useCallback(async () => {
    const res = await Promise.all([
      getTrendBlogList(),
      getMostViewCountBlogList(),
    ]);
    const [trendBlogList, mostViewCountList] = res;
    let list: ITendBlog[] = [];

    // First determine whether there are manually set popular articles
    // If the length is greater than 4, set the display
    if (trendBlogList.length >= defaultNum) {
      list = trendBlogList.slice(0, 4);
    } else {
      // If the length is less than 4, the article gets the most views
      const ids = trendBlogList.map((item) => item.id);
      const filterList = mostViewCountList.filter(
        (item) => !ids.includes(item.id)
      );
      const tempList = [...trendBlogList, ...filterList];
      list = tempList.slice(0, 4);
    }

    list.forEach((item) => {
      const blockItem = item.content?.blocks?.find((item: any) => {
        return item.type === "image";
      });
      if (blockItem) {
        item.imgUrl = urlConfig.cms + blockItem.data.file.url;
      }
      const date = item.publishDate || item.date_created;
      item.time = formattedDate(date, "MDY");
    });
    setCurrentSlickBlog(list[0]);
    setList(list);
  }, [urlConfig]);

  const onChange = (currentSlide: number) => {
    setCurrentSlickBlog(list?.[currentSlide]);
  };

  useEffect(() => {
    handleGetTrendBlog();
  }, [handleGetTrendBlog]);

  const getHref = (urlPath?: string) => {
    if (urlPath) {
      return `/blog/${urlPath}`;
    }
  }

  return (
    <div className={clsx([styles.trendBlog, deviceClassName])}>
      <div className={styles.title}>Trending Articles</div>
      <div className={styles.trendBlogContent}>
        <div className={styles.carouselContent}>
          <Carousel afterChange={onChange} className={styles.carousel}>
            {list?.map((item) => {
              return (
                <a
                  href={getHref(currentSlickBlog?.urlPath)}
                  key={item.id}
                  style={{ borderRadius: 8, color: "#fff" }}
                >
                  {item.imgUrl ? (
                    <img src={item.imgUrl} style={contentStyle} alt=""></img>
                  ) : (
                    <CommonImage
                      src={DefaultImg}
                      alt=""
                      className={styles.blogItemImg}
                    />
                  )}
                </a>
              );
            })}
          </Carousel>
        </div>

        <div className={styles.detail}>
          <div className={styles.time}>{currentSlickBlog?.time}</div>
          <a
            className={styles.title}
            href={getHref(currentSlickBlog?.urlPath)}
          >
            {currentSlickBlog?.title}
          </a>
          <div className={styles.subHeader}>{currentSlickBlog?.subHeader}</div>
          <div className={styles.tagContent}>
            {currentSlickBlog?.tags.map((item) => (
              <div key={item.id} className={styles.tag}>
                {item.tag}
              </div>
            ))}
          </div>
          {!isMobile && (
            <a
              className={styles.btn}
              href={getHref(currentSlickBlog?.urlPath)}
            >
              Read Full Post
              <Image
                src={arrowLinkRightImg}
                className={styles.arrowLinkRightImg}
                alt=""
                width={28}
                height={28}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const { query } = context;
//     let data = {};
//     if (query.id) {
//       const result = await getBlogDetail(Number(query.id));
//       result.data.content.blocks.forEach((block: any) => {
//         if (block.type === "image") {
//           block.data.file.url = urlConfig.cms + block.data.file.url;
//         }
//       });

//       data = {
//         ...result.data,
//         date_created: formattedDate(result.data.date_created, "DMY"),
//         date_updated: formattedDate(result.data.date_updated, "DMY"),
//       };
//       // await updateViewCount({
//       //   id: Number(query.id),
//       //   viewCount:  1,
//       // });
//     }
//     return {
//       props: {
//         data,
//       },
//     };
//   }
