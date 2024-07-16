import axios from "axios";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";
import { IRecentBlogItem } from "@/types/webflow";
import getUrlConfig from "@/constants/network/cms";

interface ILandingProps {
  blogList: IRecentBlogItem[];
}

export default function Landing({ blogList }: ILandingProps) {
  return (
    <>
      <CommonHeader />
      <FirstScreenSection />
      <FunctionSection />
      <BuildingSection />
      <ListSection />
      <ExperienceSection blogList={blogList} />
      <CommonFooter />
    </>
  );
}

const urlConfig = getUrlConfig();

const REVALIDATE_PERIOD = 3600;

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
