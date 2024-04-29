import React, { createContext, useContext, useMemo, useReducer } from "react";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { ANTD_THEME_CONFIG } from "@/constants/theme/antdThemeConfig";
const INITIAL_STATE = {};
const ConfigContext = createContext<any>(INITIAL_STATE);

type TConfigState = {
  isMobile: boolean;
};

export function useConfigContext(): TConfigState {
  return useContext(ConfigContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export default function ConfigProvider({
  children,
  init,
}: {
  children: React.ReactNode;
  init?: TConfigState;
}) {
  const [state] = useReducer(reducer, { ...INITIAL_STATE, ...init });

  return (
    <ConfigContext.Provider value={useMemo(() => state, [state])}>
      <AntdConfigProvider theme={ANTD_THEME_CONFIG}>{children}</AntdConfigProvider>
    </ConfigContext.Provider>
  );
}
