"use client";

export default function CsvImporter() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const ta = (e.target as HTMLFormElement).querySelector("textarea");
        const csv = ta?.value || "";
        const res = await fetch("/api/admin/alignments/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ csv }) });
        const data = await res.json();
        alert(res.ok ? `Imported ${data.created}/${data.total}` : `Failed: ${data.error}`);
        if (res.ok) window.location.reload();
      }}
      className="space-y-2"
    >
      <textarea aria-label="CSV input" rows={5} placeholder="topic_slug,board_name,track_name,tier,weight_notes&#10;thermodynamics,AQA A-Level,,core,Cambridge 9702 Sec III" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono" />
      <button className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-semibold text-sm" type="submit">Import CSV</button>
    </form>
  );
}
