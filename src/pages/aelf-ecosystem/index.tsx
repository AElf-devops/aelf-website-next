import Head from "next/head";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/ecosystem/FirstScreenSection";
import OverviewSection from "@/pageComponents/ecosystem/OverviewSection";
import DappsSection from "@/pageComponents/ecosystem/DappsSection";
import VenturesSection from "@/pageComponents/ecosystem/VenturesSection";
import CommonStartSection from "@/components/CommonStartSection";

export default function Ecosystem() {
  return (
    <>
      <Head>
        <title>aelf | Ecosystem</title>
      </Head>
      <CommonHeader />
      <FirstScreenSection />
      <OverviewSection />
      <DappsSection />
      <VenturesSection />
      <CommonStartSection />
      <CommonFooter />
    </>
  );
}
