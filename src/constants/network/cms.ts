const devUrlConfig = {
  cms: "http://localhost:8058",
  aelf: "http://localhost:3000",
  webflow: "https://api.webflow.com/v2",
};
const testUrlConfig = {
  cms: "https://test-cms-v2.aelf.com",
  aelf: "https://test.aelf.com",
  webflow: "https://api.webflow.com/v2",
};
const proUrlConfig = {
  cms: "https://cms-v2.aelf.com",
  aelf: "https://aelf.com",
  webflow: "https://api.webflow.com/v2",
};

export default function getUrlConfig() {
  console.log("NEXT_PUBLIC_APP_ENV", process.env.NEXT_PUBLIC_APP_ENV);
  if (process.env.NEXT_PUBLIC_APP_ENV === "test") {
    return testUrlConfig;
  } else if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return proUrlConfig;
  }

  return devUrlConfig;
}
