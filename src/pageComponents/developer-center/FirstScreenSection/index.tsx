import CommonFirstScreenSection from "@/components/CommonFirstScreenSection";
import DeveloperHero from "@/assets/developer-center/DeveloperHero.png";
import { ShapeSphere } from "@/assets/shape";

export default function FirstScreenSection() {
  return (
    <CommonFirstScreenSection
      heroImage={DeveloperHero}
      heroShape={ShapeSphere}
      title={["Developer", "Resources"]}
      description="Learn how to start building on aelf with our detailed documentation and development resources."
    />
  );
}
