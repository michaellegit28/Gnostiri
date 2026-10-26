import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

export const ORTHOPAEDICS: SubjectSeed = {
  id: "mbbs-orthopaedics",
  slug: "orthopaedics",
  title: "Orthopaedics",
  code: "ORTH 307",
  department: "Orthopaedics",
  level: 300,
  credits: 2,
  semester: "second",
  description:
    "The musculoskeletal system: fractures and dislocations, healing and complications, regional injuries, congenital and infectious conditions, bone tumours, spinal deformity, and the skills of splinting, traction and reduction (AIIMS orientation in semester III, three weeks in semester VII).",
  faculty: "clinical-medicine",
  prereqCourses: ["gross-anatomy-i"],
  modules: [
    { slug: "general-principles", title: "M1 — General principles of injury" },
    { slug: "regional-injuries", title: "M2 — Regional injuries & amputations" },
    { slug: "paediatric-infection", title: "M3 — Congenital, infectious & neurological" },
    { slug: "non-traumatic-disease", title: "M4 — Tumours, deformity & rehabilitation" },
  ],
  lessons: [
    { title: "Fractures & dislocations", module: 1, estimatedMinutes: 45, authored: false, concept: { title: "Fractures and dislocations", slug: "fractures-dislocations", summary: "Fracture patterns, descriptors, closed versus open injury, displacement, and the principles of reduction, immobilisation and rehabilitation.", blooms: "apply", minutes: 45, prereq: [] }, content: PLACEHOLDER },
    { title: "Fracture healing & complications", module: 1, estimatedMinutes: 40, authored: false, concept: { title: "Fracture healing and complications", slug: "fracture-healing-complications", summary: "Primary and secondary healing, non-union, malunion, delayed union, compartment syndrome, fat embolism and other systemic complications.", blooms: "analyze", minutes: 40, prereq: ["fractures-dislocations"] }, content: PLACEHOLDER },
    { title: "Upper limb injuries", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Upper limb injuries", slug: "upper-limb-injuries", summary: "Clavicle, humerus, elbow, forearm, wrist and hand injuries — Colles', supracondylar and scaphoid — their mechanisms and pitfalls.", blooms: "analyze", minutes: 45, prereq: ["fracture-healing-complications"] }, content: PLACEHOLDER },
    { title: "Lower limb & knee injuries", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Lower limb and knee injuries", slug: "lower-limb-injuries", summary: "Hip, femoral shaft, tibial, ankle and foot injuries; knee ligament and meniscal injury, and the assessment of the acutely injured joint.", blooms: "analyze", minutes: 45, prereq: ["upper-limb-injuries"] }, content: PLACEHOLDER },
    { title: "Amputations", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Amputations", slug: "amputations", summary: "Indications, levels and techniques, stump care and complications, and prosthetic fitting after limb loss.", blooms: "apply", minutes: 35, prereq: ["lower-limb-injuries"] }, content: PLACEHOLDER },
    { title: "Congenital malformations", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Congenital malformations", slug: "congenital-malformations", summary: "CTEV, developmental dysplasia of the hip, congenital muscular torticollis and limb anomalies — detection, screening and early management.", blooms: "apply", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Osteomyelitis & septic arthritis", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Osteomyelitis and septic arthritis", slug: "osteomyelitis-septic-arthritis", summary: "Acute and chronic haematogenous osteomyelitis, Brodie's abscess and septic arthritis — presentation, investigation and drainage.", blooms: "analyze", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "TB spine & poliomyelitis", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Tuberculosis of spine and poliomyelitis", slug: "tuberculosis-spine-poliomyelitis", summary: "Spinal tuberculosis and paraplegia, Pott's spine management, and the residual deformities and orthotic management of poliomyelitis.", blooms: "analyze", minutes: 35, prereq: ["osteomyelitis-septic-arthritis"] }, content: PLACEHOLDER },
    { title: "Bone tumours", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Bone tumours", slug: "bone-tumours", summary: "Benign and malignant primary tumours, metastases, myeloma and the red flags that separate tumour from infection or injury.", blooms: "analyze", minutes: 40, prereq: [] }, content: PLACEHOLDER },
    { title: "Spinal deformity", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Spinal deformity", slug: "spine-deformities", summary: "Scoliosis, kyphosis and spondylolisthesis — assessment, bracing, surgical indications and back-pain differentials.", blooms: "analyze", minutes: 35, prereq: ["bone-tumours"] }, content: PLACEHOLDER },
    { title: "Rehabilitation, prosthetics & radiology", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Rehabilitation, prosthetics and radiology", slug: "rehabilitation-prosthetics-orthotics", summary: "Physiotherapy principles, orthoses and prostheses, walking aids, and the plain-film and advanced imaging of musculoskeletal disease.", blooms: "apply", minutes: 40, prereq: ["spine-deformities"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedOrthopaedics(): Promise<void> {
  const counts = await seedMbbsCourse(ORTHOPAEDICS);
  console.log(`✓ ${ORTHOPAEDICS.code} ${ORTHOPAEDICS.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && process.argv[1].includes("seed-assessment-orthopaedics")) {
  seedOrthopaedics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
