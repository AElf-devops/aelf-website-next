import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import PlatformHero from "@/assets/platform/PlatformHero.png";
import { ShapeCylinder } from "@/assets/shape";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      heroImage={PlatformHero}
      heroShape={ShapeCylinder}
      title={["A Performant", "Cloud-Native Layer 1 Powered by AI"]}
      description="Explore the innovative platform behind aelf’s blockchain technology."
    />
  );
}
