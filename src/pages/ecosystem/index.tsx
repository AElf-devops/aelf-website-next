import FirstScreenSection from "@/pageComponents/ecosystem/FirstScreenSection";
import OverviewSection from "@/pageComponents/ecosystem/OverviewSection";
import DappsSection from "@/pageComponents/ecosystem/DappsSection";
import VenturesSection from "@/pageComponents/ecosystem/VenturesSection";
import CommonStartSection from "@/components/CommonStartSection";
import CommonSEOHead from "@/components/CommonSEOHead";
import { PAGE_KEY } from "@/constants";
import { SECTION_ID } from "@/constants/sectionId";

export default function Ecosystem() {
  return (
    <>
      <CommonSEOHead pageKey={PAGE_KEY.ECOSYSTEM} />
      <FirstScreenSection />
      <OverviewSection />
      <DappsSection />
      <VenturesSection />
      <CommonStartSection id={SECTION_ID.ECOSYSTEM.START} />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
