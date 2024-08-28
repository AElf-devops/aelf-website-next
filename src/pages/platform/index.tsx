import FirstScreenSection from "@/pageComponents/platform/FirstScreenSection";
import BlockchainSection from "@/pageComponents/platform/BlockchainSection";
import BridgeSection from "@/pageComponents/platform/BridgeSection";
import TechnicalEdgeSection from "@/pageComponents/platform/TechnicalEdgeSection";
import TokenomicsSection from "@/pageComponents/platform/TokenomicsSection";
import CommonStartSection from "@/components/CommonStartSection";

export default function Platform() {
  return (
    <>
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
