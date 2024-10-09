export const GTM_ID = "GTM-W8D6DHQZ";

export const AMPLITUDE_ID =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "bee82a4c25f050b76de824d4205598af"
    : "f8353b12940003d29591e81df4f7007f";

export const AMPLITUDE_SAMPLE_RATE =
  process.env.NEXT_PUBLIC_APP_ENV === "production" ? 0.1 : 1;

export enum PAGE_KEY {
  LANDING = "landing",
  PLATFORM = "platform",
  DEVELOPER_CENTER = "developerCenter",
  ECOSYSTEM = "ecosystem",
}

export const PAGE_METADATA = {
  [PAGE_KEY.LANDING]: {
    TITLE: "aelf: Layer 1 AI Blockchain",
    DESCRIPTION:
      "aelf is a high-performance Layer 1 AI blockchain with built-in cross-chain functions, offering scalable infrastructure with AI for Web3 DApps development.",
    PATH: "/",
  },
  [PAGE_KEY.PLATFORM]: {
    TITLE: "aelf | Platform",
    DESCRIPTION:
      "aelf is powered by innovative blockchain technology with AI. Explore aelf's scalable blockchain infrastructure and customise it to your needs.",
    PATH: "/platform",
  },
  [PAGE_KEY.DEVELOPER_CENTER]: {
    TITLE: "aelf | Developer Resources",
    DESCRIPTION:
      "Learn how to build on aelf with our detailed documentation. Discover AI blockchain tools and scalable infrastructure for high-performance Web3 DApps.",
    PATH: "/developer-center",
  },
  [PAGE_KEY.ECOSYSTEM]: {
    TITLE: "aelf | Ecosystem",
    DESCRIPTION:
      "aelf is a high-performance Layer 1 AI blockchain. Discover the vibrant ecosystem powered by aelf's blockchain and AI technology.",
    PATH: "/ecosystem",
  },
};
