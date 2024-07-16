import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/ecosystem/FirstScreenSection";
import OverviewSection from "@/pageComponents/ecosystem/OverviewSection";
import DappsSection from "@/pageComponents/ecosystem/DappsSection";
import VenturesSection from "@/pageComponents/ecosystem/VenturesSection";
import CommonStartSection from "@/components/CommonStartSection";
import { SECTION_ID } from "@/constants/sectionId";

export default function Ecosystem() {
  return (
    <>
      <CommonHeader />
      <FirstScreenSection />
      <OverviewSection />
      <DappsSection />
      <VenturesSection />
      <CommonStartSection id={SECTION_ID.ECOSYSTEM.START} />
      <CommonFooter />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
