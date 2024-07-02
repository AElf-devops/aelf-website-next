import Head from "next/head";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";

export default function Landing() {
  return (
    <>
      <Head>
        <title>aelf - Experience AI + Blockchain of Tomorrow</title>
        <meta
          name="description"
          content="aelf: High-performance AI blockchain for Web3 DApps with AI-powered tools & scalable infrastructure for developers to build, deploy & manage dApps efficiently."
        />
      </Head>
      <CommonHeader />
      <FirstScreenSection />
      <FunctionSection />
      <BuildingSection />
      <ListSection />
      <ExperienceSection />
      <CommonFooter />
    </>
  );
}
