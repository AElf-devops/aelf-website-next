interface ITopBannerConfig {
  isActive: boolean;
  text?: string;
  linkText?: string;
  href?: string;
}

interface IDeveloperCenterSectionTitleItem {
  order: number;
  leftSvg?: any;
  title: string;
}

interface IGuideCardItem {
  id: number;
  order: number;
  png: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

interface IExploreListSubItemChild {
  order: number;
  href: string;
  linkText: string;
  description: string;
}

interface IExploreListItemChild {
  order: number;
  title?: string;
  children: IExploreListSubItemChild[];
}

interface IExploreListItem {
  order: number;
  title: string;
  children: IExploreListItemChild[];
}

interface IDeveloperDocListItemChild {
  order: number;
  href: string;
  linkText: string;
  description: string;
}

interface IDeveloperDocListItem {
  order: number;
  title: string;
  children: IDeveloperDocListItemChild[];
}
