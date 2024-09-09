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
import LottieAnimation from "../LottieAnimation";
import GridBackground from "@/assets/GridBackground.svg";
import ArrowRightBlack from "@/assets/ArrowRightBlack.svg";
import ChevronRightWhite from "@/assets/ChevronRightWhite.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { SCROLL_CONFIG, DIMENSION_CONFIG } from "./constants";
import styles from "./styles.module.scss";
import { toSnakeCase } from "../../utils";

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

type TCommonFirstScreenSectionProps = {
  id?: string;
  heroShape: any;
  heroAlt?: string;
  title: string | string[];
  description: string;
  newTagConfig?: INewTagConfig;
  buttonList?: IButtonProps[];
} & (
  | { heroImage: any; heroImageElement?: never; heroImageAnimationData?: never }
  | {
      heroImage?: never;
      heroImageElement: React.ReactNode;
      heroImageAnimationData?: never;
    }
  | { heroImage?: never; heroImageElement?: never; heroImageAnimationData: any }
);

// Extend CSSProperties to include custom CSS variables
interface CSSPropertiesWithVars extends CSSProperties {
  "--scroll-offset"?: string;
}

export default function CommonFirstScreenSection({
  id,
  heroImage,
  heroImageElement,
  heroImageAnimationData,
  heroShape,
  heroAlt = "",
  title,
  description,
  newTagConfig,
  buttonList,
}: TCommonFirstScreenSectionProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();
  const {
    GRID_BACKGROUND_WIDTH,
    GRID_BACKGROUND_HEIGHT,
    HERO_IMAGE_WIDTH,
    HERO_IMAGE_HEIGHT,
    HERO_SHAPE_WIDTH,
    HERO_SHAPE_HEIGHT,
  } = useMemo(() => DIMENSION_CONFIG[deviceWidthType], [deviceWidthType]);

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

  const renderTitle = useCallback(() => {
    if (Array.isArray(title)) {
      return title.map((row, index) => <p key={index}>{row}</p>);
    } else {
      return title;
    }
  }, [title]);

  const hero = useMemo(() => {
    const commonProps = {
      className: styles.moveInDelayed100,
      style: {
        // Dynamically set CSS variable
        "--scroll-offset": `${heroImageOffset}px`,
      } as CSSPropertiesWithVars,
    };
    if (heroImage) {
      return (
        <CommonImage
          {...commonProps}
          src={heroImage}
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
          alt={heroAlt}
          priority
        />
      );
    } else if (heroImageElement) {
      return <div {...commonProps}>{heroImageElement}</div>;
    } else if (heroImageAnimationData) {
      return (
        <LottieAnimation
          className={clsx(styles.lottieAnimation, commonProps.className)}
          style={{
            width: HERO_IMAGE_WIDTH,
            height: HERO_IMAGE_HEIGHT,
            ...commonProps.style,
          }}
          animationData={heroImageAnimationData}
        />
      );
    }
  }, [
    HERO_IMAGE_HEIGHT,
    HERO_IMAGE_WIDTH,
    heroAlt,
    heroImage,
    heroImageAnimationData,
    heroImageElement,
    heroImageOffset,
  ]);

  return (
    <CommonSection
      id={id}
      sectionClassName={clsx(styles.commonFirstScreenSection, deviceClassName)}
      contentClassName={styles.commonFirstScreenContent}
    >
      <CommonImage
        className={clsx(styles.gridBackground, styles.fadeIn)}
        src={GridBackground}
        width={GRID_BACKGROUND_WIDTH}
        height={GRID_BACKGROUND_HEIGHT}
        priority
      />
      <div className={clsx(styles.introductionPart, styles.moveIn)}>
        {newTagConfig && (
          <CommonLink
            className={styles.newTagWrapper}
            href={newTagConfig.href}
            isExternalLinkTargetSelf={newTagConfig.isExternalLinkTargetSelf}
            onClick={() => {
              window.hj("event", `click_${toSnakeCase(newTagConfig.text)}`);
            }}
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
                hjId={buttonConfig.text}
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
        {hero}
        <CommonImage
          className={clsx(styles.heroShape, styles.moveInDelayed200)}
          style={
            {
              "--scroll-offset": `${heroShapeOffset}px`,
            } as CSSPropertiesWithVars
          } // Dynamically set CSS variable
          src={heroShape}
          width={HERO_SHAPE_WIDTH}
          height={HERO_SHAPE_HEIGHT}
          priority
        />
      </div>
    </CommonSection>
  );
}
