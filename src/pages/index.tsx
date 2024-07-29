import axios from "axios";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import PartnerSection from "@/pageComponents/landing/PartnerSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";
import { IRecentBlogItem } from "@/types/webflow";
import getUrlConfig from "@/constants/network/cms";

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
      <CommonHeader />
      <FirstScreenSection />
      <PartnerSection />
      <FunctionSection />
      <BuildingSection />
      <ListSection />
      <ExperienceSection blogList={blogList} />
      <CommonFooter />
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
