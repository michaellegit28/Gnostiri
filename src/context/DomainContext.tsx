"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DomainType = "highschool" | "university" | "extras";

interface DomainContextType {
  currentDomain: DomainType | null;
  setCurrentDomain: (domain: DomainType) => void;
}

const DomainContext = createContext<DomainContextType>({
  currentDomain: null,
  setCurrentDomain: () => {},
});

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDomain, setCurrentDomain] = useState<DomainType | null>(null);
  useEffect(() => {
    const pathDomain = window.location.pathname.split("/")[1];
    const queryDomain = new URLSearchParams(window.location.search).get("domain");
    const resolved = ["highschool", "university", "extras"].includes(pathDomain) ? pathDomain : queryDomain;
    setCurrentDomain(["highschool", "university", "extras"].includes(resolved || "") ? resolved as DomainType : null);
  }, []);

  return (
    <DomainContext.Provider value={{ currentDomain, setCurrentDomain }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => useContext(DomainContext);
