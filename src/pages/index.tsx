import axios from "axios";
import Head from "next/head";
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
      <Head>
        <title>aelf: Layer 1 AI Blockchain</title>
        <meta
          name="description"
          content="aelf is a high-performance Layer 1 AI blockchain with built-in cross-chain functions, offering scalable infrastructure with AI for Web3 DApps development."
        />
      </Head>
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

export async function getServerSideProps() {
  try {
    const { data } = await axios.get(`${urlConfig.aelf}/api/recentBlogList`);
    return {
      props: { blogList: data },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { blogList: [] },
    };
  }
}
