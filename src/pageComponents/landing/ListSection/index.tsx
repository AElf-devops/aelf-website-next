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
  alt: string;
}

const BACKED_LIST: IListItem[] = [
  {
    img: Investor.InvestorFBG,
    href: "https://www.fbg.capital/",
    alt: "FBG Capital - aelf's investor.",
  },
  {
    img: Investor.InvestorAlphabit,
    href: "https://alphabit.fund/",
    alt: "alphabit - aelf's investor.",
  },
  {
    img: Investor.InvestorGalaxy,
    href: "https://www.galaxy.com/",
    alt: "Galaxy Digital - aelf's investor.",
  },
  {
    img: Investor.InvestorVentures,
    href: "https://www.blockchain.com/ventures",
    alt: "Blockchain Ventures - aelf's investor.",
  },
  {
    img: Investor.InvestorBlocktower,
    href: "https://www.blocktower.com/",
    alt: "BlockTower - aelf's investor.",
  },
  {
    img: Investor.InvestorGBIC,
    href: "https://gbic.io/",
    alt: "Global Blockchain Innovative Capital GBIC - aelf's investor.",
  },
  {
    img: Investor.InvestorDHVC,
    href: "https://www.dh.vc/",
    alt: "DHVC - aelf's investor.",
  },
  {
    img: Investor.InvestorDraperDragon,
    href: "https://draperdragon.com/",
    alt: "DraperDragon - aelf's investor.",
  },
  {
    img: Investor.InvestorHashed,
    href: "https://www.hashed.com/",
    alt: "Hashed - aelf's investor.",
  },
  {
    img: Investor.InvestorHyperchain,
    href: "https://www.hyperchain.capital/",
    alt: "HyperChain Capital - aelf's investor.",
  },
  {
    img: Investor.Investor1kx,
    href: "https://1kx.network/",
    alt: "1KX - aelf's investor.",
  },
  {
    img: Investor.InvestorLinkvc,
    href: "https://www.linkvc.com/",
    alt: "LinkVC - aelf's investor.",
  },
  {
    img: Investor.InvestorSignum,
    href: "https://www.signum.capital/",
    alt: "Signum Capital - aelf's investor.",
  },
  {
    img: Investor.InvestorLD,
    href: "https://ldcap.com/",
    alt: "LD Capital - aelf's investor.",
  },
  {
    img: Investor.InvestorHappyEast,
    href: "http://he.capital/",
    alt: "Happy East Capital - aelf's investor.",
  },
  {
    img: Investor.InvestorBIXIN,
    href: "https://bixinvc.com/",
    alt: "BIXIN Ventures - aelf's investor.",
  },
  {
    img: Investor.InvestorBitmain,
    href: "https://www.bitmain.com/",
    alt: "Bitmain - aelf's investor.",
  },
];

const LISTED_LIST: IListItem[] = [
  {
    img: Exchange.ExchangeBinance,
    href: "https://www.binance.com/en/trade/ELF_USDT?type=spot",
    alt: "aelf is listed on Binance",
  },
  {
    img: Exchange.ExchangeUniswap,
    href: "https://app.uniswap.org/explore/tokens/ethereum/0xbf2179859fc6d5bee9bf9158632dc51678a4100e",
    alt: "aelf is listed on Uniswap",
  },
  {
    img: Exchange.ExchangeOKX,
    href: "https://www.okx.com/trade-spot/elf-usdt",
    alt: "aelf is listed on OKX",
  },
  {
    img: Exchange.ExchangeMEXC,
    href: "https://www.mexc.com/exchange/ELF_USDT",
    alt: "aelf is listed on MEXC Global",
  },
  {
    img: Exchange.ExchangeBitget,
    href: "https://www.bitget.com/spot/ELFUSDT",
    alt: "aelf is listed on Bitget",
  },
  {
    img: Exchange.ExchangeBitMart,
    href: "https://www.bitmart.com/trade/en-US?symbol=ELF_USDT",
    alt: "aelf is listed on BitMart",
  },
  {
    img: Exchange.ExchangeKUcoin,
    href: "https://www.kucoin.com/trade/ELF-USDT",
    alt: "aelf is listed on KuCoin",
  },
  {
    img: Exchange.ExchangeHTX,
    href: "https://www.htx.com/trade/elf_usdt?type=spot",
    alt: "aelf is listed on HTX",
  },
  {
    img: Exchange.ExchangeGate,
    href: "https://www.gate.io/trade/ELF_USDT",
    alt: "aelf is listed on Gate io",
  },
  {
    img: Exchange.ExchangeBithumb,
    href: "https://m.bithumb.com/react/trade/order/ELF-KRW",
    alt: "aelf is listed on bithumb",
  },
  {
    img: Exchange.ExchangeCrypto,
    href: "https://crypto.com/price/aelf",
    alt: "aelf is listed on crypto.com",
  },
  {
    img: Exchange.ExchangeAscendEX,
    href: "https://ascendex.com/en/cashtrade-spottrading/usdt/elf",
    alt: "aelf is listed on AscendEX",
  },
  {
    img: Exchange.ExchangeBitrue,
    href: "https://www.bitrue.com/trade/elf_usdt",
    alt: "aelf is listed on bitrue",
  },
  {
    img: Exchange.ExchangePhemex,
    href: "https://phemex.com/spot/trade/ELFUSDT",
    alt: "aelf is listed on phemex",
  },
  {
    img: Exchange.ExchangeLatoken,
    href: "https://latoken.com/exchange/ELF_USDT",
    alt: "aelf is listed on Latoken",
  },
  {
    img: Exchange.ExchangeBingX,
    href: "https://bingx.com/en/spot/ELFUSDT/",
    alt: "aelf is listed on BingX",
  },
  {
    img: Exchange.ExchangeBitvavo,
    href: "https://bitvavo.com/en/aelf/price",
    alt: "aelf is listed on bitvavo",
  },
  {
    img: Exchange.ExchangeKoinpark,
    href: "https://www.koinpark.com/trade/ELF-USDT/",
    alt: "aelf is listed on Koinpark",
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
                <CommonLink
                  key={idx}
                  className={styles.listImage}
                  href={item.href}
                >
                  <CommonImage src={item.img} alt={item.alt} />
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
