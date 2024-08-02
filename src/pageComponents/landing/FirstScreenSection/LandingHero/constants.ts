import { DeviceWidthType } from "@/constants/breakpoints";

export const LANDING_HERO_ANIMATION_SIZE_CONFIG = {
  [DeviceWidthType.MOBILE]: {
    WIDTH: 512,
    HEIGHT: 256,
  },
  [DeviceWidthType.TABLET]: {
    WIDTH: 480,
    HEIGHT: 240,
  },
  [DeviceWidthType.DESKTOP]: {
    WIDTH: 1000,
    HEIGHT: 500,
  },
};

export const LANDING_HERO_BACKGROUND_SIZE_CONFIG = {
  [DeviceWidthType.MOBILE]: {
    WIDTH: 474,
    HEIGHT: 237,
  },
  [DeviceWidthType.TABLET]: {
    WIDTH: 442,
    HEIGHT: 221,
  },
  [DeviceWidthType.DESKTOP]: {
    WIDTH: 924,
    HEIGHT: 462,
  },
};
