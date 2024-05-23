// next-sitemap.js

const devUrlConfig = {
  aelf: "http://192.168.11.44:9000",
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
  exclude: ["/blog.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [
      urlConfig.aelf + "/blog.xml",
    ],
  },
};
