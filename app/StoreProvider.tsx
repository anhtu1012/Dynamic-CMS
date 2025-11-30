/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  // Expose store to window for axios interceptor access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__REDUX_STORE__ = store;
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
