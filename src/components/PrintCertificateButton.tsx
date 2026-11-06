"use client";
export default function PrintCertificateButton() { return <button className="gn-motion mt-10 rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary print:hidden transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]" onClick={() => window.print()}>Print / download as PDF</button>; }
