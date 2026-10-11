import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Computing & ICT Topic 3: Computer Systems at the no-exceptions bar:
// hardware and the fetch-execute cycle, memory hierarchy, operating systems,
// networks, cybersecurity, data representation.

const SYS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The machine in layers — hardware, OS, applications" },
  { type: "definition", term: "Layer model", text: "HARDWARE (physical circuits) → OPERATING SYSTEM (manages the hardware) → APPLICATIONS (do the user's work) → USER. Each layer serves the one above and hides the one below: a word processor writes files without knowing which sectors on which disk they land on. 'Explain the role of the OS' = the manager between hardware and applications — never 'runs programs' alone." },
  { type: "example", text: "Worked: you save a document (application) → the OS decides where on disk it goes and updates the file table → the disk hardware stores the bits. Three layers, one save. Name what each layer CONTRIBUTES — that decomposition is the mark." },
  { type: "heading", level: 2, text: "2. The CPU — fetch, decode, execute" },
  { type: "definition", term: "CPU", text: "The processor runs the CYCLE millions of times a second: FETCH the next instruction from memory (address held in the PROGRAM COUNTER), DECODE it in the CONTROL UNIT, EXECUTE it (arithmetic in the ALU, results in REGISTERS), then advance. Key parts: ALU (arithmetic/logic), CONTROL UNIT (orchestrates), REGISTERS (tiny ultra-fast storage), CLOCK (synchronises the cycle), CACHE (keeps likely-needed data close)." },
  { type: "example", text: "Worked: ADD R1, R2 — fetch the instruction at the program counter's address, decode 'add registers', execute in the ALU, result into a register, program counter advances to the next instruction. The exam traces this cycle by naming the parts in order — fetch, decode, execute — and matching each part to its job." },
  { type: "heading", level: 2, text: "3. Memory — RAM, ROM, and the hierarchy" },
  { type: "definition", term: "Memory hierarchy", text: "Speed and cost rise together: REGISTERS (bytes, fastest) → CACHE (kilobytes–megabytes) → RAM (gigabytes, volatile — loses contents at power-off) → SSD/HDD (terabytes, persistent). ROM is read-only and NON-volatile — it holds the boot firmware. The hierarchy exists because fast memory is expensive: the cache keeps HOT data close, RAM holds the working set, disk holds everything." },
  { type: "diagram", diagramId: "memory-hierarchy", caption: "Registers, cache, RAM, storage — speed and cost rise as capacity falls" },
  { type: "example", text: "Worked: opening an app loads it from SSD into RAM; the parts running RIGHT NOW sit in cache/registers. Power cut: RAM empties (volatile), the SSD copy survives (persistent). 'Why does more RAM help?' — the working set fits without slow disk swapping. Match the tier to the role." },
  { type: "heading", level: 2, text: "4. The operating system — the four managers" },
  { type: "table", headers: ["OS role", "What it manages", "Exam example"], rows: [["Process management", "Which program runs, for how long (scheduling, multitasking)", "Music playing while you browse — time slices"], ["Memory management", "Allocating RAM, swapping to disk when full", "Too many tabs → swapping slows everything"], ["File system", "Organising data into files/folders, permissions", "Save, rename, delete — all OS work"], ["I/O + UI", "Devices (keyboard, disk, network) and the interface", "One API for every printer model"]] },
  { type: "paragraph", text: "The OS also handles SECURITY (users, permissions) and provides the platform applications target. The exam's trap: 'the OS executes programs' — no: the CPU executes; the OS SCHEDULES, ALLOCATES and MEDIATES. Name the manager role for the scenario given." },
  { type: "heading", level: 2, text: "5. Networks — LANs, WANs and the protocols" },
  { type: "definition", term: "Network", text: "LAN: small area, owned locally (school, office — high speed). WAN: wide area, linked across locations (the Internet is the WAN of WANs). TOPOLOGIES: star (all nodes to a central switch — one cable fails, one node; hub fails, everything), bus (one backbone — cheap, one break kills all), mesh (redundant links — resilient, costly). PROTOCOLS: TCP/IP (addressing + reliable delivery), HTTP/HTTPS (web — the S is TLS encryption), DNS (names to IP addresses), DHCP (automatic IP assignment)." },
  { type: "example", text: "Worked: typing gnostiri.vercel.app — DNS resolves the name to an IP, TCP opens a reliable connection, HTTPS encrypts it, the server responds. 'Why does the school Wi-Fi use a star topology?' — one switch, easy to extend, single point of failure named honestly. Match protocol to function — DNS is the phonebook, never the transport." },
  { type: "heading", level: 2, text: "6. Cybersecurity — the CIA triad and the defences" },
  { type: "table", headers: ["Principle", "Meaning", "Threat to it", "Defence"], rows: [["Confidentiality", "Only authorised eyes", "Eavesdropping, data theft", "Encryption, access control"], ["Integrity", "Data unchanged by accident or malice", "Tampering, corruption", "Hashes, checksums, permissions"], ["Availability", "Service up when needed", "DDoS, ransomware, outages", "Backups, redundancy, updates"]] },
  { type: "paragraph", text: "Threats: MALWARE families (virus attaches to files, worm self-spreads, trojan disguises as useful, ransomware encrypts for payment), PHISHING (fake messages harvesting credentials), man-in-the-middle (intercepted traffic). Defences in depth: strong unique passwords, two-factor authentication, encryption at rest and in transit, firewalls, timely updates, tested backups — and USERS trained, because phishing attacks people, not code." },
  { type: "example", text: "Worked: an email from 'the IT department' asking for your password — phishing: it attacks TRUST, so the defence is verification and training, not antivirus. Ransomware encrypts the disk — the defence that always works is an OFFLINE backup: restore, never pay. Match threat → defence; the CIA label is the mark." },
  { type: "heading", level: 2, text: "7. Data representation — bits, bytes, binary" },
  { type: "definition", term: "Binary", text: "Computers store everything as BITS (0/1). 8 bits = 1 byte; 1024 bytes = 1 KB (binary prefixes). A byte encodes 256 values: text via ASCII/Unicode (one code per character), numbers in base 2 (128 64 32 16 8 4 2 1 place values), images as pixel grids, sound as samples. Conversions: 1011₂ = 8+0+2+1 = 11; 13 = 1101₂. Hex (base 16) shortens binary for humans: one hex digit = 4 bits." },
  { type: "example", text: "Worked: 1101₂ → 8 + 4 + 0 + 1 = 13. Convert 25 → 11001₂ (16+8+1). The place-value table is the method — write it, fill it, read it. Character encoding question: 'A' is 65 in ASCII, stored as 01000001. Show the working; the answer alone earns half." },
  { type: "heading", level: 2, text: "8. Summary — the computer systems spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["CPU cycle", "Fetch → decode → execute, parts named", "Program counter holds the ADDRESS, not the data"], ["Memory", "Tier × volatility × role", "RAM volatile, ROM/SSD persistent"], ["OS role", "Name the manager for the scenario", "The CPU executes; the OS schedules"], ["Networks", "Topology + protocol matched to function", "DNS resolves names; it does not carry traffic"], ["Security", "CIA label + threat + defence", "Phishing attacks people — training is the fix"], ["Binary", "Place-value table, then read", "1101₂ is 13, not 1101"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'describe' = the component and its function; 'explain why' = the trade-off (speed vs cost, resilience vs expense); 'state' = the single fact, no waffle. Systems papers pay for the ROLE of each component in the scenario — a parts list without the role earns half." },
];

const SYS_QS: Q[] = [
  { q: "The correct order of the CPU cycle is", o: ["decode, fetch, execute", "fetch, decode, execute", "execute, fetch, decode", "fetch, execute, decode"], a: "fetch, decode, execute", e: "Instruction fetched from the program counter's address, decoded, run.", d: "easy" },
  { q: "RAM differs from ROM because RAM is", o: ["permanent and read-only", "volatile — contents lost at power-off", "slower than disk", "only for the boot firmware"], a: "volatile — contents lost at power-off", e: "ROM is non-volatile read-only; SSDs persist too, RAM does not.", d: "easy" },
  { q: "Cache exists between CPU and RAM because", o: ["RAM is too small", "fast memory is expensive — keep hot data close", "disks are unreliable", "the OS requires it"], a: "fast memory is expensive — keep hot data close", e: "The hierarchy trades capacity for speed at each tier.", d: "medium" },
  { q: "Too many browser tabs slow the whole machine. Which OS role is straining?", o: ["file system", "memory management — swapping to disk", "the ALU", "DNS"], a: "memory management — swapping to disk", e: "RAM exhausted → pages swap to slow storage.", d: "medium" },
  { q: "In a star topology, failure of the central switch", o: ["affects one node only", "brings down the whole network", "is impossible", "only affects the server"], a: "brings down the whole network", e: "Every node routes through the centre — single point of failure.", d: "medium" },
  { q: "The service that translates domain names into IP addresses is", o: ["DHCP", "DNS", "TCP", "HTTP"], a: "DNS", e: "The phonebook of the Internet; DHCP assigns IPs.", d: "easy" },
  { q: "The difference between HTTP and HTTPS is", o: ["speed", "HTTPS encrypts the traffic with TLS", "the port only", "HTTPS is wireless"], a: "HTTPS encrypts the traffic with TLS", e: "Confidentiality in transit — the S is the security.", d: "easy" },
  { q: "Encrypting a stolen laptop's disk primarily protects", o: ["integrity", "confidentiality", "availability", "authenticity"], a: "confidentiality", e: "Unauthorised eyes are kept out — the C of CIA.", d: "medium" },
  { q: "The only reliable defence against ransomware that always works is", o: ["paying the ransom", "an offline, tested backup", "antivirus", "a firewall"], a: "an offline, tested backup", e: "Restore instead of pay; online backups are encrypted too.", d: "medium" },
  { q: "1101₂ in denary is", o: ["11", "13", "14", "9"], a: "13", e: "8 + 4 + 0 + 1 — the place-value table is the method.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "computer-systems" } });
    if (!topic) throw new Error("master computer-systems topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Computer Systems — Complete", content: { blocks: SYS_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < SYS_QS.length; i++) {
      const item = SYS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-compsys-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-compsys-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "compsys-rebuild", blocks: SYS_BLOCKS.length, questions: SYS_QS.length });
  } catch (e) {
    console.error("rebuild compsys failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
