"use client";

import React, { createContext, useContext, useState } from "react";

export type DomainType = "highschool" | "university" | "extras";

interface DomainContextType {
  currentDomain: DomainType;
  setCurrentDomain: (domain: DomainType) => void;
}

const DomainContext = createContext<DomainContextType>({
  currentDomain: "highschool",
  setCurrentDomain: () => {},
});

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDomain, setCurrentDomain] = useState<DomainType>("highschool");

  return (
    <DomainContext.Provider value={{ currentDomain, setCurrentDomain }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => useContext(DomainContext);
