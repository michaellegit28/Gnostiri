// Learning-domain separation.
//
// Owner directive: a university student should not see high-school content or
// features, a high-school student should not see university content or
// features, and ONLY discovery is shared. This file is the single rule so the
// nav, the /study hub and the practice hub cannot drift apart.
//
// Direct URLs remain reachable: this is a product IA rule ("your session shows
// your lane"), not an authorization wall. Authorization stays in
// src/middleware.ts and the entitlement checks.

export type LearningDomain = "highschool" | "university";

export const LEARNING_DOMAINS: LearningDomain[] = ["highschool", "university"];

export const DEFAULT_LEARNING_DOMAIN: LearningDomain = "highschool";

/** Device-local choice before sign-in; the signed-in copy lives in Profile.currentDomain. */
export const LEARNING_DOMAIN_STORAGE_KEY = "gnostiri.learning-domain";

/** Which nav destinations belong to a lane. Shared items return true for both. */
export type NavAudience = LearningDomain | "shared";

export function normalizeLearningDomain(value: unknown): LearningDomain | null {
  return value === "highschool" || value === "university" ? value : null;
}

export function learningDomainFromPathname(pathname: string): LearningDomain | null {
  const segment = pathname.split("/")[1] ?? "";
  return normalizeLearningDomain(segment);
}

export function isDiscoveryPath(pathname: string): boolean {
  return pathname === "/discovery" || pathname.startsWith("/discovery/");
}

export function domainHome(domain: LearningDomain): string {
  return domain === "highschool" ? "/highschool" : "/university";
}

export function domainLabel(domain: LearningDomain): string {
  return domain === "highschool" ? "High School" : "University";
}

/** A route is visible for a lane only when it is shared or belongs to that lane. */
export function isVisibleForLearningDomain(pathname: string, domain: LearningDomain): boolean {
  const pathDomain = learningDomainFromPathname(pathname);
  if (!pathDomain) return true;
  return pathDomain === domain;
}

/**
 * A nav card/item built on a shared URL can still belong to one lane (Battle
 * Plan is the high-school study-plan surface), so the nav filter must test the
 * item's own audience, not its route prefix.
 */
export function isVisibleForAudience(audience: NavAudience, domain: LearningDomain): boolean {
  return audience === "shared" || audience === domain;
}

/** Applies to both lanes — discovery and personal workspace, but never a lane's own content. */
export function isSharedLearningPath(pathname: string): boolean {
  if (isDiscoveryPath(pathname)) return true;
  return !learningDomainFromPathname(pathname);
}