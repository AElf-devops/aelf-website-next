import FirstScreenSection from "@/pageComponents/ecosystem/FirstScreenSection";
import OverviewSection from "@/pageComponents/ecosystem/OverviewSection";
import DappsSection from "@/pageComponents/ecosystem/DappsSection";
import VenturesSection from "@/pageComponents/ecosystem/VenturesSection";
import CommonStartSection from "@/components/CommonStartSection";
import { SECTION_ID } from "@/constants/sectionId";

export default function Ecosystem() {
  return (
    <>
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
