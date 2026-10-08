import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Biology Topic 3: Genetics & Molecular Biology standard chapter
// at the no-exceptions bar with worked crosses, pedigree logic, and biotechnology.

const GEN_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. DNA structure — the double helix earned its Nobel" },
  { type: "paragraph", text: "Watson and Crick's 1953 model (built on Franklin's X-ray diffraction, Photo 51) states the facts every exam needs: two antiparallel strands (one runs 5'→3', the partner 3'→5') twist around a common axis; a sugar-phosphate backbone faces out; paired bases face in — A with T (two hydrogen bonds), C with G (three). Complementary pairing means each strand templates the other, which is precisely why the molecule can copy itself and why it stores heredity." },
  { type: "definition", term: "Semi-conservative replication", text: "Meselson and Stahl's heavy-nitrogen experiment proved each daughter double helix keeps one parental strand and one new one. Helicase unzips; DNA polymerase builds new strands 5'→3' against each template; ligase seals the lagging strand's Okazaki fragments. The leading strand copies continuously, the lagging in fragments — because polymerase only reads one way. Replication happens at the S phase of interphase, before any division." },
  { type: "callout", variant: "warning", text: "Exam trap: replication copies the WHOLE genome; transcription copies ONE gene into RNA. Confusing them collapses both marks. Also state directionality (5'→3') when asked how polymerase works — it is the detail that separates bands." },
  { type: "heading", level: 2, text: "2. Gene to protein — transcription and translation" },
  { type: "table", headers: ["Stage", "Where", "Key actors", "Product"], rows: [["Transcription", "Nucleus (eukaryotes)", "RNA polymerase reads the template strand 3'→5'", "Pre-mRNA — introns spliced out, cap and tail added, becoming mRNA"], ["Translation", "Ribosome (on RER or free)", "mRNA codons met by tRNA anticodons carrying amino acids", "Polypeptide — built N-terminus to C-terminus"]] },
  { type: "paragraph", text: "The genetic code is a triplet code read in non-overlapping codons; 64 codons for 20 amino acids makes it degenerate (several codons per amino acid — a buffer against some mutations), and universal (bacteria read human insulin mRNA — the entire biotechnology industry stands on that one fact). Start codon AUG begins every polypeptide with methionine; stop codons (UAA, UAG, UGA) end it." },
  { type: "example", text: "Worked translation: mRNA 5'-AUG GCU UAA-3' → AUG = Met (start), GCU = Ala, UAA = stop → dipeptide Met–Ala. Change the second codon's first base (GCU→UUU) and alanine becomes phenylalanine: a missense mutation. Delete one base instead and every codon after it shifts — the frameshift wrecks the whole tail of the protein." },
  { type: "heading", level: 2, text: "3. Mutations — the raw material of evolution" },
  { type: "table", headers: ["Type", "Effect", "Case study"], rows: [["Substitution (missense)", "One amino acid swapped", "Sickle-cell: GAG→GTG, Glu→Val in haemoglobin — cells sickle, block vessels, resist malaria"], ["Substitution (silent)", "Degeneracy absorbs it", "Third-base changes often harmless — why the code's redundancy exists"], ["Substitution (nonsense)", "Stop codon appears early", "Truncated protein, usually non-functional"], ["Insertion/deletion (frameshift)", "All downstream codons change", "These are the heaviest-hitting point mutations"], ["Chromosomal (nondisjunction)", "Whole chromosome mis-segregated", "Trisomy 21 (Down), X monosomy (Turner)"]] },
  { type: "paragraph", text: "Mutagens raise the rate: UV (thymine dimers), X-rays (breaks), some chemicals (base analogues). Most mutations are neutral or harmful; rare beneficial ones are the fuel of natural selection — the mutation is random, the selection is not, and examiners reward that exact distinction." },
  { type: "diagram", diagramId: "crossing-over", caption: "Where variation originates" },
  { type: "heading", level: 2, text: "4. Mendel — probability made visible" },
  { type: "definition", term: "The vocabulary", text: "Allele: version of a gene. Dominant (shown with one copy, capital letter), recessive (needs two). Genotype TT/Tt/tt; phenotype tall/dwarf. Homozygous (TT or tt), heterozygous (Tt). Test cross: unknown × homozygous recessive — any recessive offspring proves the unknown carries the allele." },
  { type: "example", text: "Monohybrid worked: Tt × Tt. Gametes T, t from each parent — the Punnett square's 4 boxes give TT, Tt, Tt, tt → genotypes 1:2:1, phenotypes 3 tall : 1 dwarf. The 3:1 is really 1:2:1 seen from outside — the mark scheme wants both ratios, labelled." },
  { type: "paragraph", text: "Dihybrid (two genes, unlinked): RrYy × RrYy → the 16-cell square collapses to 9 round-yellow : 3 round-green : 3 wrinkled-yellow : 1 wrinkled-green — 9:3:3:1, the signature of independent assortment. Deviations signal linkage (genes on one chromosome inherited together) — the differentiator answer when asked why data differ from expectation." },
  { type: "heading", level: 2, text: "5. Beyond simple dominance — the extensions" },
  { type: "table", headers: ["Pattern", "Mechanism", "Classic case"], rows: [["Incomplete dominance", "Heterozygote blends (no allele fully dominant)", "Snapdragon: RR red, Rr pink, rr white — 1:2:1 phenotype ratio"], ["Codominance", "Both alleles expressed", "ABO: IA and IB both surface antigens; MN blood groups"], ["Multiple alleles", "3+ alleles in population, 2 per individual", "ABO: IA, IB, recessive i — 6 genotypes, 4 phenotypes"], ["Sex-linkage", "Gene on X; males express one copy", "Haemophilia, red-green colour blindness — recessive X-borne"]] },
  { type: "example", text: "Sex-linkage worked: carrier mother XᴴXʰ × normal father XᴴY → daughters all unaffected (half carriers), sons half haemophiliac. Males show recessive X traits at higher rates because Y carries no masking allele — criss-cross inheritance (father→daughter→grandson) that pedigree questions reward you for naming." },
  { type: "example", text: "Pedigree probability: unaffected parents with an affected son → both must be carriers (autosomal recessive). Next child's risk = 1/4. For an X-linked recessive trait with carrier mother: each son 1/2 affected, daughters carriers at 1/2, affected daughters ~0 unless father affected. Draw the pedigree symbols (square/circle, shaded affected, half-shaded carrier) — method marks are paid for the diagram." },
  { type: "heading", level: 2, text: "6. Testing genetics — chi-squared thinking" },
  { type: "paragraph", text: "Observed offspring rarely land exactly on 3:1. The chi-squared test asks whether the deviation fits chance: χ² = Σ(observed − expected)² ÷ expected, with expected = total × ratio fraction. Degrees of freedom = categories − 1; if χ² is below the critical value (3.84 at p = 0.05 for df = 1), accept the ratio — the difference is not significant. Inheritance questions give data precisely so you can run this logic; show the expected calculation and you bank method marks even before the conclusion." },
  { type: "heading", level: 2, text: "7. Biotechnology — reading and writing the code" },
  { type: "table", headers: ["Technique", "Method", "Application"], rows: [["Recombinant insulin", "Human gene cut with restriction enzymes, spliced into plasmid, transformed into bacteria, harvested", "Type-1 diabetics get human — not pig — insulin"], ["PCR", "Cycles of heating and cooling replicate DNA exponentially", "Forensics, paternity, viral load, ancient DNA"], ["Gel electrophoresis", "Fragments sized by charge: small travel far", "DNA profiling — every individual's band pattern unique (except twins)"], ["Gene therapy", "Functional copy delivered into patient cells", "Trials for cystic fibrosis, SCID, sickle-cell"], ["CRISPR", "Guide RNA + Cas9 cuts at a chosen sequence", "Precise editing — agriculture, medicine, and a serious ethics debate"]] },
  { type: "paragraph", text: "Bt maize makes its own insecticide (yield up, spraying down) but raises escape-of-transgene and resistance-management questions; golden rice addresses vitamin A deficiency. Every 'discuss biotechnology' question demands BOTH columns — benefit with evidence, risk with named example — and a stated judgment. One-sided answers cap at half marks." },
  { type: "heading", level: 2, text: "8. Required practical — DNA extraction" },
  { type: "example", text: "Method: blend fruit (strawberry — 8n, lots of genome) → detergent + salt lyses cells and strips proteins from DNA → filter → layer cold ethanol on the extract → DNA precipitates as white threads at the interface, spoolable on a glass rod. Each step has a reason the examiner pays for: detergent disrupts membranes, salt clamps the negative phosphate charges, cold ethanol forces the insoluble DNA out of solution." },
  { type: "heading", level: 2, text: "9. Summary — inheritance patterns at a glance" },
  { type: "table", headers: ["Cross", "Phenotype ratio", "Genotype ratio"], rows: [["Tt × Tt (dominance)", "3 : 1", "1 : 2 : 1"], ["Tt × tt (test cross)", "1 : 1", "1 : 1"], ["Rr × Rr (incomplete)", "1 : 2 : 1", "1 : 2 : 1"], ["RrYy × RrYy (dihybrid)", "9 : 3 : 3 : 1", "—"]] },
  { type: "callout", variant: "info", text: "Command-word discipline: 'explain' needs because-chains (allele → protein → phenotype); 'calculate' needs working + units; 'predict' needs the Punnett square shown. Genetics papers are method-mark banks — show every step." },
];

const GEN_QS: Q[] = [
  { q: "DNA replication is semi-conservative because each daughter molecule", o: ["is entirely new", "keeps one parental strand and one new strand", "is half parental for one generation only", "mixes strands randomly"], a: "keeps one parental strand and one new strand", e: "Proved by Meselson–Stahl with heavy nitrogen.", d: "easy" },
  { q: "AUG GCU UAA translates as", o: ["Met–Ala–stop", "start–stop only", "Arg–Leu–stop", "Met only"], a: "Met–Ala–stop", e: "AUG start, GCU alanine, UAA terminates the chain.", d: "medium" },
  { q: "The genetic code is degenerate, meaning", o: ["codons overlap", "several codons encode one amino acid", "it differs between species", "one codon makes several amino acids"], a: "several codons encode one amino acid", e: "64 codons, 20 amino acids — the buffer against silent mutations.", d: "easy" },
  { q: "Sickle-cell anaemia arises from", o: ["a frameshift deletion", "a single missense substitution (Glu→Val)", "nondisjunction", "a stop codon at position 1"], a: "a single missense substitution (Glu→Val)", e: "GAG→GTG in haemoglobin's beta chain.", d: "easy" },
  { q: "Tt × Tt gives genotype and phenotype ratios", o: ["3:1 and 1:2:1", "1:2:1 and 3:1", "9:3:3:1 and 1:2:1", "1:1 and 1:1"], a: "1:2:1 and 3:1", e: "One square, two answers — label which is which.", d: "easy" },
  { q: "An unknown tall plant crossed with tt yields half tall, half dwarf offspring. The unknown is", o: ["TT", "Tt — proven by the test cross", "tt", "impossible to know"], a: "Tt — proven by the test cross", e: "Recessive offspring prove the recessive allele's presence.", d: "medium" },
  { q: "In ABO inheritance, IA i × IB i can produce which phenotypes?", o: ["A only", "A, B, AB, and O — all four", "AB only", "O only"], a: "A, B, AB, and O — all four", e: "Codominant IA/IB with recessive i: gametes give every combination.", d: "hard" },
  { q: "Haemophilia appears mostly in males because", o: ["males inherit it from fathers", "the recessive allele rides X, and Y carries no masking allele", "it is autosomal dominant", "testosterone activates it"], a: "the recessive allele rides X, and Y carries no masking allele", e: "One copy shows: criss-cross inheritance via carrier mothers.", d: "medium" },
  { q: "Observed 78 : 22 from 100 offspring against a 3:1 expectation: χ² =", o: ["0.44 — accept the ratio (below 3.84)", "4.0 — reject the ratio", "56 — huge", "1.0 — inconclusive"], a: "0.44 — accept the ratio (below 3.84)", e: "Expected 75:25; (3²/75 + 3²/25) = 0.12+0.36. Chance explains the gap.", d: "hard" },
  { q: "In the DNA extraction practical, cold ethanol is added to", o: ["lyse the membranes", "precipitate the DNA as visible white threads at the interface", "digest proteins", "amplify the DNA"], a: "precipitate the DNA as visible white threads at the interface", e: "DNA is insoluble in ethanol — the spooling step.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "genetics-molecular-biology" } });
    if (!topic) throw new Error("master genetics-molecular-biology topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("genetics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Genetics & Molecular Biology — Complete", content: { blocks: GEN_BLOCKS } as object, estimatedMinutes: 50 } });
    for (let i = 0; i < GEN_QS.length; i++) {
      const item = GEN_QS[i];
      await prisma.question.upsert({
        where: { id: `master-genetics-molecular-biology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-genetics-molecular-biology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "genetics-rebuild", blocks: GEN_BLOCKS.length, questions: GEN_QS.length });
  } catch (e) {
    console.error("rebuild genetics failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
