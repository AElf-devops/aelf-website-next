import { apiServer } from "./axios";
import { sortItems } from "@/utils/request";

// ================== Header ==================
export const getTopBannerConfig = async (): Promise<{
  data: ITopBannerConfig;
}> => {
  try {
    const { data: topBannerData } = await apiServer.get<{
      data: ITopBannerConfig;
    }>("/items/topBanner", {
      params: {
        fields: "*",
      },
    });
    return {
      data: topBannerData,
    };
  } catch (error) {
    console.log(error);
    return {
      data: {
        isActive: false,
      },
    };
  }
};

// ================== Developer Center ==================
export const getDeveloperCenterSectionTitleList = async (): Promise<{
  data: IDeveloperCenterSectionTitleItem[];
}> => {
  try {
    const { data } = await apiServer.get<{
      data: IDeveloperCenterSectionTitleItem[];
    }>("/items/developerCenterSectionTitle", {
      params: {
        fields: "*",
        "sort[]": "order",
      },
    });
    return {
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
    };
  }
};

export const getGuideCardList = async (): Promise<{
  data: IGuideCardItem[];
}> => {
  try {
    const { data } = await apiServer.get<{
      data: IGuideCardItem[];
    }>("/items/guideCardList", {
      params: {
        fields: "*",
        "sort[]": "order",
      },
    });
    return {
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
    };
  }
};

export const getExploreList = async (): Promise<{
  data: IExploreListItem[];
}> => {
  try {
    const { data } = await apiServer.get<{
      data: IExploreListItem[];
    }>("/items/exploreList", {
      params: {
        fields: ["*", "children.*", "children.children.*"],
        "sort[]": "order",
      },
    });
    const sortedData = sortItems(data);
    return {
      data: sortedData,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
    };
  }
};

export const getDeveloperDocList = async (): Promise<{
  data: IDeveloperDocListItem[];
}> => {
  try {
    const { data } = await apiServer.get<{
      data: IDeveloperDocListItem[];
    }>("/items/developerDocList", {
      params: {
        fields: "*",
        "fields[]": "children.*",
        "sort[]": "order",
      },
    });
    const sortedData = sortItems(data);
    return {
      data: sortedData,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
    };
  }
};
