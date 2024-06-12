import clsx from "clsx";
import CommonHeader from "@/components/CommonHeader";
import CommonFooter from "@/components/CommonFooter";
import FirstScreenSection from "@/pageComponents/landing/FirstScreenSection";
import FunctionSection from "@/pageComponents/landing/FunctionSection";
import BuildingSection from "@/pageComponents/landing/BuildingSection";
import ListSection from "@/pageComponents/landing/ListSection";
import ExperienceSection from "@/pageComponents/landing/ExperienceSection";
import styles from "./styles.module.scss";

export default function Landing() {
  return (
    <div className={clsx(styles.landingContainer)}>
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
