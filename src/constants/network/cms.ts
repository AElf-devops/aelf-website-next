const devUrlConfig = {
  cms: "https://test-cms-v2.aelf.com",
};
const proUrlConfig = {
  cms: "https://test-cms-v2.aelf.com"
};

export default function getUrlConfig() {
  return process.env.NODE_ENV === "development" ? devUrlConfig : proUrlConfig;
}
