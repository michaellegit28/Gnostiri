"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent, type AnalyticsEventType } from "@/lib/analytics-client";

export default function AnalyticsBeacon({
  type,
  meta = {},
}: {
  type: AnalyticsEventType;
  meta?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    void trackAnalyticsEvent(type, meta);
  }, [type, meta]);
  return null;
}
