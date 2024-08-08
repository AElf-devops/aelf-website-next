import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import animationData from "@/assets/animationData/ecosystemHero.json";
import { ShapeDonut } from "@/assets/shape";
import { SECTION_ID } from "@/constants/sectionId";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      id={SECTION_ID.ECOSYSTEM.FIRST_SCREEN}
      heroImageAnimationData={animationData}
      heroShape={ShapeDonut}
      title={["Discover the aelf", "Ecosystem"]}
      description="Explore the vibrant ecosystem powered by aelf’s cutting-edge blockchain + AI technology."
    />
  );
}
