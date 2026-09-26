"use client";
export default function PrintCertificateButton() { return <button className="mt-10 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white print:hidden" onClick={() => window.print()}>Print / download as PDF</button>; }
