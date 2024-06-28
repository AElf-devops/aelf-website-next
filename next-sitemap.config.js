// next-sitemap.js

const devUrlConfig = {
  aelf: "http://localhost:3000",
};
const testUrlConfig = {
  aelf: "https://test.aelf.com",
};
const proUrlConfig = {
  aelf: "https://aelf.com",
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
  sitemapSize: 5000,
};
