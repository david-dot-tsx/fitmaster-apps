import { onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ConnectivityContextValue = {
  isOnline: boolean;
};

const ConnectivityContext = createContext<ConnectivityContextValue>({
  isOnline: true,
});

export const ConnectivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      const unsubscribe = NetInfo.addEventListener((state) => {
        const nextOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
        setOnline(nextOnline);
        setIsOnline(nextOnline);
      });

      return unsubscribe;
    });
  }, []);

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return <ConnectivityContext.Provider value={value}>{children}</ConnectivityContext.Provider>;
};

export const useConnectivity = () => useContext(ConnectivityContext);
