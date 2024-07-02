import Head from "next/head";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/developer-center/FirstScreenSection";
import GuideCardSection from "@/pageComponents/developer-center/GuideCardSection";
import ExploreSection from "@/pageComponents/developer-center/ExploreSection";
import DevelopersSection from "@/pageComponents/developer-center/DevelopersSection";
import StartCardSection from "@/pageComponents/developer-center/StartCardSection";

export default function DeveloperCenter() {
  return (
    <>
      <Head>
        <title>aelf | Developer Resources</title>
        <meta
          name="description"
          content="Learn how to build on aelf with our detailed documentation. Discover AI blockchain tools and scalable infrastructure for high-performance Web3 DApps."
        />
      </Head>
      <CommonHeader />
      <FirstScreenSection />
      <GuideCardSection />
      <ExploreSection />
      <DevelopersSection />
      <StartCardSection />
      <CommonFooter />
    </>
  );
}
