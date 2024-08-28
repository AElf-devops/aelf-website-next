import FirstScreenSection from "@/pageComponents/developer-center/FirstScreenSection";
import GuideCardSection from "@/pageComponents/developer-center/GuideCardSection";
import ExploreSection from "@/pageComponents/developer-center/ExploreSection";
import DevelopersSection from "@/pageComponents/developer-center/DevelopersSection";
import CommonSEOHead from "@/components/CommonSEOHead";
import { PAGE_KEY } from "@/constants";

export default function DeveloperCenter() {
  return (
    <>
      <CommonSEOHead pageKey={PAGE_KEY.DEVELOPER_CENTER} />
      <FirstScreenSection />
      <GuideCardSection />
      <ExploreSection />
      <DevelopersSection />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
