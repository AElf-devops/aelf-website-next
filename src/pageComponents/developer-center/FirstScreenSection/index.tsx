import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import animationData from "@/assets/animationData/developerCenterHero.json";
import { ShapeSphere } from "@/assets/shape";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      heroImageAnimationData={animationData}
      heroShape={ShapeSphere}
      title={["Developer", "Resources"]}
      description="Learn how to start building on aelf with our detailed documentation and development resources."
    />
  );
}
