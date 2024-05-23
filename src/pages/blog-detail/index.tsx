import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useRouter, useSearchParams } from "next/navigation";
import { getBlogDetail, updateViewCount } from "@/api/request";
import { useConfig } from "@/contexts/useConfig/hooks";
import { CommonSection } from "@/components/CommonSection";
import styles from "./styles.module.scss";
import ArrowRight from "@/assets/blog/arrow-right.svg";
import { formattedDate } from "@/utils/index";
import dynamic from "next/dynamic";
import getUrlConfig from "@/constants/network/cms";
import CommonImage from "@/components/CommonImage";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

let CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
  loading: () => <p>loading</p>,
});
const urlConfig = getUrlConfig();

export default function BlogDetail({ data }: { data: IDetailBlog }) {
  const { isMobile } = useConfig();
  const deviceClassName = useDeviceClass(styles);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [editorInstance, setEditorInstance] = useState({});
  const [blog, setBlog] = useState<IDetailBlog>(data);

  const robotsContent = `${blog.noIndex ? "noindex" : "index"}, ${
    blog.noFollow ? "nofollow" : "follow"
  }`;

  const handleInstance = (instance: any) => {
    setEditorInstance(instance);
  };

  const goBack = () => {
    router.push("/blog");
  };

  const handleTagClick = (tagId: number) => {
    router.push("/blog?tagId=" + tagId);
  };

  return (
    <div className={clsx([styles.pageWrap, deviceClassName])}>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.metaDescription} />
        <meta name="robots" content={robotsContent}></meta>
        <link
          rel="canonical"
          href={`${urlConfig.aelf}/blog-detail/${blog.id}`}
        ></link>
        <meta
          property="og:image"
          content={urlConfig.cms + "/assets/" + blog.ogImage}
        />
      </Head>
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
        <div></div>
        <div className={styles.title}>{blog?.title}</div>
        <div className={styles.description}>
          <div className={styles.descriptionLeft}>
            {blog?.tags.map((item) => (
              <div
                key={item.id}
                className={styles.tag}
                onClick={() => {
                  handleTagClick(item.id);
                }}
              >
                {item.tag}
              </div>
            ))}
          </div>
          <div className={styles.time}>
            {blog?.publishDate || blog?.date_created}
          </div>
        </div>

        {blog && (
          <div className={styles.editorContent}>
            <CustomEditor handleInstance={handleInstance} data={blog.content} />
          </div>
        )}
        <div className={styles.btnContent}>
          <button className={styles.btn} onClick={goBack}>
            Back to Blog
          </button>
        </div>
      </CommonSection>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  let data;
  if (query.id) {
    const result = await getBlogDetail(Number(query.id));
    result.data.content.blocks.forEach((block: any) => {
      if (block.type === "image") {
        block.data.file.url = urlConfig.cms + block.data.file.url;
      }
    });

    data = {
      ...result.data,
      date_created: formattedDate(result.data.date_created, "DMY"),
      publishDate: formattedDate(result.data.publishDate, "DMY"),
    };

    data.content.blocks.forEach((item: any) => {
      if (item.type === "paragraph") {
        item.data.text = item.data.text.replace(
          /(<a\s+[^>]*href="[^"]*")/g,
          '$1 target="_blank"'
        );
      }
    });

    updateViewCount({
      id: Number(query.id),
      viewCount: data.viewCount + 1,
    });
  }
  return {
    props: {
      data,
    },
  };
}
