// pages/sitemap.xml.js
import { ISitemapField, getServerSideSitemapLegacy } from "next-sitemap";
import { getAllDynamicPaths } from "@/api/request";
import getUrlConfig from "@/constants/network/cms";
const urlConfig = getUrlConfig();

export const getServerSideProps = async (ctx: any) => {
  const res = await getAllDynamicPaths();

  const fields: ISitemapField[] = res.data.map((blogDetail: IDetailBlog) => ({
    loc: `${urlConfig.aelf}/blog/${blogDetail.urlPath}`,
    changefreq: blogDetail.sitemapChangeFrequency,
    priority: blogDetail.sitemapPriority,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemapLegacy(ctx, fields);
};

export default function Sitemap() {}
