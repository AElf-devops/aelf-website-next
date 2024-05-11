const devUrlConfig = {
  cms: "http://192.168.11.5:8066",
  // cms: "https://test-cms-v2.aelf.com",
};
const proUrlConfig = {
  // cms: "http://192.168.11.170:8066",
  cms: "https://test-cms-v2.aelf.com"
};

export default function getUrlConfig() {
  return process.env.NODE_ENV === "development" ? devUrlConfig : proUrlConfig;
}
