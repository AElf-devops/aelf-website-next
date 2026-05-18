import CommonSEOHead from "@/components/CommonSEOHead";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import PartnerSection from "@/pageComponents/landing/PartnerSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";
import { fetchRecentBlogPosts } from "@/lib/blog/api";
import { IBlogPost } from "@/types/blog";
import { PAGE_KEY } from "@/constants";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

// Use shorter revalidation period in non-production for easier testing.
const REVALIDATE_PERIOD = isProduction ? 3600 : 1;

interface ILandingProps {
  blogList: IBlogPost[];
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
  let blogList: IBlogPost[] = [];
  try {
    blogList = await fetchRecentBlogPosts();
  } catch (error) {
    console.error(error);
  }
  return {
    props: { blogList },
    revalidate: REVALIDATE_PERIOD,
  };
}
