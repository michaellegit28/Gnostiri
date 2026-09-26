"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CountrySelector() {
  const { user } = useAuth(); const [country, setCountry] = useState("US"); const [saved, setSaved] = useState(false);
  useEffect(() => { if (user) fetch("/api/auth/country").then((response) => response.json()).then((data) => { if (data.country) setCountry(data.country); }).catch(() => undefined); }, [user]);
  async function change(value: string) { setCountry(value); setSaved(false); if (!user) return; const response = await fetch("/api/auth/country", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ country: value }) }); setSaved(response.ok); }
  return <div className="flex items-center gap-2"><label htmlFor="country-select" className="text-xs text-slate-400">Country:</label><select id="country-select" value={country} onChange={(event) => void change(event.target.value)} className="min-h-12 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"><option value="US">United States</option><option value="GB">United Kingdom</option><option value="EU">Europe</option><option value="NG">Nigeria</option><option value="GH">Ghana</option><option value="KE">Kenya</option><option value="IN">India</option><option value="PK">Pakistan</option></select>{saved && <span className="text-xs text-emerald-400">Saved</span>}</div>;
}
