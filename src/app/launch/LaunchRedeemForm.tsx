"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

// Token redemption form — POSTs to /api/launch/redeem; on success the server
// sets the signed launch cookie and we route into the site.
export default function LaunchRedeemForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function redeem() {
    if (busy) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/launch/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not redeem token");
        return;
      }
      setSuccess(data.tier === "benefactor" ? "Welcome, benefactor! Entering Gnostiri…" : "Welcome! Entering Gnostiri…");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 900);
    } catch {
      setError("Could not redeem token — check your connection");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-slate-400" htmlFor="launch-token">
        Your launch token
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="launch-token"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="GN-XXXX-XXXX-XXXX"
          className="min-h-12 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 font-mono tracking-widest"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => void redeem()}
          disabled={busy || code.trim().length < 8}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold px-6 font-semibold text-slate-950 hover:bg-gold-hover disabled:opacity-50"
        >
          {busy ? "Redeeming…" : "Redeem"}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> {success}
        </p>
      )}
    </div>
  );
}
