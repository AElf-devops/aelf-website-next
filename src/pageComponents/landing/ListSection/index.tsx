import { Fragment } from "react";
import clsx from "clsx";
import CommonSection from "@/components/CommonSection";
import CommonLink from "@/components/CommonLink";
import CommonImage from "@/components/CommonImage";
import * as Investor from "@/assets/investor";
import * as Exchange from "@/assets/exchange";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import styles from "./styles.module.scss";

interface IListItem {
  img: any;
  href: string;
}

const BACKED_LIST: IListItem[] = [
  {
    img: Investor.InvestorFBG,
    href: "https://www.fbg.capital/",
  },
  {
    img: Investor.InvestorAlphabit,
    href: "https://alphabit.fund/",
  },
  {
    img: Investor.InvestorGalaxy,
    href: "https://www.galaxy.com/",
  },
  {
    img: Investor.InvestorVentures,
    href: "https://www.blockchain.com/ventures",
  },
  {
    img: Investor.InvestorBlocktower,
    href: "https://www.blocktower.com/",
  },
  {
    img: Investor.InvestorGBIC,
    href: "https://gbic.io/",
  },
  {
    img: Investor.InvestorDHVC,
    href: "https://www.dh.vc/",
  },
  {
    img: Investor.InvestorDraperDragon,
    href: "https://draperdragon.com/",
  },
  {
    img: Investor.InvestorHashed,
    href: "https://www.hashed.com/",
  },
  {
    img: Investor.InvestorHyperchain,
    href: "https://www.hyperchain.capital/",
  },
  {
    img: Investor.Investor1kx,
    href: "https://1kx.network/",
  },
  {
    img: Investor.InvestorLinkvc,
    href: "https://www.linkvc.com/",
  },
  {
    img: Investor.InvestorSignum,
    href: "https://www.signum.capital/",
  },
  {
    img: Investor.InvestorLD,
    href: "https://ldcap.com/",
  },
  {
    img: Investor.InvestorHappyEast,
    href: "http://he.capital/",
  },
  {
    img: Investor.InvestorBIXIN,
    href: "https://bixinvc.com/",
  },
  {
    img: Investor.InvestorBitmain,
    href: "https://www.bitmain.com/",
  },
];

const LISTED_LIST: IListItem[] = [
  {
    img: Exchange.ExchangeBinance,
    href: "https://www.binance.com/en/trade/ELF_USDT?type=spot",
  },
  {
    img: Exchange.ExchangeUniswap,
    href: "https://app.uniswap.org/explore/tokens/ethereum/0xbf2179859fc6d5bee9bf9158632dc51678a4100e",
  },
  {
    img: Exchange.ExchangeOKX,
    href: "https://www.okx.com/trade-spot/elf-usdt",
  },
  {
    img: Exchange.ExchangeMEXC,
    href: "https://www.mexc.com/exchange/ELF_USDT",
  },
  {
    img: Exchange.ExchangeBitget,
    href: "https://www.bitget.com/spot/ELFUSDT",
  },
  {
    img: Exchange.ExchangeBitMart,
    href: "https://www.bitmart.com/trade/en-US?symbol=ELF_USDT",
  },
  {
    img: Exchange.ExchangeKUcoin,
    href: "https://www.kucoin.com/trade/ELF-USDT",
  },
  {
    img: Exchange.ExchangeHTX,
    href: "https://www.htx.com/trade/elf_usdt?type=spot",
  },
  {
    img: Exchange.ExchangeGate,
    href: "https://www.gate.io/trade/ELF_USDT",
  },
  {
    img: Exchange.ExchangeBithumb,
    href: "https://m.bithumb.com/react/trade/order/ELF-KRW",
  },
  {
    img: Exchange.ExchangeCrypto,
    href: "https://crypto.com/price/aelf",
  },
  {
    img: Exchange.ExchangeAscendEX,
    href: "https://ascendex.com/en/cashtrade-spottrading/usdt/elf",
  },
  {
    img: Exchange.ExchangeBitrue,
    href: "https://www.bitrue.com/trade/elf_usdt",
  },
  {
    img: Exchange.ExchangePhemex,
    href: "https://phemex.com/spot/trade/ELFUSDT",
  },
  {
    img: Exchange.ExchangeLatoken,
    href: "https://latoken.com/exchange/ELF_USDT",
  },
  {
    img: Exchange.ExchangeBingX,
    href: "https://bingx.com/en/spot/ELFUSDT/",
  },
  {
    img: Exchange.ExchangeBitvavo,
    href: "https://bitvavo.com/en/aelf/price",
  },
  {
    img: Exchange.ExchangeKoinpark,
    href: "https://www.koinpark.com/trade/ELF-USDT/",
  },
];

export default function ListSection() {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const renderList = (list: IListItem[], rowSize: number) => {
    const rows = list.reduce((result, item, index) => {
      const rowIndex = Math.floor(index / rowSize);
      if (!result[rowIndex]) {
        result[rowIndex] = [];
      }
      result[rowIndex].push(item);
      return result;
    }, [] as IListItem[][]);

    return (
      <div className={styles.list}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index === 0 && <div className={styles.divider} />}
            <div
              className={clsx(styles.listRow, {
                [styles.listRowNotFull]: row.length < rowSize,
              })}
            >
              {row.map((item, idx) => (
                <CommonLink key={idx} className={styles.listImage} href={item.href}>
                  <CommonImage src={item.img} />
                </CommonLink>
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
          deviceWidthType === DeviceWidthType.MOBILE ? 3 : 6
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
