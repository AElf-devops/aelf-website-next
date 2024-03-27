import { useConfig } from "@/contexts/useConfig/hooks";

export const useDeviceClass = (styles?: any) => {
  const { isMobile } = useConfig();
  const className = isMobile ? "mobile" : "desktop";
  if (!styles) className;
  return styles[className];
};
