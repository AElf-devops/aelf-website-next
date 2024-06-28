import { Fragment } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonImage from "@/components/CommonImage";
import * as Investor from "@/assets/investor";
import * as Exchange from "@/assets/exchange";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

const BACKED_LIST = [
  Investor.Investor1,
  Investor.Investor2,
  Investor.Investor3,
  Investor.Investor4,
  Investor.Investor5,
  Investor.Investor6,
  Investor.Investor7,
  Investor.Investor8,
  Investor.Investor9,
  Investor.Investor10,
  Investor.Investor11,
  Investor.Investor12,
  Investor.Investor13,
  Investor.Investor14,
  Investor.Investor15,
  Investor.Investor16,
  Investor.Investor17,
  Investor.Investor18,
  Investor.Investor19,
  Investor.Investor20,
  Investor.Investor21,
  Investor.Investor22,
  Investor.Investor23,
  Investor.Investor24,
  Investor.Investor25,
];

const LISTED_LIST = [
  Exchange.Exchange1,
  Exchange.Exchange2,
  Exchange.Exchange3,
  Exchange.Exchange4,
  Exchange.Exchange5,
  Exchange.Exchange6,
  Exchange.Exchange7,
  Exchange.Exchange8,
  Exchange.Exchange9,
  Exchange.Exchange10,
  Exchange.Exchange11,
  Exchange.Exchange12,
  Exchange.Exchange13,
  Exchange.Exchange14,
  Exchange.Exchange15,
  Exchange.Exchange16,
  Exchange.Exchange17,
  Exchange.Exchange18,
];

export default function ListSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const renderList = (list: any[], rowSize: number) => {
    const rows: any[][] = list.reduce((result, item, index) => {
      const rowIndex = Math.floor(index / rowSize);
      if (!result[rowIndex]) {
        result[rowIndex] = [];
      }
      result[rowIndex].push(item);
      return result;
    }, []);

    return (
      <div className={styles.list}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index === 0 && <div className={styles.divider} />}
            <div
              className={clsx(styles.listRow, {
                [styles.listRowCentered]: row.length < rowSize,
              })}
            >
              {row.map((img, idx) => (
                <CommonImage key={idx} className={styles.listImage} src={img} />
              ))}
            </div>
            <div className={styles.divider} />
          </Fragment>
        ))}
      </div>
    );
  };

  return (
    <CommonSection
      sectionClassName={clsx(styles.listSection, deviceClassName)}
      contentClassName={styles.listContent}
    >
      <div className={styles.listPart}>
        <div className={styles.title}>We are backed by</div>
        {renderList(
          BACKED_LIST,
          deviceWidthType === DeviceWidthType.MOBILE ? 3 : 5
        )}
      </div>
      <div className={styles.listPart}>
        <div className={styles.title}>We are listed on</div>
        {renderList(
          LISTED_LIST,
          deviceWidthType === DeviceWidthType.MOBILE ? 3 : 6
        )}
      </div>
    </CommonSection>
  );
}
