"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface Track { id: string; name: string }
interface Board { id: string; name: string; tracks: Track[] }
interface Region { id: string; name: string; isoCode: string; rtl: boolean; boards: Board[] }

interface AlignmentResp {
  tier: "core" | "elective" | "excluded";
  pending?: boolean;
  verifiedDate?: string | null;
  weightNotes?: string | null;
  board?: { name: string; region?: string; syllabusUrl?: string | null; year?: number | null };
}

const LS_KEY = "gnostiri-alignment-profile";

function badgeClass(tier: string) {
  if (tier === "core") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (tier === "elective") return "bg-amber-50 text-amber-800 border border-amber-300";
  return "bg-red-50 text-red-700 border border-red-200 opacity-75";
}

function badgeLabel(tier: string, pending?: boolean) {
  if (pending) return "ELECTIVE — pending verification";
  if (tier === "core") return "CORE SYLLABUS";
  if (tier === "elective") return "ELECTIVE / TRACK-DEPENDENT";
  return "NOT IN SYLLABUS";
}

/**
 * <CurriculumAlignmentWidget /> — top-right of every topic page (wired in Phase 5).
 * Progressive disclosure: Country → Board (only if >1) → Track (only if board has tracks) → badge.
 * Persistence: localStorage always; "Save my profile" POSTs country to /api/auth/country (best-effort).
 */
export default function CurriculumAlignmentWidget({ topicSlug, lite = false }: { topicSlug: string; lite?: boolean }) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionId, setRegionId] = useState("");
  const [boardId, setBoardId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [data, setData] = useState<AlignmentResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  const region = useMemo(() => regions.find((r) => r.id === regionId) || null, [regions, regionId]);
  const board = useMemo(() => region?.boards.find((b) => b.id === boardId) || null, [region, boardId]);
  const rtl = !!region?.rtl;

  // Load regions + restore profile
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/regions", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        const list: Region[] = json.regions || [];
        setRegions(list);
        // Restore localStorage first (returning visitors pre-filled)
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) {
            const p = JSON.parse(raw);
            if (p.regionId && list.some((r) => r.id === p.regionId)) {
              setRegionId(p.regionId);
              const reg = list.find((r) => r.id === p.regionId)!;
              if (p.boardId && reg.boards.some((b) => b.id === p.boardId)) setBoardId(p.boardId);
              if (p.trackId) setTrackId(p.trackId);
              return;
            }
          }
        } catch { /* ignore */ }
        // Auto-detect: saved account country → IP geolocation (best-effort, optional)
        try {
          const me = await fetch("/api/auth/country", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
          const iso: string | null = me?.country || null;
          if (iso) {
            const match = list.find((r) => r.isoCode === iso);
            if (match) { setRegionId(match.id); if (match.boards.length === 1) setBoardId(match.boards[0].id); return; }
          }
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 2500);
          const geo = await fetch("https://ipapi.co/json/", { signal: ctrl.signal }).then((r) => r.json()).catch(() => null);
          clearTimeout(t);
          if (geo?.country_code) {
            const match = list.find((r) => r.isoCode === String(geo.country_code).toUpperCase());
            if (match) { setRegionId(match.id); if (match.boards.length === 1) setBoardId(match.boards[0].id); }
          }
        } catch { /* geolocation optional */ }
      } catch { /* offline — dropdowns stay empty */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!regionId) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify({ regionId, boardId, trackId })); } catch { /* ignore */ }
  }, [regionId, boardId, trackId]);

  // Fetch alignment when board resolved
  useEffect(() => {
    if (!boardId) { setData(null); return; }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const q = new URLSearchParams({ topic: topicSlug, board: boardId, ...(trackId ? { track: trackId } : {}) });
        const res = await fetch(`/api/alignment?${q.toString()}`, { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && res.ok) setData(json);
      } catch { /* keep previous */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [topicSlug, boardId, trackId]);

  // Lite mode (?lite=1): static text summary, no heavy widgets
  if (lite) {
    return (
      <div className="text-sm text-slate-300" aria-live="polite">
        {data ? `Core syllabus topic for ${data.board?.name || board?.name || "your board"}. Verified ${data.verifiedDate ? new Date(data.verifiedDate).toISOString().slice(0, 7) : "pending"}.` : "Alignment loading…"}
      </div>
    );
  }

  const showBoard = !!region && region.boards.length > 1;
  const showTrack = !!board && board.tracks.length > 0;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="w-full md:w-72 rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2" aria-label="Curriculum alignment">
      <label className="block text-xs font-semibold text-slate-400">
        Country
        <select aria-label="Select country" value={regionId} onChange={(e) => { setRegionId(e.target.value); setBoardId(""); setTrackId(""); }} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-100">
          <option value="">Select…</option>
          {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>

      {showBoard && (
        <label className="block text-xs font-semibold text-slate-400">
          Exam board
          <select aria-label="Select exam board" value={boardId} onChange={(e) => { setBoardId(e.target.value); setTrackId(""); }} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-100">
            <option value="">Select…</option>
            {region!.boards.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
      )}

      {showTrack && (
        <label className="block text-xs font-semibold text-slate-400">
          Track / stream
          <select aria-label="Select study track" value={trackId} onChange={(e) => setTrackId(e.target.value)} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-100">
            <option value="">All tracks</option>
            {board!.tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
      )}

      <div aria-live="polite" className="pt-1">
        {!boardId ? (
          <p className="text-xs text-slate-500">Select your country{region && region.boards.length > 1 ? " and board" : ""} to see syllabus alignment.</p>
        ) : loading ? (
          <p className="text-xs text-slate-500">Checking syllabus…</p>
        ) : data ? (
          <div className="space-y-1.5">
            <span aria-label={badgeLabel(data.tier, data.pending)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass(data.tier)}`}>
              {data.tier === "core" ? "🟢" : data.tier === "elective" ? "🟡" : "🔴"} {badgeLabel(data.tier, data.pending)}
            </span>
            {data.verifiedDate && (
              <p className="flex items-center gap-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                <span aria-label={`Verified ${new Date(data.verifiedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}>
                  🔵 Verified {new Date(data.verifiedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </p>
            )}
            {data.board?.name && (
              <p className="text-[11px] text-slate-400">
                Verified against {data.board.name}{data.board?.year ? ` ${data.board.year} syllabus` : ""}
              </p>
            )}
            {data.board?.syllabusUrl && (
              <a href={data.board.syllabusUrl} target="_blank" rel="noreferrer" className="text-[11px] underline text-slate-400">Official syllabus PDF</a>
            )}
            {data.pending && <p className="text-[11px] text-slate-500">Unverified — defaulted to elective per safety policy. Confirm with your syllabus.</p>}
            <button
              className="text-[11px] underline text-slate-400"
              onClick={async () => {
                try {
                  await fetch("/api/auth/country", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ country: region?.isoCode }) });
                  setSaved("Profile saved");
                } catch { setSaved("Saved locally"); }
              }}
            >
              Save my profile
            </button>
            {saved && <span className="text-[11px] text-emerald-400 ml-2">{saved}</span>}
          </div>
        ) : null}
      </div>
    </div>
  );
}
