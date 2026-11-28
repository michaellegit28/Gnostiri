// First-sign-in feature tour copy. The app chrome stays description-free; the
// longer explanations live here and are only shown on demand.

export interface FeatureTourSlide {
  id: string;
  title: string;
  body: string;
}

export const FEATURE_TOUR_SLIDES: FeatureTourSlide[] = [
  {
    id: "lanes",
    title: "Two lanes",
    body: "University and High School stay separate. Use the lane tabs on Today, or the lane switch in the menu, to switch.",
  },
  {
    id: "study",
    title: "Study",
    body: "High School has the Gnostiri Senior Examination (GSE) and textbook study. University has courses, degrees and course exam halls.",
  },
  {
    id: "practice",
    title: "Practice",
    body: "High School uses Timed CBT and GSE papers. University uses Course exam halls with GC-(course) exam papers.",
  },
  {
    id: "shared",
    title: "Shared",
    body: "Discovery, League, Library and My Learning are available in both lanes.",
  },
  {
    id: "settings",
    title: "Settings",
    body: "Change lane, appearance, themes, accessibility and replay this tour from Settings.",
  },
];

export const FEATURE_TOUR_STORAGE_KEY = "gnostiri.feature-tour.seen";

/** Event name used by Settings to replay the tour after it has been seen. */
export const FEATURE_TOUR_OPEN_EVENT = "gnostiri:feature-tour:open";