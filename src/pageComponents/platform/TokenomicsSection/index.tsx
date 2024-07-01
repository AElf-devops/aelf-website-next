import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import TokenomicsItem, { ITokenomicsItemProps } from "./TokenomicsItem";
import TokenomicsIncentiveModel from "@/assets/platform/TokenomicsIncentiveModel.png";
import TokenomicsResourceAllocationModel from "@/assets/platform/TokenomicsResourceAllocationModel.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

const TOKENOMICS_ITEM_LIST: ITokenomicsItemProps[] = [
  {
    img: TokenomicsIncentiveModel,
    title: "Node and User Incentive Model",
    description:
      "aelf’s adoption of allocation rules ensures economic fairness for all participants and contributors, fostering sustainable development within the ecosystem.",
  },
  {
    img: TokenomicsResourceAllocationModel,
    title: "Blockchain Resource Allocation Model",
    description:
      "The Resource Token payment model adopts a pay-as-you-go approach, collecting transaction fees from developers based on resource utilisation.",
  },
];

export default function TokenomicsSection() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonSection
      sectionClassName={clsx(styles.tokenomicsSection, deviceClassName)}
      headerClassName={styles.tokenomicsHeader}
      title="aelf Tokenomics"
      description="aelf’s adoption of allocation rules ensures economic fairness for all participants and contributors, fostering sustainable development within the ecosystem."
    >
      <div className={styles.tokenomicsList}>
        {TOKENOMICS_ITEM_LIST.map((item, index) => (
          <TokenomicsItem
            key={index}
            className={styles.tokenomicsItem}
            {...item}
          />
        ))}
      </div>
    </CommonSection>
  );
}
