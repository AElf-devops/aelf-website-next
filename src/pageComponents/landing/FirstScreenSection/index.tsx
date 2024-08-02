import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import { CommonButtonType } from "@/components/CommonButton";
import LandingHero from "./LandingHero";
import { ShapeLogo } from "@/assets/shape";
import { SECTION_ID } from "@/constants/sectionId";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      id={SECTION_ID.ECOSYSTEM.FIRST_SCREEN}
      heroImageElement={<LandingHero />}
      heroShape={ShapeLogo}
      title={["Experience AI +", "Blockchain of", "Tomorrow"]}
      description="We converge AI and Blockchain to power the future of Web3"
      newTagConfig={{
        text: "Read our latest Whitepaper v2.0",
        href: "https://docs.aelf.com/resources/whitepaper-2/",
      }}
      buttonList={[
        {
          text: "Start Building",
          type: CommonButtonType.PRIMARY,
          href: "/developer-center",
        },
      ]}
    />
  );
}
