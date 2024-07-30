import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import clsx from "clsx";
import CommonSection from "../CommonSection";
import CommonImage from "../CommonImage";
import CommonLink, { ICommonLinkProps } from "../CommonLink";
import CommonButton, { ICommonButtonProps } from "../CommonButton";
import GridBackground from "@/assets/GridBackground.svg";
import ArrowRightBlack from "@/assets/ArrowRightBlack.svg";
import ChevronRightWhite from "@/assets/ChevronRightWhite.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

interface INewTagConfig
  extends Pick<ICommonLinkProps, "href" | "isExternalLinkTargetSelf"> {
  text: string;
}

interface IButtonProps
  extends Pick<
    ICommonButtonProps,
    "className" | "type" | "href" | "isExternalLinkTargetSelf"
  > {
  text: string;
}

interface ICommonFirstScreenSectionProps {
  id?: string;
  heroImage: any;
  heroShape: any;
  heroAlt?: string;
  title: string | string[];
  description: string;
  newTagConfig?: INewTagConfig;
  buttonList?: IButtonProps[];
}

// Extend CSSProperties to include custom CSS variables
interface CSSPropertiesWithVars extends CSSProperties {
  "--scroll-offset"?: string;
}

const SCROLL_CONFIG = {
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

export default function CommonFirstScreenSection({
  id,
  heroImage,
  heroShape,
  heroAlt = "",
  title,
  description,
  newTagConfig,
  buttonList,
}: ICommonFirstScreenSectionProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const [heroImageOffset, setHeroImageOffset] = useState(0);
  const [heroShapeOffset, setHeroShapeOffset] = useState(0);

  const tickingRef = useRef(false);

  const scrollConfig = useMemo(
    () => SCROLL_CONFIG[deviceWidthType],
    [deviceWidthType]
  );

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const { START_SCROLL, END_SCROLL, HERO_IMAGE_FACTOR, HERO_SHAPE_FACTOR } =
      scrollConfig;

    if (scrollTop > START_SCROLL && scrollTop < END_SCROLL) {
      const scrollDistance = scrollTop - START_SCROLL;
      setHeroImageOffset(scrollDistance * HERO_IMAGE_FACTOR);
      setHeroShapeOffset(scrollDistance * HERO_SHAPE_FACTOR);
    } else if (scrollTop <= START_SCROLL) {
      setHeroImageOffset(0);
      setHeroShapeOffset(0);
    } else if (scrollTop >= END_SCROLL) {
      setHeroImageOffset((END_SCROLL - START_SCROLL) * HERO_IMAGE_FACTOR);
      setHeroShapeOffset((END_SCROLL - START_SCROLL) * HERO_SHAPE_FACTOR);
    }
  }, [scrollConfig]);

  // Use requestAnimationFrame for smooth scrolling
  const handleScrollRAF = useCallback(() => {
    if (!tickingRef.current) {
      window.requestAnimationFrame(() => {
        handleScroll();
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollRAF);
    return () => {
      window.removeEventListener("scroll", handleScrollRAF);
    };
  }, [handleScrollRAF]);

  const gridBackgroundWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 393;
      case DeviceWidthType.TABLET:
        return 400;
      case DeviceWidthType.DESKTOP:
      default:
        return 656;
    }
  }, [deviceWidthType]);

  const gridBackgroundHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 393;
      case DeviceWidthType.TABLET:
        return 400;
      case DeviceWidthType.DESKTOP:
      default:
        return 656;
    }
  }, [deviceWidthType]);

  const heroImageWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 345;
      case DeviceWidthType.TABLET:
        return 322;
      case DeviceWidthType.DESKTOP:
      default:
        return 672;
    }
  }, [deviceWidthType]);

  const heroImageHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 237;
      case DeviceWidthType.TABLET:
        return 221;
      case DeviceWidthType.DESKTOP:
      default:
        return 462;
    }
  }, [deviceWidthType]);

  const heroShapeWidth = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 100;
      case DeviceWidthType.DESKTOP:
      default:
        return 225;
    }
  }, [deviceWidthType]);

  const heroShapeHeight = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
      case DeviceWidthType.TABLET:
        return 100;
      case DeviceWidthType.DESKTOP:
      default:
        return 225;
    }
  }, [deviceWidthType]);

  const renderTitle = useCallback(() => {
    if (Array.isArray(title)) {
      return title.map((row, index) => <p key={index}>{row}</p>);
    } else {
      return title;
    }
  }, [title]);

  return (
    <CommonSection
      id={id}
      sectionClassName={clsx(styles.commonFirstScreenSection, deviceClassName)}
      contentClassName={styles.commonFirstScreenContent}
    >
      <CommonImage
        className={clsx(styles.gridBackground, styles.fadeIn)}
        src={GridBackground}
        width={gridBackgroundWidth}
        height={gridBackgroundHeight}
        priority
      />
      <div className={clsx(styles.introductionPart, styles.moveIn)}>
        {newTagConfig && (
          <CommonLink
            className={styles.newTagWrapper}
            href={newTagConfig.href}
            isExternalLinkTargetSelf={newTagConfig.isExternalLinkTargetSelf}
          >
            <div className={styles.newTag}>NEW</div>
            <div>{newTagConfig.text}</div>
            <CommonImage
              src={ArrowRightBlack}
              width={20}
              height={20}
              priority
            />
          </CommonLink>
        )}
        <div className={styles.title}>{renderTitle()}</div>
        <div className={styles.description}>{description}</div>
        {!!buttonList?.length && (
          <div className={styles.buttonList}>
            {buttonList.map((buttonConfig, index) => (
              <CommonButton
                key={index}
                {...buttonConfig}
                className={clsx(styles.button, buttonConfig.className)}
              >
                <p>{buttonConfig.text}</p>
                <CommonImage
                  src={ChevronRightWhite}
                  width={16}
                  height={16}
                  priority
                />
              </CommonButton>
            ))}
          </div>
        )}
      </div>
      <div className={styles.heroPart}>
        <CommonImage
          className={clsx(styles.heroImage, styles.moveInDelayed100)}
          style={
            {
              "--scroll-offset": `${heroImageOffset}px`,
            } as CSSPropertiesWithVars
          } // Dynamically set CSS variable
          src={heroImage}
          width={heroImageWidth}
          height={heroImageHeight}
          alt={heroAlt}
          priority
        />
        <CommonImage
          className={clsx(styles.heroShape, styles.moveInDelayed200)}
          style={
            {
              "--scroll-offset": `${heroShapeOffset}px`,
            } as CSSPropertiesWithVars
          } // Dynamically set CSS variable
          src={heroShape}
          width={heroShapeWidth}
          height={heroShapeHeight}
          priority
        />
      </div>
    </CommonSection>
  );
}
