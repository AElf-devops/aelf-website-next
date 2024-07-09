/** @type {import('next-sitemap').IConfig} */

const devUrlConfig = {
  aelf: "http://localhost:3000",
  robotsTxtPolicies: [{ userAgent: "*", allow: "/" }],
};
const testUrlConfig = {
  aelf: "https://test.aelf.com",
  robotsTxtPolicies: [{ userAgent: "*", allow: "/" }],
};
const proUrlConfig = {
  aelf: "https://aelf.com",
  robotsTxtPolicies: [{ userAgent: "*", disallow: "/blog" }],
};

function getUrlConfig() {
  if (process.env.NEXT_PUBLIC_APP_ENV === "test") {
    return testUrlConfig;
  } else if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return proUrlConfig;
  }
  return devUrlConfig;
}

const urlConfig = getUrlConfig();

module.exports = {
  siteUrl: urlConfig.aelf,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: urlConfig.robotsTxtPolicies,
  },
};
