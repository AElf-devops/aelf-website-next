import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import EcosystemHero from "@/assets/ecosystem/EcosystemHero.png";
import { ShapeDonut } from "@/assets/shape";
import { SECTION_ID } from "@/constants/sectionId";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      id={SECTION_ID.ECOSYSTEM.FIRST_SCREEN}
      heroImage={EcosystemHero}
      heroShape={ShapeDonut}
      title={["Discover the aelf", "Ecosystem"]}
      description="Explore the vibrant ecosystem powered by aelf’s cutting-edge blockchain + AI technology."
    />
  );
}
