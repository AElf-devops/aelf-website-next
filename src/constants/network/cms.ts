const devUrlConfig = {
  cms: "https://test-cms-v2.aelf.com",
};
const proUrlConfig = {
  cms: "https://test-cms-v2.aelf.com",
};

export default function getUrlConfig() {
  console.log("NEXT_PUBLIC_APP_ENV", process.env.NEXT_PUBLIC_APP_ENV);
  if (process.env.NEXT_PUBLIC_APP_ENV === "test") {
    return devUrlConfig;
  } else if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return proUrlConfig;
  } else {
    return devUrlConfig;
  }
}
