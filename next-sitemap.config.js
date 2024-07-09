/** @type {import('next-sitemap').IConfig} */

const devUrlConfig = {
  aelf: "http://localhost:3000",
  robotsTxtPolicies: [
    { userAgent: "*", disallow: "/" },
    { userAgent: "Googlebot", allow: "/_next/static/" },
  ],
};
const testUrlConfig = {
  aelf: "https://test.aelf.com",
  robotsTxtPolicies: [
    { userAgent: "*", disallow: "/" },
    { userAgent: "Googlebot", allow: "/_next/static/" },
  ],
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
