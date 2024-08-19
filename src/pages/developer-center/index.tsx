import FirstScreenSection from "@/pageComponents/developer-center/FirstScreenSection";
import GuideCardSection, {
  IGuideCardProps,
} from "@/pageComponents/developer-center/GuideCardSection";
import ExploreSection, {
  IExploreSectionProps,
} from "@/pageComponents/developer-center/ExploreSection";
import DevelopersSection, {
  IDevelopersSectionProps,
} from "@/pageComponents/developer-center/DevelopersSection";
import {
  getDeveloperCenterSectionTitleList,
  getGuideCardList,
  getExploreList,
  getDeveloperDocList,
} from "@/api/request";
import { getCmsImage } from "@/utils";
import { ImageType } from "@/constants/image";

interface IDeveloperCenterProps {
  guideCardSectionTitleConfig: IGuideCardProps["sectionTitleConfig"];
  exploreSectionTitleConfig: IExploreSectionProps["sectionTitleConfig"];
  developersSectionTitleConfig: IDevelopersSectionProps["sectionTitleConfig"];
  guideCardList: IGuideCardProps["guideCardList"];
  exploreList: IExploreSectionProps["exploreList"];
  developerDocList: IDevelopersSectionProps["developerDocList"];
}

export default function DeveloperCenter({
  guideCardSectionTitleConfig,
  exploreSectionTitleConfig,
  developersSectionTitleConfig,
  guideCardList,
  exploreList,
  developerDocList,
}: IDeveloperCenterProps) {
  return (
    <>
      <FirstScreenSection />
      <GuideCardSection
        sectionTitleConfig={guideCardSectionTitleConfig}
        guideCardList={guideCardList}
      />
      <ExploreSection
        sectionTitleConfig={exploreSectionTitleConfig}
        exploreList={exploreList}
      />
      <DevelopersSection
        sectionTitleConfig={developersSectionTitleConfig}
        developerDocList={developerDocList}
      />
    </>
  );
}

export async function getStaticProps() {
  const defaultSectionTitleConfig = {
    children: "",
  };
  try {
    const [sectionTitleRes, guideCardRes, exploreListRes, developerDocListRes] =
      await Promise.all([
        getDeveloperCenterSectionTitleList(),
        getGuideCardList(),
        getExploreList(),
        getDeveloperDocList(),
      ]);
    const sectionTitleList = sectionTitleRes.data.map((item) => ({
      icon: getCmsImage({ imageId: item.leftSvg, imageType: ImageType.SVG }),
      children: item.title,
    }));
    const [
      guideCardSectionTitleConfig = defaultSectionTitleConfig,
      exploreSectionTitleConfig = defaultSectionTitleConfig,
      developersSectionTitleConfig = defaultSectionTitleConfig,
    ] = sectionTitleList;
    const guideCardList = guideCardRes.data.map((item) => ({
      imageSrc: getCmsImage({ imageId: item.png, imageType: ImageType.PNG }),
      title: item.title,
      description: item.description,
      buttonProps: {
        text: item.buttonText,
        href: item.buttonHref,
      },
    }));
    const exploreList = exploreListRes.data.map((item) => ({
      title: item.title,
      groups: item.children.map((group) => ({
        subtitle: group.title,
        list: group.children,
      })),
    }));
    const developerDocList = developerDocListRes.data.map((item) => ({
      title: item.title,
      list: item.children,
    }));

    return {
      props: {
        guideCardSectionTitleConfig,
        exploreSectionTitleConfig,
        developersSectionTitleConfig,
        guideCardList,
        exploreList,
        developerDocList,
      },
    };
  } catch (error) {
    console.error("Error fetching Developer Center data:", error);
    return {
      props: {
        guideCardSectionTitleConfig: defaultSectionTitleConfig,
        exploreSectionTitleConfig: defaultSectionTitleConfig,
        developersSectionTitleConfig: defaultSectionTitleConfig,
        guideCardList: [],
        exploreList: [],
        developerDocList: [],
      },
    };
  }
}
