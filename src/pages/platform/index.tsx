import Head from "next/head";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/platform/FirstScreenSection";
import BlockchainSection from "@/pageComponents/platform/BlockchainSection";
import BridgeSection from "@/pageComponents/platform/BridgeSection";
import TechnicalEdgeSection from "@/pageComponents/platform/TechnicalEdgeSection";
import CommonStartSection from "@/components/CommonStartSection";

export default function Platform() {
  return (
    <>
      <Head>
        <title>aelf | Platform</title>
      </Head>
      <CommonHeader />
      <FirstScreenSection />
      <BlockchainSection />
      <BridgeSection />
      <TechnicalEdgeSection />
      <CommonStartSection />
      <CommonFooter />
    </>
  );
}
