import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import animationData from "@/assets/animationData/platformHero.json";
import { ShapeCylinder } from "@/assets/shape";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      heroImageAnimationData={animationData}
      heroShape={ShapeCylinder}
      title={["A Performant", "Cloud-Native Layer 1 Powered by AI"]}
      description="Explore the innovative blockchain technology powering aelf."
    />
  );
}
