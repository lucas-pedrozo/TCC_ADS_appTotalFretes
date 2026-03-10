import React, { createContext, useCallback, useContext, useState } from "react";
import type { FreightUserMap } from "@/src/interfaces/freight";

export interface CarProjectionContextValue {
  freightForDisplay: FreightUserMap | null;
  setFreightForDisplay: (freight: FreightUserMap | null) => void;
}

const CarProjectionContext = createContext<CarProjectionContextValue | null>(null);

export function CarProjectionProvider({ children }: { children: React.ReactNode }) {
  const [freightForDisplay, setFreightForDisplayState] = useState<FreightUserMap | null>(null);

  const setFreightForDisplay = useCallback((freight: FreightUserMap | null) => {
    setFreightForDisplayState(freight);
  }, []);

  const value: CarProjectionContextValue = {
    freightForDisplay,
    setFreightForDisplay,
  };

  return (
    <CarProjectionContext.Provider value={value}>
      {children}
    </CarProjectionContext.Provider>
  );
}

export function useCarProjection() {
  const ctx = useContext(CarProjectionContext);
  if (!ctx) {
    throw new Error("useCarProjection must be used within CarProjectionProvider");
  }
  return ctx;
}
