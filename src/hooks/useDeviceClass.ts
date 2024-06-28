import { useConfig } from "@/contexts/useConfig/hooks";

export const useDeviceClass = (styles?: any) => {
  const [{ deviceWidthType }] = useConfig();
  if (!styles) deviceWidthType;
  return styles[deviceWidthType];
};
