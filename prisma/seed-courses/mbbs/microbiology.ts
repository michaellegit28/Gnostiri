import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const MICROBIOLOGY: SubjectSeed = {
  id: "mbbs-microbiology",
  slug: "medical-microbiology",
  title: "Medical Microbiology",
  code: "MIC 201",
  department: "Medical Microbiology",
  level: 200,
  credits: 4,
  semester: "second",
  description:
    "Bacteriology, virology, mycology and parasitology with immunology, sterilisation and hospital infection control, and the system-based infections a clinician must recognise (AIIMS para-clinical, semesters III–V).",
  faculty: "basic-medical-sciences",
  prereqCourses: ["medical-biochemistry-i", "physiology-cell-and-general"],
  modules: [
    { slug: "general-bacteriology-genetics", title: "M1 — General bacteriology & bacterial genetics" },
    { slug: "immunity-immunodiagnosis", title: "M2 — Immunity & immunodiagnosis" },
    { slug: "virology-mycology-parasitology", title: "M3 — Virology, mycology & parasitology" },
    { slug: "sterilisation-infection-control", title: "M4 — Sterilisation & hospital infection control" },
    { slug: "system-based-infections", title: "M5 — System-based infections" },
  ],
  lessons: [
    { title: "Bacterial cell structure", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Bacterial cell structure", slug: "bacterial-cell-structure", summary: "The bacterial cell wall, membrane, capsules, flagella, spores and Gram stain behaviour that classify bacteria and dictate antibiotic targets.", blooms: "understand", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Growth, nutrition & cultivation", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Bacterial growth and culture", slug: "bacterial-growth-culture", summary: "Growth curves, oxygen and nutritional requirements, culture media and colony morphology used to isolate and identify pathogens.", blooms: "understand", minutes: 35, prereq: ["bacterial-cell-structure"] }, content: PLACEHOLDER },
    { title: "Bacterial genetics & mutation", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Bacterial genetics and mutation", slug: "bacterial-genetics-mutation", summary: "Mutation, transformation, transduction, conjugation and transposons — the mechanisms behind resistance spread.", blooms: "analyze", minutes: 40, prereq: ["bacterial-growth-culture"] }, content: PLACEHOLDER },
    { title: "Antimicrobial susceptibility", module: 1, estimatedMinutes: 35, authored: false, concept: { title: "Antimicrobial susceptibility testing", slug: "antimicrobial-susceptibility", summary: "Disc diffusion, MIC determination, MIC breakpoints and resistance phenotypes that guide rational antibiotic choice.", blooms: "apply", minutes: 35, prereq: ["bacterial-genetics-mutation"] }, content: PLACEHOLDER },
    { title: "Innate immunity", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Innate immunity", slug: "innate-immunity", summary: "Barriers, phagocytes, complement, pattern-recognition receptors and inflammation as the first-line host defence.", blooms: "understand", minutes: 40, prereq: ["bacterial-cell-structure"] }, content: PLACEHOLDER },
    { title: "Humoral adaptive immunity", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Humoral adaptive immunity", slug: "adaptive-humoral-immunity", summary: "B-cell activation, antibody classes and affinities, somatic hypermutation and the serological readout of infection.", blooms: "understand", minutes: 40, prereq: ["innate-immunity"] }, content: PLACEHOLDER },
    { title: "Cell-mediated adaptive immunity", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Cell-mediated adaptive immunity", slug: "adaptive-cellular-immunity", summary: "Antigen presentation, T-cell subsets, cytotoxic responses and the delayed hypersensitivity reactions seen in tuberculosis and granulomatous disease.", blooms: "understand", minutes: 40, prereq: ["innate-immunity"] }, content: PLACEHOLDER },
    { title: "Antigen–antibody reactions", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Antigen-antibody reactions", slug: "antigen-antibody-reactions", summary: "Agglutination, precipitation, ELISA, immunofluorescence and rapid tests — the diagnostic laboratory applied to infection.", blooms: "apply", minutes: 40, prereq: ["adaptive-humoral-immunity", "adaptive-cellular-immunity"] }, content: PLACEHOLDER },
    { title: "Vaccines & immunisation", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Vaccines and immunisation", slug: "vaccines-immunisation", summary: "Live, killed, subunit and mRNA vaccines, adjuvants, cold chain and the national immunisation schedule.", blooms: "apply", minutes: 40, prereq: ["antigen-antibody-reactions"] }, content: PLACEHOLDER },
    { title: "General virology", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "General virology", slug: "general-virology", summary: "Virion structure, replication strategies, cultivation and laboratory diagnosis of viral infection.", blooms: "understand", minutes: 40, prereq: ["bacterial-cell-structure"] }, content: PLACEHOLDER },
    { title: "DNA viruses", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "DNA viruses", slug: "dna-viruses", summary: "Herpesviruses, poxviruses, adenoviruses, papillomaviruses and hepatitis B — diseases, latency and oncogenic potential.", blooms: "understand", minutes: 40, prereq: ["general-virology"] }, content: PLACEHOLDER },
    { title: "RNA viruses", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "RNA viruses", slug: "rna-viruses", summary: "Orthomyxoviruses, paramyxoviruses, arboviruses, enteroviruses, retroviruses and hepatitis C — transmission, epidemics and prevention.", blooms: "understand", minutes: 40, prereq: ["general-virology"] }, content: PLACEHOLDER },
    { title: "Medical mycology", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Medical mycology", slug: "medical-mycology", summary: "Superficial, subcutaneous and systemic mycoses, opportunistic fungi in the immunocompromised, and antifungal pharmacology basics.", blooms: "understand", minutes: 35, prereq: ["general-virology"] }, content: PLACEHOLDER },
    { title: "Protozoan parasites", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Protozoan parasites", slug: "protozoan-parasites", summary: "Plasmodium, Entamoeba, Leishmania, Giardia, Toxoplasma and Trichomonas — life cycles, vectors, disease and diagnosis.", blooms: "understand", minutes: 40, prereq: ["general-virology"] }, content: PLACEHOLDER },
    { title: "Helminth parasites", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Helminth parasites", slug: "helminth-parasites", summary: "Nematodes, cestodes and trematodes including hydatid disease and filariasis — transmission, pathology and community control.", blooms: "understand", minutes: 40, prereq: ["protozoan-parasites"] }, content: PLACEHOLDER },
    { title: "Sterilisation & disinfection", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Sterilisation and disinfection", slug: "sterilisation-disinfection", summary: "Autoclaving, chemical disinfectants, antiseptics and sterility testing that keep instruments and wards safe.", blooms: "apply", minutes: 35, prereq: ["bacterial-cell-structure"] }, content: PLACEHOLDER },
    { title: "Hospital-acquired infection", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Hospital-acquired infection", slug: "hospital-acquired-infection", summary: "Sources, transmission routes, outbreak investigation, device-associated infection and bundle prevention in hospitals.", blooms: "analyze", minutes: 35, prereq: ["sterilisation-disinfection"] }, content: PLACEHOLDER },
    { title: "Biomedical waste management", module: 4, estimatedMinutes: 25, authored: false, concept: { title: "Biomedical waste management", slug: "biomedical-waste", summary: "Segregation, colour-coding, treatment and disposal of biomedical waste under standard practice and regulation.", blooms: "apply", minutes: 25, prereq: ["hospital-acquired-infection"] }, content: PLACEHOLDER },
    { title: "Respiratory & systemic infections", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Respiratory and systemic infections", slug: "respiratory-infections", summary: "Streptococcal and staphylococcal disease, tuberculosis, pertussis, diphtheria, pneumonia and PUO as systemic presentations.", blooms: "analyze", minutes: 45, prereq: ["antigen-antibody-reactions"] }, content: PLACEHOLDER },
    { title: "Gastrointestinal & hepatic infections", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Gastrointestinal and hepatic infections", slug: "gastrointestinal-hepatic-infections", summary: "Enteric fever, cholera, dysentery, food poisoning, viral hepatitis and clostridial disease — pathogens, pathogenesis and laboratory diagnosis.", blooms: "analyze", minutes: 45, prereq: ["respiratory-infections"] }, content: PLACEHOLDER },
    { title: "Urinary, CNS & wound infections", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Urinary, CNS and wound infections", slug: "urinary-cns-infections", summary: "UTI pathogens, meningitis and encephalitis, anaerobes, tetanus, gas gangrene and surgical-site infection.", blooms: "analyze", minutes: 45, prereq: ["respiratory-infections"] }, content: PLACEHOLDER },
    { title: "STDs, HIV & congenital infection", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "STDs, HIV and congenital infections", slug: "std-hiv-congenital", summary: "Syphilis, gonorrhoea, chancroid, HIV virology and natural history, laboratory diagnosis, prevention and TORCH congenital infections.", blooms: "analyze", minutes: 45, prereq: ["rna-viruses"] }, content: PLACEHOLDER },
    { title: "Zoonoses & entomology", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Zoonoses and entomology", slug: "zoonoses-entomology", summary: "Rabies, leptospirosis, brucellosis, plague, arboviruses and the vectors and arthropods that transmit them.", blooms: "understand", minutes: 35, prereq: ["protozoan-parasites", "helminth-parasites"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedMicrobiology(): Promise<void> {
  const counts = await seedMbbsCourse(MICROBIOLOGY);
  console.log(`✓ ${MICROBIOLOGY.code} ${MICROBIOLOGY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-microbiology")) {
  seedMicrobiology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
