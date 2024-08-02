import { ICommonIconCardProps } from "@/components/CommonIconCard";
import { ICommonCardProps } from "@/components/CommonCard";
import Innovation from "@/assets/Innovation.svg";
import Mentor from "@/assets/Mentor.svg";
import Partner from "@/assets/Partner.svg";
import CrystalFunImg from "@/assets/ecosystem/CrystalFun.png";
import MythicProtocolImg from "@/assets/ecosystem/MythicProtocol.png";
import PlutoImg from "@/assets/ecosystem/Pluto.png";

export const ICON_CARD_LIST: ICommonIconCardProps[] = [
  {
    icon: Innovation,
    title: "Funding for Innovation",
    description:
      "aelf Ventures provides financial support to cutting-edge projects that demonstrate strong potential for growth and innovation in the blockchain space.",
  },
  {
    icon: Mentor,
    title: "Strategic Mentorship",
    description:
      "Our team of experts offers mentorship and guidance to help startups navigate the complexities of blockchain development and business growth.",
  },
  {
    icon: Partner,
    title: "Building Ecosystem Partnerships",
    description:
      "By fostering strategic partnerships, aelf Ventures helps startups connect with industry leaders, enabling collaborative growth and success.",
  },
];

export const PORTFOLIO_CARD_LIST: ICommonCardProps[] = [
  {
    icon: CrystalFunImg,
    iconAlt: "Crystal Fun - decentralised Web3 game. aelf's portfolio.",
    description:
      "Crystal Fun, a decentralized Web3 game ecosystem, ushering ground breaking experiences with high-quality Web3 games.",
    arrowText: "Learn more",
    href: "https://crystalfun.io/",
  },
  {
    icon: MythicProtocolImg,
    iconAlt:
      "Confiction (previously Mythic Protocol) - gameplay-first ARPG with blockchain technology. aelf's portfolio.",
    description:
      "Confiction (ex-name: Mythic Protocol) is developing an exhilarating gameplay-first roguelike ARPG with blockchain technology.",
    arrowText: "Learn more",
    href: "https://www.confiction.com/",
  },
  {
    icon: PlutoImg,
    iconAlt:
      "Pluto - gaming studio bridging Web2 into Web3 games. aelf's portfolio.",
    description:
      "Pluto is a gaming studio, with a vision of bridging casual to midcore Web2 into Web3 games across Ton and multichain ecosystems.",
    arrowText: "Learn more",
    href: "https://www.pluto.vision/",
  },
];
