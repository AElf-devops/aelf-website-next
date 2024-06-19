import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";

export default function Landing() {
  return (
    <div>
      <CommonHeader />
      <FirstScreenSection />
      <FunctionSection />
      <BuildingSection />
      <ListSection />
      <ExperienceSection />
      <CommonFooter />
    </div>
  );
}
