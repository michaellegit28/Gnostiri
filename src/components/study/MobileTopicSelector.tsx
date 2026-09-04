"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface MobileTopicSelectorProps {
  examSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  currentTopicSlug: string;
  siblingTopics: Array<{ title: string; slug: string }>;
}

export const MobileTopicSelector: React.FC<MobileTopicSelectorProps> = ({
  examSlug,
  subjectSlug,
  subjectTitle,
  currentTopicSlug,
  siblingTopics,
}) => {
  const router = useRouter();

  return (
    <div className="lg:hidden bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
      <label htmlFor="mobile-toc" className="text-xs text-slate-400 block mb-2 font-medium">
        Jump to Topic ({subjectTitle}):
      </label>
      <select
        id="mobile-toc"
        value={currentTopicSlug}
        onChange={(e) => {
          router.push(`/highschool/${examSlug}/${subjectSlug}/${e.target.value}/study`);
        }}
        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 min-h-[48px] focus:ring-2 focus:ring-[#D4AF37]"
      >
        {siblingTopics.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  );
};
