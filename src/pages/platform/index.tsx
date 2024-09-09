import FirstScreenSection from "@/pageComponents/platform/FirstScreenSection";
import BlockchainSection from "@/pageComponents/platform/BlockchainSection";
import BridgeSection from "@/pageComponents/platform/BridgeSection";
import TechnicalEdgeSection from "@/pageComponents/platform/TechnicalEdgeSection";
import TokenomicsSection from "@/pageComponents/platform/TokenomicsSection";
import CommonStartSection from "@/components/CommonStartSection";
import CommonSEOHead from "@/components/CommonSEOHead";
import { PAGE_KEY } from "@/constants";

export default function Platform() {
  return (
    <>
      <CommonSEOHead pageKey={PAGE_KEY.PLATFORM} />
      <FirstScreenSection />
      <BlockchainSection />
      <BridgeSection />
      <TechnicalEdgeSection />
      <TokenomicsSection />
      <CommonStartSection />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
