import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useRouter, useSearchParams } from "next/navigation";
import { getTagList, getBlogDetail } from "@/api/request";
import { useConfig } from "@/contexts/useConfig/hooks";
import { Button } from "antd";
import { CommonSection } from "@/components/CommonSection";
import styles from "./styles.module.scss";
import ArrowRight from "@/assets/blog/arrow-right.svg";
import { formattedDateToDMY } from "@/utils/index";
import dynamic from "next/dynamic";
import getUrlConfig from "@/constants/network/cms";
import CommonImage from "@/components/CommonImage";
import { GetServerSidePropsContext } from "next";

let CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
});
const urlConfig = getUrlConfig();

// export default function BlogDetail({ data }: { data: IBlog }) {
  export default function BlogDetail() {
  const { isMobile } = useConfig();
  const deviceClassName = useDeviceClass(styles);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [editorInstance, setEditorInstance] = useState({});
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [blog, setBlog] = useState<IBlog>();

  const handleInstance = (instance: any) => {
    setEditorInstance(instance);
  };

  const handleGetTagList = useCallback(() => {
    getTagList().then((res) => {
      setTagList(res.data);
    });
  }, []);

  const handleGetBlogDetail = useCallback(() => {
    if (id) {
      getBlogDetail(id).then((res) => {
        res.data.content.blocks.forEach((block: any) => {
          if (block.type === "image") {
            block.data.file.url = urlConfig.cms + block.data.file.url;
          }
        });
        setBlog({
          ...res.data,
          date_created: formattedDateToDMY(res.data.date_created),
          date_updated: formattedDateToDMY(res.data.date_updated),
        });
      });
    }
  }, [id]);

  const tagMap = useMemo(() => {
    const obj: any = {};
    tagList.forEach((item) => {
      obj[item.id] = item.tag;
    });
    return obj;
  }, [tagList]);

  const goBack = () => {
    router.push("/blog");
  };

  const handleTagClick = (tagId: number) => {
    router.push("/blog?tagId=" + tagId);
  };

  useEffect(() => {
    handleGetTagList();
    handleGetBlogDetail();
  }, [handleGetBlogDetail, handleGetTagList]);

  return (
    <div className={clsx([styles.pageWrap, deviceClassName])}>
      <div className={styles.backgroundWrap}></div>
      <CommonSection
        sectionClassName={styles.blogPart}
        contentClassName={styles.partContent}
      >
        <div className={styles.crumbs}>
          <span className={styles.blog} onClick={goBack}>
            Blog
          </span>
          <CommonImage
            className={styles.crumbsImg}
            src={ArrowRight}
            alt=""
            width={isMobile ? 16 : 32}
            height={isMobile ? 16 : 32}
          />
          <span className={styles.article}>Article</span>
        </div>
        <div className={styles.title}>{blog?.title}</div>
        <div className={styles.description}>
          <div className={styles.descriptionLeft}>
            {blog?.tags.map((item) => (
              <div
                key={item}
                className={styles.tag}
                onClick={() => {
                  handleTagClick(item);
                }}
              >
                {tagMap[item]}
              </div>
            ))}
          </div>
          <div className={styles.time}>
            {blog?.date_updated || blog?.date_created}
          </div>
        </div>

        {blog && (
          <div className={styles.editorContent}>
            <CustomEditor handleInstance={handleInstance} data={blog.content} />
          </div>
        )}
        <div className={styles.btnContent}>
          <Button className={styles.btn} onClick={goBack}>
            Back to Blog
          </Button>
        </div>
      </CommonSection>
    </div>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { query } = context;
//   let data = {};
//   if (query.id) {
    
//     const result = await getBlogDetail(Number(query.id));
//     result.data.content.blocks.forEach((block: any) => {
//       if (block.type === "image") {
//         block.data.file.url = urlConfig.cms + block.data.file.url;
//       }
//     });

//     data = {
//       ...result.data,
//       date_created: formattedDateToDMY(result.data.date_created),
//       date_updated: formattedDateToDMY(result.data.date_updated),
//     };
//   }
//   return {
//     props: {
//       data,
//     },
//   };
// }
