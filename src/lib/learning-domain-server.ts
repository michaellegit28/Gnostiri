import { cookies } from "next/headers";
import { LEARNING_DOMAIN_STORAGE_KEY, normalizeLearningDomain } from "./learning-domain";

/**
 * Server-side read of the lane cookie set by the domain switcher. This is an
 * IA preference, never an entitlement: subscription checks stay where they are.
 */
export function learningDomainFromCookies() {
  const jar = cookies();
  return normalizeLearningDomain(jar.get(LEARNING_DOMAIN_STORAGE_KEY)?.value);
}