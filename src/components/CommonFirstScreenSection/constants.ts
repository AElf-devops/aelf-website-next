import { DeviceWidthType } from "@/constants/breakpoints";

export const SCROLL_CONFIG = {
  [DeviceWidthType.MOBILE]: {
    START_SCROLL: 0, // Scroll distance where heroImage and heroShape start moving
    END_SCROLL: 331, // Scroll distance where heroImage and heroShape stop moving
    HERO_IMAGE_FACTOR: 0.07, // HeroImage movement factor
    HERO_SHAPE_FACTOR: 0.23, // HeroShape movement factor
  },
  [DeviceWidthType.TABLET]: {
    START_SCROLL: 0,
    END_SCROLL: 420,
    HERO_IMAGE_FACTOR: 0.17,
    HERO_SHAPE_FACTOR: 0.43,
  },
  [DeviceWidthType.DESKTOP]: {
    START_SCROLL: 0,
    END_SCROLL: 690,
    HERO_IMAGE_FACTOR: 0.13,
    HERO_SHAPE_FACTOR: 0.42,
  },
};

export const DIMENSION_CONFIG = {
  [DeviceWidthType.MOBILE]: {
    GRID_BACKGROUND_WIDTH: 393,
    GRID_BACKGROUND_HEIGHT: 393,
    HERO_IMAGE_WIDTH: 345,
    HERO_IMAGE_HEIGHT: 237,
    HERO_SHAPE_WIDTH: 100,
    HERO_SHAPE_HEIGHT: 100,
  },
  [DeviceWidthType.TABLET]: {
    GRID_BACKGROUND_WIDTH: 400,
    GRID_BACKGROUND_HEIGHT: 400,
    HERO_IMAGE_WIDTH: 322,
    HERO_IMAGE_HEIGHT: 221,
    HERO_SHAPE_WIDTH: 100,
    HERO_SHAPE_HEIGHT: 100,
  },
  [DeviceWidthType.DESKTOP]: {
    GRID_BACKGROUND_WIDTH: 656,
    GRID_BACKGROUND_HEIGHT: 656,
    HERO_IMAGE_WIDTH: 672,
    HERO_IMAGE_HEIGHT: 462,
    HERO_SHAPE_WIDTH: 225,
    HERO_SHAPE_HEIGHT: 225,
  },
};
