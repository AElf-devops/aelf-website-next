import clsx from "clsx";
import CommonImage from "@/components/CommonImage";
import CommonButton, {
  ICommonButtonProps,
  CommonButtonSize,
} from "@/components/CommonButton";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

interface IButtonConfig
  extends Pick<ICommonButtonProps, "href" | "isExternalLinkTargetSelf"> {
  text: string;
}

export interface IFunctionCardItemProps {
  className?: string;
  icon: any;
  title: string;
  description: string;
  buttonConfig: IButtonConfig;
}

export default function FunctionCardItem({
  className,
  icon,
  title,
  description,
  buttonConfig,
}: IFunctionCardItemProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  return (
    <div className={clsx(styles.functionCardItem, deviceClassName, className)}>
      <CommonImage src={icon} width={64} height={64} />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      <CommonButton
        {...buttonConfig}
        size={
          deviceWidthType === DeviceWidthType.DESKTOP
            ? CommonButtonSize.MD
            : CommonButtonSize.SM
        }
        hjId={buttonConfig.text}
      >
        {buttonConfig.text}
      </CommonButton>
    </div>
  );
}
