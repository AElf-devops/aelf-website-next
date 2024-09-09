import axios from "axios";
import CommonSEOHead from "@/components/CommonSEOHead";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import PartnerSection from "@/pageComponents/landing/PartnerSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";
import { IRecentBlogItem } from "@/types/webflow";
import getUrlConfig from "@/constants/network/cms";
import { PAGE_KEY } from "@/constants";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

// Use shorter revalidation period in non-production for easier testing.
const REVALIDATE_PERIOD = isProduction ? 3600 : 1;

const urlConfig = getUrlConfig();

interface ILandingProps {
  blogList: IRecentBlogItem[];
}

export default function Landing({ blogList }: ILandingProps) {
  return (
    <>
      <CommonSEOHead pageKey={PAGE_KEY.LANDING} />
      <FirstScreenSection />
      <PartnerSection />
      <FunctionSection />
      <BuildingSection />
      <ListSection />
      <ExperienceSection blogList={blogList} />
    </>
  );
}

export async function getStaticProps() {
  let blogList = [];
  try {
    const { data } = await axios.get(`${urlConfig.aelf}/api/recentBlogList`);
    blogList = data;
  } catch (error) {
    console.error(error);
  }
  return {
    props: { blogList },
    revalidate: REVALIDATE_PERIOD,
  };
}
