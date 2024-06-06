import React, { useState } from "react";
import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useRouter } from "next/navigation";
import { getBlogDetailByPath, updateViewCount } from "@/api/request";
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

  const [_, setEditorInstance] = useState({});

  const robotsContent = `${data?.noIndex ? "noindex" : "index"}, ${
    data?.noFollow ? "nofollow" : "follow"
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
        <title>{data?.title}</title>
        {data?.metaDescription && (
          <meta name="description" content={data.metaDescription} />
        )}
        <meta name="robots" content={robotsContent}></meta>
        {data?.urlPath && (
          <link
            rel="canonical"
            href={`${urlConfig.aelf}/blog/${data.urlPath}`}
          />
        )}
        {data?.ogImage && (
          <meta
            property="og:image"
            content={urlConfig.cms + "/assets/" + data.ogImage}
          />
        )}
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
        <div className={styles.title}>{data?.title}</div>
        <div className={styles.description}>
          <div className={styles.descriptionLeft}>
            {data?.tags.map((item) => (
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
            {data?.publishDate || data?.date_created}
          </div>
        </div>

        {data && (
          <div className={styles.editorContent}>
            <CustomEditor handleInstance={handleInstance} data={data.content} />
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
  const { params } = context;
  const { blogPath } = params as { blogPath: string };
  let data = null;
  if (blogPath) {
    const result = await getBlogDetailByPath(blogPath);
    if (result.data) {
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
        id: Number(data.id),
        viewCount: data.viewCount + 1,
      });
    }
  }
  return {
    props: {
      data: data || null,
    },
  };
}
