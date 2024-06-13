import React, { createContext, useContext, useMemo, useReducer } from "react";
import { DeviceWidthType } from "@/constants/breakpoints";

const INITIAL_STATE = {
  isMobile: false,
  deviceWidthType: DeviceWidthType.Desktop,
};
const ConfigContext = createContext<any>(INITIAL_STATE);

type TConfigState = {
  isMobile: boolean;
  deviceWidthType: DeviceWidthType;
};

export function useConfigContext(): [TConfigState, React.Dispatch<any>] {
  return useContext(ConfigContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case "UPDATE_CONFIG":
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}

export default function ConfigProvider({
  children,
  init,
}: {
  children: React.ReactNode;
  init?: Partial<TConfigState>;
}) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, ...init });

  return (
    <ConfigContext.Provider value={useMemo(() => [state, dispatch], [state])}>
      {children}
    </ConfigContext.Provider>
  );
}
