# AIIMS MBBS Curriculum Spec — Gnostiri university reconstruction

Source: owner-supplied condensed transcription of the AIIMS (All India Institute of Medical
Sciences, New Delhi) MBBS syllabus ("syllabus - MBBS.pdf", transcribed 2026-10-24).
**Marks tables are OCR-unverified — validate against the original PDF before any assessment
weight is hard-coded or shown to learners.**

## 1. Programme shape

- **MBBS, 4.5 years + 1 year compulsory rotating internship**; semester system, each semester 6 months.
- **Three phases, nine semesters, three professional examinations.**

| Phase | Semesters | Subjects |
|---|---|---|
| Pre-clinical | I–II | Anatomy, Biochemistry, Physiology |
| Para-clinical | III–V | Pathology, Pharmacology, Microbiology, Forensic Medicine & Toxicology; Community Medicine begins; clinical postings begin |
| Clinical | VI–IX | Medicine & allied (Psychiatry, Dermatology), Surgery & allied (Orthopaedics, Anaesthesiology), Obstetrics & Gynaecology, Paediatrics, Ophthalmology, ENT, Community Medicine |

- **Professional exams**: First Professional (end Sem II) · Second Professional (end Sem V) · Final Professional (end Sem IX).
- **Assessment principle**: internal assessment carries 50% weightage in theory and in practical/clinical; theory and practical are passed SEPARATELY. End-posting assessments, logbooks, OSCE/OSPE are mandatory components.

## 2. Subject map — current Gnostiri spine vs AIIMS requirement

| AIIMS subject | Phase / semesters | Gnostiri course (slug) | Status |
|---|---|---|---|
| Anatomy | I–II | gross-anatomy-i (ANAT 101) | built |
| Biochemistry | I–II | medical-biochemistry-i (BCHM 101) | built |
| Physiology | I–II | physiology-cell-and-general (PHYS 101) | built |
| Pathology | III–V | pathology-cell-injury-repair (PATH 201) | built, thin (6 items) |
| Pharmacology | III–V | pharmacology-foundations (PHRM 202) | built, thin (6 items) |
| Internal Medicine | III–IX | internal-medicine-foundations (MED 301) | built, 26 items |
| Surgery | III–IX | surgery-principles (SURG 301) | built, thin (6 items) |
| Obstetrics & Gynaecology | IV–VIII | obstetrics-gynaecology (OBGY 302) | built, thin (6 items) |
| Paediatrics | IV–VIII | paediatrics-child-health (PEDS 302) | built, thin (6 items) |
| **Microbiology** | III–V | — | MISSING → spine seeded (allied-specialities.ts) |
| **Community Medicine** | III–VIII + rural | — | MISSING → spine seeded |
| **Forensic Medicine & Toxicology** | II, IV, V | — | MISSING → spine seeded |
| **Psychiatry** | II, VI | — | MISSING → spine seeded |
| **Dermatology & Venereology** | III, VI–VIII | — | MISSING → spine seeded |
| **Anaesthesiology** | VII (2 wks) | — | MISSING → spine seeded |
| **Ophthalmology** | V, VI, VIII | — | MISSING → spine seeded |
| **Orthopaedics** | III orientation + VII | — | MISSING → spine seeded |
| **Otorhinolaryngology (ENT)** | VI, VIII | — | MISSING → spine seeded |

Support courses outside the AIIMS medical spine: introduction-to-programming, applied-statistics
(data-foundations + academic-writing are stubs — retire or build).

## 3. Postings & internship

- Clinical postings begin in the para-clinical phase (wards/OPDs); rotation includes community
  medicine urban posting (8 wks, Sem IV–V), rural posting (6 wks, Sem VII), casualty/OT/labour room.
- **Compulsory rotating internship (12 months)**: Medicine 1½ mo · Surgery 1½ mo · Rural 3 mo ·
  Paediatrics 1 mo · Obstetrics & Gynaecology 1 mo · Casualty 1 mo · Anaesthesiology 15 days ·
  Ophthalmology 15 days · Elective 2 mo. Interns keep a diary/logbook of tasks and cases.

## 4. Skills layer (per syllabus)

Airway, bag-mask ventilation, IV access, CPR on mannequin, lumbar puncture, infiltration/nerve
blocks; normal delivery, episiotomy, Pap smear, IUCD insertion; splints/traction/plaster, reduction;
dressing, debridement, suturing/knot tying, catheter/NG insertion; visual acuity, tonometry,
ophthalmoscopy. These map onto the SkillStation model (currently empty) as OSCE stations.

## 5. Build order

1. Spine-complete all 15 subjects (this round seeds the 9 missing spines).
2. Depth pass: items to the ~26-item house standard on thin courses (PATH, PHRM, SURG, OBGY,
   PEDS), then authored lessons for the new subjects' high-yield modules.
3. Professional-exam / posting / internship layer (schema: exam boundaries, posting schedules,
   OSCE stations on SkillStation, internship blocks).
4. Visual/professional UX pass (course shell, lesson reader, exam hall).
5. Human review queue before anything is marked verified.
