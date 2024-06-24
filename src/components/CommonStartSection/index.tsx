import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import CommonButton, {
  CommonButtonSize,
  CommonButtonType,
  ICommonButtonProps,
} from "@/components/CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

interface IButtonProps extends Pick<ICommonButtonProps, "onClick"> {
  text: string;
}

interface ICommonStartSectionProps {
  className?: string;
  title?: string;
  description?: string;
  buttonList?: IButtonProps[];
}

const DEFAULT_START_SECTION_CONFIG: Required<
  Omit<ICommonStartSectionProps, "className">
> = {
  title: "Be part of tomorrow with aelf",
  description:
    "Start building on aelf today and realise your vision for tomorrow.",
  buttonList: [
    {
      text: "Start Building",
    },
    {
      text: "Read Docs",
    },
  ],
};

export default function CommonStartSection({
  className,
  title,
  description,
  buttonList,
}: ICommonStartSectionProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  return (
    <CommonSection
      sectionClassName={clsx(
        styles.commonStartSection,
        deviceClassName,
        className
      )}
      contentClassName={styles.commonStartContent}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          {title || DEFAULT_START_SECTION_CONFIG.title}
        </div>
        <div className={styles.description}>
          {description || DEFAULT_START_SECTION_CONFIG.description}
        </div>
      </div>
      <div className={styles.buttonList}>
        {(buttonList || DEFAULT_START_SECTION_CONFIG.buttonList).map(
          (item, index) => (
            <CommonButton
              key={index}
              className={styles.button}
              isRound
              type={
                index === 0
                  ? CommonButtonType.WHITE
                  : CommonButtonType.GHOST_BLUE
              }
              size={
                deviceWidthType === DeviceWidthType.DESKTOP
                  ? CommonButtonSize.MD
                  : CommonButtonSize.SM
              }
              onClick={item.onClick}
            >
              {item.text}
            </CommonButton>
          )
        )}
      </div>
    </CommonSection>
  );
}
