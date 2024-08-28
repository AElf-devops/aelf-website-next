export const GTM_ID = "GTM-W8D6DHQZ";

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
    DESCRIPTION: "Explore the innovative blockchain technology powering aelf.",
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
      "Discover the vibrant ecosystem powered by aelf's blockchain and AI technology.",
    PATH: "/ecosystem",
  },
};
