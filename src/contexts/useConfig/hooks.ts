import { useMemo } from "react";
import { useConfigContext } from "./index";

export const useConfig = () => {
  const config = useConfigContext();

  return useMemo(() => config, [config]);
};
