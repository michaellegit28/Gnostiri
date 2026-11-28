"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DEFAULT_LEARNING_DOMAIN,
  LEARNING_DOMAIN_STORAGE_KEY,
  normalizeLearningDomain,
  type LearningDomain,
} from "@/lib/learning-domain";

export type DomainType = "highschool" | "university" | "extras";

interface DomainContextType {
  /** Tutor-facing domain: the current route (discovery → extras) or a manual pick. */
  currentDomain: DomainType | null;
  setCurrentDomain: (domain: DomainType) => void;
  /** The student's lane: what the nav and study hubs are filtered to. */
  learningDomain: LearningDomain | null;
  /** False until the lane is resolved (auth check + stored choice). */
  domainReady: boolean;
  setLearningDomain: (domain: LearningDomain) => void;
}

const DomainContext = createContext<DomainContextType>({
  currentDomain: null,
  setCurrentDomain: () => {},
  learningDomain: null,
  domainReady: false,
  setLearningDomain: () => {},
});

function readStoredDomain(): LearningDomain | null {
  try {
    return normalizeLearningDomain(window.localStorage.getItem(LEARNING_DOMAIN_STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStoredDomain(domain: LearningDomain) {
  try {
    window.localStorage.setItem(LEARNING_DOMAIN_STORAGE_KEY, domain);
    // The cookie lets server-rendered hubs (/study, /practice) ship only the
    // lane's cards on the next request instead of sending the other lane's data
    // in the client props for a filter to strip.
    document.cookie = `${LEARNING_DOMAIN_STORAGE_KEY}=${encodeURIComponent(domain)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {
    // Device storage/cookies can be full/blocked; the choice still applies this session.
  }
}

function domainFromPathname(pathname: string): DomainType | null {
  const segment = pathname.split("/")[1];
  if (segment === "highschool" || segment === "university" || segment === "discovery") return segment === "discovery" ? "extras" : segment;
  return null;
}

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { user, loading } = useAuth();
  const [manualDomain, setManualDomain] = useState<DomainType | null>(null);
  const [learningDomain, setLearningDomainState] = useState<LearningDomain | null>(null);
  const [domainReady, setDomainReady] = useState(false);

  // Lane resolution: never render a mixed lane while the auth state is unknown.
  useEffect(() => {
    let active = true;
    if (loading) return;
    const stored = readStoredDomain();
    if (!user) {
      setLearningDomainState(stored ?? DEFAULT_LEARNING_DOMAIN);
      setDomainReady(true);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/learning-domain", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { domain?: unknown };
          const serverDomain = normalizeLearningDomain(data.domain);
          if (active && serverDomain) {
            writeStoredDomain(serverDomain);
            setLearningDomainState(serverDomain);
            setDomainReady(true);
            return;
          }
        }
      } catch {
        // Device-stored lane still works if synced preferences are unavailable.
      }
      if (active) {
        setLearningDomainState(stored ?? DEFAULT_LEARNING_DOMAIN);
        setDomainReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, user]);

  // Route follows the tutor context; discovery is the shared extras domain.
  const currentDomain = manualDomain ?? domainFromPathname(pathname);

  const setCurrentDomain = useCallback((domain: DomainType) => {
    setManualDomain(domain);
  }, []);

  const setLearningDomain = useCallback(
    (domain: LearningDomain) => {
      setLearningDomainState(domain);
      writeStoredDomain(domain);
      // The lane is resolved server-side (profile / cookie), so a switch must
      // re-render the server components — Home, the hubs — immediately, not on
      // the next manual refresh. refresh() runs after the profile sync resolves
      // so the server never reads a stale lane.
      if (user) {
        void fetch("/api/learning-domain", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        })
          .then(() => router.refresh())
          .catch(() => {
            // A failed sync must not lose the choice; the local lane still applies.
          });
      } else {
        router.refresh();
      }
    },
    [user, router]
  );

  return (
    <DomainContext.Provider
      value={{
        currentDomain,
        setCurrentDomain,
        learningDomain: learningDomain ?? DEFAULT_LEARNING_DOMAIN,
        domainReady,
        setLearningDomain,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => useContext(DomainContext);