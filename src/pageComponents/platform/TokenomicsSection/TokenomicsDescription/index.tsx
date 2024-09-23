import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

const DESCRIPTION_LIST = [
  [
    "Foundation (25%): Lock-up for three years to build the aelf ecosystem, support marketing activities and sustain the development and operation of the aelf project.",
    "Sale (25%): Used for private sale, fully unlocked on TGE, no vesting period.",
    "Team (16%): Lock-up for two years, with the same proportion of tokens being released every half year.",
  ],
  [
    "Marketing/AirDrop (12%): Used in the first three years to promote community engagement.",
    "AEDPoS (12%): Mined for 100 years, with linear gradient reduction on mining rewards on an annual basis.",
    "Advisors & Partnership (10%): Lock-up for two years, with the same proportion of tokens being released every half year. ",
  ],
];

export default function TokenomicsDescription() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <div className={clsx(styles.tokenomicsDescription, deviceClassName)}>
      <div className={styles.title}>
        Here’s a breakdown of how ELF is distributed and used within the market:
      </div>
      <div className={styles.descriptionList}>
        {DESCRIPTION_LIST.map((group, index) => (
          <ul key={index} className={styles.descriptionGroup}>
            {group.map((text, idx) => (
              <li key={idx} className={styles.descriptionItem}>
                {text}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
