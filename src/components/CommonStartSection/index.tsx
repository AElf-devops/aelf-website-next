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
  title: string;
  description: string;
  buttonList: IButtonProps[];
}

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
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.buttonList}>
        {buttonList.map((item, index) => (
          <CommonButton
            key={index}
            className={styles.button}
            isRound
            type={index === 0 ? CommonButtonType.WHITE : CommonButtonType.GHOST_BLUE}
            size={
              deviceWidthType === DeviceWidthType.DESKTOP
                ? CommonButtonSize.MD
                : CommonButtonSize.SM
            }
            onClick={item.onClick}
          >
            {item.text}
          </CommonButton>
        ))}
      </div>
    </CommonSection>
  );
}
