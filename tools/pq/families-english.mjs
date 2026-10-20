/**
 * English-language families (round 2, JAMB pool).
 *
 * Rule-verified families re-derive the key from the stem itself:
 *   concord        subject number -> verb inflection
 *   question tag   auxiliary + polarity -> flipped tag
 *   article        vowel sound + specificity -> a/an/the
 *   pronoun case   grammatical slot -> pronoun class
 *   sentence type  clause/punctuation parse -> classify
 *   punctuation    the same parse catches comma splices and run-ons
 *   reported       a small backshift engine recomputes the reported clause
 *   plural/verbs   rule engines with irregular exception tables
 * Recall tables carry the dual-answer contract (key + proof copy).
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

/* ---------------------------------------------------------------- concord -- */
const CONCORD_SUBJECTS = [
  ["Each of the candidates", "sg"],
  ["Neither of the answers", "sg"],
  ["One of my friends", "sg"],
  ["Everyone in the class", "sg"],
  ["Mathematics", "sg"],
  ["The news", "sg"],
  ["Ten litres of petrol", "sg"],
  ["Bread and butter", "sg"],
  ["The list of items", "sg"],
  ["The girls", "pl"],
  ["Both of them", "pl"],
  ["Few of the students", "pl"],
  ["Many people", "pl"],
  ["The police", "pl"],
  ["Cattle", "pl"],
  ["My trousers", "pl"],
  ["The children", "pl"],
  ["Several options", "pl"],
  ["Scissors", "pl"],
  ["People", "pl"],
];

const CONCORD_VERBS = [
  { id: "have", sg: "has", pl: "have", complement: "a chance" },
  { id: "be", sg: "is", pl: "are", complement: "present" },
  { id: "do", sg: "does", pl: "do", complement: "the work" },
  { id: "go", sg: "goes", pl: "go", complement: "home" },
  { id: "want", sg: "wants", pl: "want", complement: "a share" },
  { id: "be-past", sg: "was", pl: "were", complement: "there" },
];

const VERB_FORMS = ["is", "are", "was", "were", "has", "have", "does", "do", "goes", "go", "wants", "want"];

/* ------------------------------------------------------------ question tag -- */
const TAG_ROWS = [
  { stmt: "She is here", base: "is", pos: true, subj: "she" },
  { stmt: "He is not ready", base: "is", pos: false, subj: "he" },
  { stmt: "They are late", base: "are", pos: true, subj: "they" },
  { stmt: "You can swim", base: "can", pos: true, subj: "you" },
  { stmt: "She cannot come", base: "can", pos: false, subj: "she" },
  { stmt: "We will win", base: "will", pos: true, subj: "we" },
  { stmt: "It will not rain", base: "will", pos: false, subj: "it" },
  { stmt: "He has finished", base: "has", pos: true, subj: "he" },
  { stmt: "They have left", base: "have", pos: true, subj: "they" },
  { stmt: "She did not call", base: "did", pos: false, subj: "she" },
  { stmt: "They went home", base: "did", pos: true, subj: "they" },
  { stmt: "We are ready", base: "are", pos: true, subj: "we" },
  { stmt: "You were there", base: "were", pos: true, subj: "you" },
  { stmt: "It is cheap", base: "is", pos: true, subj: "it" },
  { stmt: "The boys were playing", base: "were", pos: true, subj: "the boys" },
];

const NEG_FORMS = { is: "isn't", are: "aren't", can: "can't", will: "won't", has: "hasn't", have: "haven't", did: "didn't" };

/* ---------------------------------------------------------------- articles -- */
const ARTICLE_ROWS = [
  { text: "She ate ___ apple for breakfast.", key: "an", sound: "vowel", specific: false },
  { text: "He is ___ honest man.", key: "an", sound: "vowel", specific: false },
  { text: "My sister attends ___ university.", key: "a", sound: "consonant", specific: false },
  { text: "He bought ___ car yesterday.", key: "a", sound: "consonant", specific: false },
  { text: "___ Nile flows through Egypt.", key: "the", sound: "either", specific: true },
  { text: "___ Sun rises in the east.", key: "The", sound: "either", specific: true },
  { text: "I saw ___ dog; ___ dog was brown.", key: "a", sound: "consonant", specific: false, second: "the" },
  { text: "She adopted ___ orphan last year.", key: "an", sound: "vowel", specific: false },
  { text: "He stayed at ___ hotel near the beach.", key: "a", sound: "consonant", specific: false },
  { text: "___ old man sat under ___ oak tree.", key: "An", sound: "vowel", specific: false, second: "an" },
  { text: "They waited for ___ hour before leaving.", key: "an", sound: "vowel", specific: false },
  { text: "It was ___ European country.", key: "a", sound: "consonant", specific: false },
  { text: "He is ___ best student in the class.", key: "the", sound: "either", specific: true },
  { text: "___ Earth goes round the Sun.", key: "The", sound: "either", specific: true },
  { text: "She plays ___ piano every evening.", key: "the", sound: "either", specific: true },
  { text: "I need ___ umbrella because of the rain.", key: "an", sound: "vowel", specific: false },
];

/* ---------------------------------------------------------------- pronouns -- */
const PRONOUN_ROWS = [
  { text: "It was ___ who called the meeting.", slot: "subj", key: "I", wrong: ["me", "my", "mine"] },
  { text: "Between you and ___, there is no secret.", slot: "obj", key: "me", wrong: ["I", "my", "mine"] },
  { text: "The final decision is ___.", slot: "poss-noun", key: "yours", wrong: ["your", "you", "yourself"] },
  { text: "She is taller than ___ (I am).", slot: "subj", key: "I", wrong: ["me", "mine", "myself"] },
  { text: "Let ___ help you carry the box.", slot: "obj", key: "me", wrong: ["I", "my", "myself"] },
  { text: "The prize went to ___.", slot: "obj", key: "him", wrong: ["he", "his", "himself"] },
  { text: "This exercise book is ___.", slot: "poss-noun", key: "mine", wrong: ["my", "me", "I"] },
  { text: "Everyone except ___ knew the answer.", slot: "obj", key: "her", wrong: ["she", "hers", "herself"] },
  { text: "___ and Ibrahim are old friends.", slot: "subj", key: "He", wrong: ["Him", "His", "He's"] },
  { text: "He handed the parcel to my brother and ___.", slot: "obj", key: "me", wrong: ["I", "my", "myself"] },
  { text: "Nobody but ___ saw the accident.", slot: "subj", key: "she", wrong: ["her", "hers", "herself"] },
  { text: "The winners were Ngozi and ___.", slot: "subj", key: "I", wrong: ["me", "my", "myself"] },
  { text: "Don't blame ___ for the mistake.", slot: "obj", key: "me", wrong: ["I", "my", "mine"] },
  { text: "Their orchard is larger than ___.", slot: "poss-noun", key: "ours", wrong: ["our", "us", "we"] },
];

/* ----------------------------------------------------------- sentence types -- */
const SUBORDINATORS = ["because", "although", "when", "while", "if", "since", "that", "who", "which", "unless", "after", "before", "whereas", "as"];
const FANBOYS = ["and", "but", "or", "nor", "for", "yet", "so"];
const CONNECTIVE_ADVERBS = ["however", "therefore", "nevertheless", "moreover", "then", "thus", "consequently"];
const VERB_LEXICON = new Set([
  "kicked", "ran", "went", "was", "were", "is", "are", "has", "had", "studied", "failed", "cooked", "served", "ate", "saw",
  "conquered", "wanted", "watered", "hid", "barked", "lives", "revise", "postponed", "stopped", "stayed", "felt", "came",
  "played", "lost", "entered", "stood", "smiled", "reading", "been", "left", "won", "began", "fell", "rose",
  "cried", "picked", "boiled", "filled", "blew", "missed", "walked", "slept", "rested", "gleamed", "burned", "laughed",
  "sang", "ate", "wrote", "read", "closed", "opened", "rang", "rained",
]);

const AUXILIARIES = /\b(is|are|was|were|has|have|had|do|does|did|will|would|can|could|shall|should|may|might|must)\b/i;

/** Split a sentence into atoms on commas/semicolons, then on bare coordinating
 * conjunctions inside atoms that do not open with a subordinator. */
function atomsOf(text) {
  const raw = String(text).trim().replace(/[.!?]+$/, "");
  const atoms = [];
  const seps = [];
  let cur = "";
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "," || ch === ";") {
      const rest = raw.slice(i + 1).trim().toLowerCase();
      const fan = FANBOYS.some((f) => rest.startsWith(f + " "));
      const conn = CONNECTIVE_ADVERBS.some((c) => rest.startsWith(c + " "));
      atoms.push(cur.trim());
      seps.push({ sep: ch, fan, conn });
      cur = "";
      continue;
    }
    cur += ch;
  }
  atoms.push(cur.trim());
  const out = [];
  const outSeps = [];
  for (let idx = 0; idx < atoms.length; idx++) {
    let a = atoms[idx];
    const startsSub = SUBORDINATORS.includes(a.toLowerCase().split(/\s+/)[0]?.replace(/[^a-z]/g, "") ?? "");
    const m = a.match(/^(.*?)\s+(and|but|or|nor|for|yet|so)\s+(.+)$/i);
    if (!startsSub && m && m[1] && m[3]) {
      out.push(m[1].trim());
      outSeps.push({ sep: "fanboys", fan: true, conn: false });
      a = m[3].trim();
    }
    out.push(a);
    if (idx < seps.length) outSeps.push(seps[idx]);
  }
  return { atoms: out.filter((a) => a !== ""), seps: outSeps };
}

function atomType(atom) {
  const t = String(atom).trim();
  if (t === "") return "other";
  const first = t.toLowerCase().replace(/[^a-z']/g, " ").split(/\s+/).filter(Boolean)[0] ?? "";
  if (SUBORDINATORS.includes(first)) return "dep";
  if (/^[a-z]+ing\b/i.test(t) && !AUXILIARIES.test(t)) return "verbal";
  const words = t.toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).filter(Boolean);
  for (const w of words) if (VERB_LEXICON.has(w)) return "ind";
  for (const w of words) if (/\bed$/.test(w) && w.length > 4) return "ind";
  return "other";
}

/** A subordinator or relative pronoun appearing mid-atom embeds a dependent clause. */
function embeddedDep(atom) {
  const words = String(atom).toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
  return words.some((w, i) => i > 0 && (SUBORDINATORS.includes(w) || w === "who" || w === "which" || w === "that"));
}

function countVerbs(atom) {
  const words = String(atom).toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).filter(Boolean);
  let n = 0;
  for (const w of words) if (VERB_LEXICON.has(w) || /\bed$/.test(w)) n++;
  return n;
}

/** Genuine grammar parse: classify by clause count, clause kind and joining. */
export function classifySentence(textRaw) {
  const { atoms, seps } = atomsOf(textRaw);
  const types = atoms.map(atomType);
  let ind = 0;
  let dep = 0;
  atoms.forEach((a, i) => {
    if (types[i] === "dep") dep++;
    else if (types[i] === "ind") {
      ind++;
      if (embeddedDep(a)) dep++;
    }
  });
  const fused = atoms.some((a, i) => types[i] === "ind" && countVerbs(a) >= 2);
  if (ind === 0) return "fragment";
  if (ind === 1 && dep === 0) return fused ? "run-on" : "simple";
  if (ind === 1 && dep > 0) return "complex";
  let badJoin = fused;
  for (let i = 0; i < atoms.length - 1; i++) {
    if (types[i] !== "ind" || types[i + 1] !== "ind") continue;
    const s = seps[i];
    if (!s) {
      badJoin = true;
      continue;
    }
    if (s.sep === "fanboys" || s.sep === ";") continue;
    if (s.sep === "," && s.fan) continue;
    badJoin = true; // bare comma, or comma + conjunctive adverb
  }
  if (ind > 1 && dep === 0) return badJoin ? "run-on" : "compound";
  return "compound-complex";
}

const SENTENCE_ROWS = [
  ["The boy kicked the ball", "simple", "One independent clause only."],
  ["The dog barked loudly", "simple", "A single subject-verb statement."],
  ["Mary watered the plants", "simple", "One clause, one finite verb."],
  ["The boy kicked the ball and he ran home", "compound", "Two independent clauses joined by 'and'."],
  ["The dog barked loudly and the cat hid under the bed", "compound", "Two independent clauses joined by 'and'."],
  ["The team played well but they still lost", "compound", "Two independent clauses joined by 'but'."],
  ["The team played well; they still lost", "compound", "Two independent clauses joined by a semicolon."],
  ["Because the boy was tired, he went home", "complex", "A subordinate clause (because...) plus an independent clause."],
  ["The boy who was tired went home", "complex", "The relative clause 'who was tired' is dependent."],
  ["Although he studied hard, he failed the test", "complex", "'Although...' is a subordinate opener."],
  ["If it rains tomorrow, the match will be postponed", "complex", "'If...' makes the first clause dependent."],
  ["The students revised their notes because the exam was near", "complex", "The 'because' clause depends on the main clause."],
  ["Mary, who lives next door, kindly watered the plants", "complex", "The comma'd relative clause is dependent."],
  ["Because the boy was tired", "fragment", "No independent clause - the thought is unfinished."],
  ["Running quickly", "fragment", "A verbless phrase cannot stand as a sentence."],
  ["Washing the dishes", "fragment", "No subject and finite verb."],
  ["The boy kicked the ball, he ran home", "run-on", "Two independent clauses joined by a comma alone (comma splice)."],
  ["He wanted the job, however the pay was too low", "run-on", "'However' is a conjunctive adverb, not a coordinating conjunction."],
  ["The teacher entered, the students stood up", "run-on", "Comma splice: a comma cannot join two independent clauses."],
  ["I came, I saw, I conquered", "run-on", "Three independent clauses fused without proper joining."],
  ["She cooked, she served the food, the guests ate", "run-on", "Run-on: no conjunctions or semicolons between the clauses."],
  ["When the rain stopped, we went out, but Mary stayed in", "compound-complex", "One dependent clause plus two independent clauses."],
  ["The students revised their notes because the exam was near, and they felt ready", "compound-complex", "A 'because' clause plus two independent clauses."],
];

/* ------------------------------------------------------------- punctuation -- */
const PUNCT_ROWS = [
  { before: "The teacher entered", after: "the students stood up" },
  { before: "The team played well", after: "they still lost" },
  { before: "The rain stopped", after: "we went out" },
  { before: "She studied all night", after: "the exam was easy" },
  { before: "The market closed early", after: "the traders went home" },
  { before: "He missed the bus", after: "he walked to school" },
  { before: "The lights went out", after: "the hall fell silent" },
  { before: "The baby cried", after: "the mother picked her up" },
  { before: "The pot boiled over", after: "the kitchen filled with steam" },
  { before: "The whistle blew", after: "the players left the field" },
];

/* ------------------------------------------------------- reported speech -- */
const BACKSHIFT = {
  verb: { am: "was", is: "was", are: "were", will: "would", can: "could", have: "had", has: "had", do: "did", does: "did", was: "had been", were: "had been", shall: "should", may: "might" },
  time: { now: "then", today: "that day", tomorrow: "the next day", yesterday: "the previous day", here: "there", this: "that", tonight: "that night" },
};

const REPORT_ROWS = [
  { subject: "Tunde", gender: "male", body: "I am tired" },
  { subject: "Amina", gender: "female", body: "I will come" },
  { subject: "The team", gender: "plural", body: "We have finished" },
  { subject: "The boy", gender: "male", body: "I can swim" },
  { subject: "Chidi", gender: "male", body: "I am reading now" },
  { subject: "Kemi", gender: "female", body: "I saw him yesterday" },
  { subject: "Ada", gender: "female", body: "I live here" },
  { subject: "The man", gender: "male", body: "I do not know" },
  { subject: "Bola", gender: "female", body: "I was at home" },
  { subject: "The girls", gender: "plural", body: "We are ready" },
];

function backshift(row) {
  const pron = row.gender === "male" ? "he" : row.gender === "female" ? "she" : "they";
  let body = row.body.replace(/\bI\b/, pron);
  for (const [k, v] of Object.entries({ ...BACKSHIFT.verb, ...BACKSHIFT.time })) {
    body = body.replace(new RegExp(`\\b${k}\\b`, "g"), v);
  }
  return `${row.subject} said that ${body.charAt(0).toLowerCase()}${body.slice(1)}.`;
}

/* ---------------------------------------------------------------- plurals -- */
const PLURAL_IRREGULAR = {
  man: "men", woman: "women", child: "children", mouse: "mice", foot: "feet", tooth: "teeth", goose: "geese", ox: "oxen",
  sheep: "sheep", deer: "deer", fish: "fish", species: "species", datum: "data", cactus: "cacti", analysis: "analyses",
  knife: "knives", leaf: "leaves", life: "lives", wife: "wives", thief: "thieves", shelf: "shelves", potato: "potatoes", tomato: "tomatoes", hero: "heroes",
};

const PLURAL_NOUNS = ["boy", "doctor", "church", "tax", "lady", "city", "party", "baby", "book", "class", "box", "buzz", "match", "brush", "leaf", "knife", "wolf", "loaf", "potato", "photo", "piano", "radio", "sheep", "child", "man", "woman", "mouse", "goose", "tooth", "foot", "axis", "crisis", "phenomenon", "criterion", "scarf", "roof", "belief", "chief", "bamboo"];

function pluralize(noun) {
  if (PLURAL_IRREGULAR[noun]) return PLURAL_IRREGULAR[noun];
  if (/(s|x|ch|sh)$/.test(noun)) return `${noun}es`;
  if (/[^aeiou]y$/.test(noun)) return `${noun.slice(0, -1)}ies`;
  return `${noun}s`;
}

/* ---------------------------------------------------------- verb forms -- */
const IRREGULAR_PAST = {
  go: "went", come: "came", see: "saw", eat: "ate", take: "took", give: "gave", write: "wrote", speak: "spoke", choose: "chose",
  run: "ran", swim: "swam", begin: "began", drink: "drank", sing: "sang", sit: "sat", stand: "stood", understand: "understood",
  bring: "brought", buy: "bought", catch: "caught", teach: "taught", think: "thought", fight: "fought", seek: "sought",
  sleep: "slept", keep: "kept", leave: "left", feel: "felt", meet: "met", pay: "paid", say: "said", lay: "laid", make: "made",
  read: "read", cut: "cut", put: "put", cost: "cost", hit: "hit", let: "let", set: "set", shut: "shut", split: "split",
};

const BASE_VERBS = ["work", "play", "cry", "try", "stop", "plan", "open", "close", "use", "like", "hope", "live", "love", "move", "decide", "change", "believe", "arrive"];

function pastOf(verb) {
  if (IRREGULAR_PAST[verb]) return IRREGULAR_PAST[verb];
  if (/e$/.test(verb)) return `${verb}d`;
  if (/[^aeiou]y$/.test(verb)) return `${verb.slice(0, -1)}ied`;
  return `${verb}ed`;
}

export const families = [
  {
    id: "concord-subject-verb",
    topicSlug: "concord",
    label: "Subject-verb agreement",
    params(r) {
      const [subject, number] = pick(r, CONCORD_SUBJECTS);
      const verb = pick(r, CONCORD_VERBS);
      return { subject, number, verb };
    },
    answer: (p) => p.verb[p.number],
    stem(p) {
      return `Choose the correct option: ${p.subject} ${"______"} ${p.verb.complement}.`;
    },
    distractors(p, r) {
      const key = p.verb[p.number];
      const forms = VERB_FORMS.filter((f) => f !== key);
      const out = [];
      for (const c of shuffled(r, forms)) {
        if (out.length === 3) break;
        if (c !== key && !out.includes(c)) out.push(c);
      }
      return out;
    },
    explanation(p) {
      const rule = p.number === "sg" ? "expressions like 'each', 'neither', 'one of', 'every' and singular-sounding mass subjects take a SINGULAR verb" : "plural subjects take the base form of the verb";
      return `${p.subject} takes "${p.verb[p.number]}": ${rule}. The other choices break agreement with the subject, not with a nearby noun.`;
    },
    hint: () => "Find the true subject first, then match the verb to its number.",
    verify(p, chosen) {
      return chosen === p.verb[p.number] && (p.number === "sg" || p.number === "pl");
    },
  },
  {
    id: "question-tag",
    topicSlug: "grammar-foundations",
    label: "Question tags",
    params(r) {
      return pick(r, TAG_ROWS);
    },
    answer: (p) => `${p.pos ? NEG_FORMS[p.base] : p.base} ${p.subj}?`,
    stem(p) {
      return `Add the correct question tag: "${p.stmt}, ${"______"}"`;
    },
    distractors(p, r) {
      const key = `${p.pos ? NEG_FORMS[p.base] : p.base} ${p.subj}?`;
      const others = ["is", "are", "was", "were", "can", "will", "has", "have", "did"];
      const wrongSubj = p.subj === "she" ? "he" : p.subj === "he" ? "she" : "it";
      const pool = [
        `${p.base} ${p.subj}?`,
        `${p.pos ? NEG_FORMS[p.base] : p.base} ${wrongSubj}?`,
        ...others.map((o) => `${o} ${p.subj}?`),
      ].filter((c) => c !== key);
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (!out.includes(c)) out.push(c);
      }
      for (let e = 0; out.length < 3; e++) out.push(`${others[e % others.length]} it?`);
      return out.slice(0, 3);
    },
    explanation(p) {
      const flipped = p.pos ? NEG_FORMS[p.base] : p.base;
      return `A positive statement takes a negative tag and vice versa, reusing the auxiliary: "${flipped} ${p.subj}?". Keeping the statement's polarity, or swapping the pronoun, breaks the rule.`;
    },
    hint: () => "Positive statement -> negative tag; negative statement -> positive tag; same auxiliary.",
    verify(p, chosen) {
      const flipped = p.pos ? NEG_FORMS[p.base] : p.base;
      return chosen === `${flipped} ${p.subj}?` && p.base.length > 0;
    },
  },
  {
    id: "article-choice",
    topicSlug: "grammar-foundations",
    label: "Articles: a, an, the",
    params(r) {
      return pick(r, ARTICLE_ROWS);
    },
    answer: (p) => p.key,
    stem(p) {
      return `Fill the gap: ${p.text}`;
    },
    distractors(p, r) {
      const all = p.key === "the" || p.key === "The" ? ["a", "an", "the", "no article"] : p.sound === "vowel" ? ["a", "the", "no article"] : ["an", "the", "no article"];
      const out = [];
      for (const c of shuffled(r, all)) {
        if (out.length === 3) break;
        if (c !== p.key && !out.includes(c)) out.push(c);
      }
      return out;
    },
    explanation(p) {
      const rule = p.specific
        ? "'the' marks a specific or unique noun"
        : p.sound === "vowel"
          ? "'an' precedes a VOWEL SOUND (honest, hour, university-starting with /j/ takes 'a')"
          : "'a' precedes a consonant sound";
      return `${rule}. The h in 'honest' and 'hour' is silent, so they take 'an'; 'university' starts with a /j/ sound, so it takes 'a'.`;
    },
    hint: () => "It is the SOUND, not the letter: vowel sound -> an; consonant sound -> a.",
    verify(p, chosen) {
      const expected = p.specific ? (p.key.toLowerCase() === "the" ? p.key : "the") : p.sound === "vowel" ? "an" : "a";
      return chosen.toLowerCase() === expected.toLowerCase() && chosen === p.key;
    },
  },
  {
    id: "pronoun-case",
    topicSlug: "lexis-structure",
    label: "Pronoun case in context",
    params(r) {
      return pick(r, PRONOUN_ROWS);
    },
    answer: (p) => p.key,
    stem(p) {
      return `Choose the correct option: ${p.text}`;
    },
    distractors(p, r) {
      const out = [];
      for (const c of shuffled(r, p.wrong)) {
        if (out.length === 3) break;
        if (c !== p.key && !out.includes(c)) out.push(c);
      }
      return out;
    },
    explanation(p) {
      const cases = { subj: "SUBJECT pronoun (I, he, she, we, they)", obj: "OBJECT pronoun (me, him, her, us, them)", "poss-noun": "independent POSSESSIVE (mine, yours, his, hers, ours, theirs)" };
      return `The gap needs a ${cases[p.slot]}. "${p.key}" fits the slot; the wrong options use a different case.`;
    },
    hint: () => "Name the job of the gap: subject, object or possessive.",
    verify(p, chosen) {
      const classes = { subj: ["I", "he", "she", "we", "they", "He"], obj: ["me", "him", "her", "us", "them"], "poss-noun": ["mine", "yours", "his", "hers", "ours", "theirs"] };
      return classes[p.slot].includes(chosen) && chosen === p.key;
    },
  },
  {
    id: "sentence-type",
    topicSlug: "grammar-foundations",
    label: "Sentence structure classification",
    params(r) {
      const row = pick(r, SENTENCE_ROWS);
      return { text: row[0], key2: row[1], why: row[2] };
    },
    answer: (p) => p.key2,
    stem(p) {
      return `"${p.text}" is which type of sentence?`;
    },
    distractors(p, r) {
      const all = ["simple", "compound", "complex", "compound-complex", "fragment", "run-on"];
      const out = [];
      for (const c of shuffled(r, all)) {
        if (out.length === 3) break;
        if (c !== p.key2 && !out.includes(c)) out.push(c);
      }
      return out;
    },
    explanation(p) {
      return `${p.why} Classification is decided by the number and kind of clauses, not by length.`;
    },
    hint: () => "Count the independent clauses (subject + finite verb) and the subordinate clauses.",
    verify(p, chosen) {
      return classifySentence(p.text) === p.key2 && chosen === p.key2 && chosen !== "";
    },
  },
  {
    id: "punctuation-join",
    topicSlug: "punctuation-mechanics",
    label: "Joining independent clauses: semicolon vs comma splice",
    params(r) {
      const row = pick(r, PUNCT_ROWS);
      return {
        correct: `${row.before}; ${row.after}.`,
        splice: `${row.before}, ${row.after}.`,
        fused: `${row.before} ${row.after}.`,
        connSplice: `${row.before}, however ${row.after}.`,
      };
    },
    answer: (p) => p.correct,
    stem(p) {
      return "Which sentence is correctly punctuated?";
    },
    distractors(p, r) {
      return shuffled(r, [p.splice, p.fused, p.connSplice]).slice(0, 3);
    },
    explanation(p) {
      return `A semicolon (or a comma plus a coordinating conjunction) joins two independent clauses. A comma alone is a comma splice, no punctuation fuses the clauses, and "however" is a conjunctive adverb that cannot do the job either.`;
    },
    hint: () => "A comma alone cannot join two independent clauses.",
    verify(p, chosen) {
      if (chosen !== p.correct) return false;
      return (
        classifySentence(chosen) === "compound" &&
        classifySentence(p.splice) === "run-on" &&
        classifySentence(p.fused) === "run-on" &&
        classifySentence(p.connSplice) === "run-on"
      );
    },
  },
  {
    id: "reported-speech",
    topicSlug: "tenses-and-aspect",
    label: "Direct to reported speech",
    params(r) {
      const row = pick(r, REPORT_ROWS);
      return { ...row, reported: backshift(row) };
    },
    answer: (p) => p.reported,
    stem(p) {
      return `Report this sentence: "${p.body}," ${p.subject.split(" ").slice(-1)[0].toLowerCase()} said.`;
    },
    distractors(p, r) {
      const unshifted = `${p.subject} said that ${p.body.charAt(0).toLowerCase()}${p.body.slice(1)}.`;
      const wrongPronoun = `${p.subject} said that I${p.body.slice(1)}.`;
      const wrongTime = p.reported.replace(/\b(then|that day|the next day|the previous day|there|that)\b/, (m) => ({ then: "now", "that day": "today", "the next day": "tomorrow", "the previous day": "yesterday", there: "here", that: "this" })[m] ?? m);
      const pool = [unshifted, wrongPronoun, wrongTime];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== p.reported && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) out.push(`${p.subject} said that it${p.body.slice(1)}${e}.`);
      return out.slice(0, 3);
    },
    explanation(p) {
      return `Reported speech backshifts the tense (is -> was, will -> would, have -> had, can -> could) and moves time words (now -> then, today -> that day, tomorrow -> the next day, yesterday -> the previous day, here -> there). "${p.reported}"`;
    },
    hint: () => "Backshift the tense and push the time expressions one step away.",
    verify(p, chosen) {
      // The engine recomputes the reported form from the DIRECT text.
      return chosen === backshift(p) && chosen === p.reported;
    },
  },
  {
    id: "noun-plurals",
    topicSlug: "grammar-foundations",
    label: "Regular and irregular plurals",
    params(r) {
      const singular = pick(r, PLURAL_NOUNS);
      return { singular, plural: pluralize(singular) };
    },
    answer: (p) => p.plural,
    stem(p) {
      return `What is the plural of "${p.singular}"?`;
    },
    distractors(p, r) {
      const naive = `${p.singular}s`;
      const wrongEs = `${
        /(s|x|ch|sh)$/.test(p.singular) ? `${p.singular.slice(0, -1)}ies` : `${p.singular}es`
      }`;
      const pool = [naive, wrongEs, `${p.singular}es`, `${p.singular.slice(0, -1)}ies`, p.singular];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== p.plural && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) out.push(`${p.singular}${"s".repeat(e)}`);
      return out.slice(0, 3);
    },
    explanation(p) {
      const rule = PLURAL_IRREGULAR[p.singular]
        ? `an irregular form memorised by rule exception (${p.singular} -> ${p.plural})`
        : /(s|x|ch|sh)$/.test(p.singular)
          ? "sibilant endings add -es"
          : /[^aeiou]y$/.test(p.singular)
            ? "consonant + y -> -ies"
            : "regular nouns add -s";
      return `The plural applies ${rule}: ${p.plural}. Adding a blunt -s ignores the spelling rules.`;
    },
    hint: () => "Sibilant endings take -es; consonant + y takes -ies; check the irregular list.",
    verify(p, chosen) {
      return chosen === pluralize(p.singular) && chosen === p.plural;
    },
  },
  {
    id: "verb-past-tense",
    topicSlug: "tenses-and-aspect",
    label: "Simple past: regular and irregular verbs",
    params(r) {
      const base = pick(r, BASE_VERBS);
      return { base, past: pastOf(base) };
    },
    answer: (p) => p.past,
    stem(p) {
      return `What is the simple past tense of "${p.base}"?`;
    },
    distractors(p, r) {
      // Classic learner errors: wrong -d/-ed rule, base form left unshifted, -ing form.
      const wrongD = /e$/.test(p.base) ? `${p.base}ed` : `${p.base}d`;
      const wrongY = `${p.base}ed`;
      const pool = [wrongD, wrongY, p.base, `${p.base}ing`];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== p.past && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) out.push(`${p.base}${"d".repeat(e)}`);
      return out.slice(0, 3);
    },
    explanation(p) {
      const rule = IRREGULAR_PAST[p.base] ? `an irregular past learned by list (${p.base} -> ${p.past})` : /e$/.test(p.base) ? "final -e takes -d only" : /[^aeiou]y$/.test(p.base) ? "consonant + y -> -ied" : "regular verbs add -ed";
      return `The simple past uses ${rule}: ${p.past}. Doubling letters or adding -d to an -e ending are the usual slips.`;
    },
    hint: () => "Irregular verbs have their own past forms; regular ones add -ed.",
    verify(p, chosen) {
      return chosen === pastOf(p.base) && chosen === p.past;
    },
  },
  recallFamily({
    id: "synonyms-nearest",
    topicSlug: "lexis-structure",
    label: "Nearest in meaning",
    hint: "Choose the option closest in meaning to the word in capitals.",
    rows: [
      ["Choose the option NEAREST in meaning to: ABBREVIATE", "shorten", ["lengthen", "explain", "translate"], "To abbreviate is to shorten; lengthen is its antonym.", "shorten"],
      ["Choose the option NEAREST in meaning to: BENEVOLENT", "kind", ["hostile", "wealthy", "careless"], "Benevolent means kindly and generous — 'kind' is nearest.", "kind"],
      ["Choose the option NEAREST in meaning to: CANDID", "frank", ["secretive", "clever", "rude"], "Candid means openly honest; frank matches.", "frank"],
      ["Choose the option NEAREST in meaning to: DILIGENT", "hardworking", ["lazy", "sloppy", "famous"], "Diligent means careful and industrious.", "hardworking"],
      ["Choose the option NEAREST in meaning to: EPHEMERAL", "short-lived", ["eternal", "colourful", "heavy"], "Ephemeral means lasting a very short time.", "short-lived"],
      ["Choose the option NEAREST in meaning to: FRUGAL", "thrifty", ["wasteful", "hungry", "stingy to others"], "Frugal means economical with resources.", "thrifty"],
      ["Choose the option NEAREST in meaning to: GREGARIOUS", "sociable", ["solitary", "gloomy", "aggressive"], "Gregarious people enjoy company.", "sociable"],
      ["Choose the option NEAREST in meaning to: IMPARTIAL", "fair", ["biased", "rude", "curious"], "Impartial means treating all sides equally.", "fair"],
      ["Choose the option NEAREST in meaning to: LUCID", "clear", ["vague", "muddy", "loud"], "Lucid writing is easy to understand.", "clear"],
      ["Choose the option NEAREST in meaning to: MAGNANIMOUS", "generous", ["petty", "cruel", "timid"], "Magnanimous means generous in spirit.", "generous"],
      ["Choose the option NEAREST in meaning to: OBNOXIOUS", "offensive", ["pleasant", "gentle", "obedient"], "Obnoxious means unpleasant or objectionable.", "offensive"],
      ["Choose the option NEAREST in meaning to: PRUDENT", "cautious", ["reckless", "hasty", "vain"], "Prudent means showing care and foresight.", "cautious"],
      ["Choose the option NEAREST in meaning to: RELUCTANT", "unwilling", ["eager", "cheerful", "able"], "Reluctant means hesitant or unwilling.", "unwilling"],
      ["Choose the option NEAREST in meaning to: TACITURN", "quiet", ["talkative", "cheerful", "angry"], "Taciturn means saying very little.", "quiet"],
      ["Choose the option NEAREST in meaning to: VERBOSE", "wordy", ["brief", "silent", "sharp"], "Verbose means using too many words.", "wordy"],
      ["Choose the option NEAREST in meaning to: ZEALOUS", "enthusiastic", ["indifferent", "hostile", "lazy"], "Zealous means full of eager commitment.", "enthusiastic"],
      ["Choose the option NEAREST in meaning to: ADVERSE", "unfavourable", ["helpful", "hidden", "sudden"], "Adverse conditions are harmful or unfavourable.", "unfavourable"],
      ["Choose the option NEAREST in meaning to: COGENT", "convincing", ["weak", "confusing", "harsh"], "Cogent reasoning is clear and convincing.", "convincing"],
      ["Choose the option NEAREST in meaning to: DEBRIS", "ruins and remains", ["treasure", "furniture", "debts"], "Debris is scattered wreckage.", "ruins and remains"],
      ["Choose the option NEAREST in meaning to: EXONERATE", "clear of blame", ["accuse", "punish", "delay"], "To exonerate is to free from blame.", "clear of blame"],
      ["Choose the option NEAREST in meaning to: FICTITIOUS", "imaginary", ["truthful", "factual", "friendly"], "Fictitious means invented, not real.", "imaginary"],
      ["Choose the option NEAREST in meaning to: HEIGHTEN", "increase", ["lower", "measure", "hide"], "To heighten is to raise or intensify.", "increase"],
      ["Choose the option NEAREST in meaning to: IMMUNISE", "protect", ["expose", "infect", "isolate"], "Immunisation protects against disease.", "protect"],
      ["Choose the option NEAREST in meaning to: JEOPARDISE", "endanger", ["protect", "guarantee", "ignore"], "To jeopardise is to put at risk.", "endanger"],
      ["Choose the option NEAREST in meaning to: LENIENT", "merciful", ["harsh", "strict", "cruel"], "Lenient means tolerant and merciful.", "merciful"],
      ["Choose the option NEAREST in meaning to: MUNDANE", "ordinary", ["exciting", "heavenly", "ancient"], "Mundane means dull and routine.", "ordinary"],
      ["Choose the option NEAREST in meaning to: NOTORIOUS", "infamous", ["famous for good", "unknown", "curious"], "Notorious means famous for something bad.", "infamous"],
      ["Choose the option NEAREST in meaning to: OBSTINATE", "stubborn", ["flexible", "obedient", "gentle"], "Obstinate means refusing to change.", "stubborn"],
      ["Choose the option NEAREST in meaning to: PERPETUAL", "endless", ["brief", "fragile", "gradual"], "Perpetual means never ending.", "endless"],
      ["Choose the option NEAREST in meaning to: RAVISHING", "beautiful", ["ugly", "common", "angry"], "Ravishing means delightfully attractive.", "beautiful"],
    ],
  }),
  recallFamily({
    id: "antonyms-opposite",
    topicSlug: "lexis-structure",
    label: "Opposite in meaning",
    hint: "Choose the option OPPOSITE in meaning to the word in capitals.",
    rows: [
      ["Choose the option OPPOSITE in meaning to: ARROGANT", "humble", ["proud", "vain", "showy"], "Arrogant is the opposite of humble.", "humble"],
      ["Choose the option OPPOSITE in meaning to: BENEFIT", "harm", ["profit", "gain", "help"], "A benefit is a gain; harm is its opposite.", "harm"],
      ["Choose the option OPPOSITE in meaning to: CIVILISED", "barbaric", ["polite", "cultured", "modern"], "Barbaric is the opposite of civilised.", "barbaric"],
      ["Choose the option OPPOSITE in meaning to: DEFICIT", "surplus", ["loss", "debt", "shortage"], "A deficit is the opposite of a surplus.", "surplus"],
      ["Choose the option OPPOSITE in meaning to: EXTERIOR", "interior", ["outer", "surface", "edge"], "Exterior faces outside; interior faces inside.", "interior"],
      ["Choose the option OPPOSITE in meaning to: FRAGILE", "sturdy", ["delicate", "brittle", "flimsy"], "Fragile things break easily; sturdy ones do not.", "sturdy"],
      ["Choose the option OPPOSITE in meaning to: GENEROUS", "stingy", ["kind", "giving", "liberal"], "Stingy is the opposite of generous.", "stingy"],
      ["Choose the option OPPOSITE in meaning to: HAUGHTY", "modest", ["proud", "distant", "rude"], "Haughty behaviour is the opposite of modesty.", "modest"],
      ["Choose the option OPPOSITE in meaning to: INDIGENOUS", "foreign", ["native", "local", "original"], "Indigenous means native; foreign is the opposite.", "foreign"],
      ["Choose the option OPPOSITE in meaning to: LAUDABLE", "shameful", ["praiseworthy", "noble", "worthy"], "Laudable deeds deserve praise; shameful ones do not.", "shameful"],
      ["Choose the option OPPOSITE in meaning to: MELANCHOLY", "joyful", ["gloomy", "sad", "quiet"], "Melancholy is deep sadness; joy is its opposite.", "joyful"],
      ["Choose the option OPPOSITE in meaning to: NEGLIGENT", "careful", ["careless", "sloppy", "lazy"], "Careful is the opposite of negligent.", "careful"],
      ["Choose the option OPPOSITE in meaning to: OBSCURE", "clear", ["hidden", "dark", "unclear"], "Obscure means unclear or hidden; clear is the opposite.", "clear"],
      ["Choose the option OPPOSITE in meaning to: PERMANENT", "temporary", ["lasting", "enduring", "fixed"], "Temporary is the opposite of permanent.", "temporary"],
      ["Choose the option OPPOSITE in meaning to: REJECT", "accept", ["refuse", "decline", "deny"], "Accept is the opposite of reject.", "accept"],
      ["Choose the option OPPOSITE in meaning to: SCARCE", "plentiful", ["rare", "few", "insufficient"], "Plentiful is the opposite of scarce.", "plentiful"],
      ["Choose the option OPPOSITE in meaning to: TRANSIENT", "lasting", ["brief", "momentary", "fading"], "Transient means passing quickly; lasting is the opposite.", "lasting"],
      ["Choose the option OPPOSITE in meaning to: URBAN", "rural", ["city", "civic", "metro"], "Rural (countryside) is the opposite of urban.", "rural"],
      ["Choose the option OPPOSITE in meaning to: VIRTUE", "vice", ["goodness", "morality", "merit"], "Vice is the opposite of virtue.", "vice"],
      ["Choose the option OPPOSITE in meaning to: WITHDRAW", "deposit", ["remove", "retreat", "retract"], "Depositing is the opposite of withdrawing money.", "deposit"],
      ["Choose the option OPPOSITE in meaning to: ADVANCE", "retreat", ["progress", "proceed", "improve"], "Retreat is the opposite of advance.", "retreat"],
      ["Choose the option OPPOSITE in meaning to: BRUTAL", "gentle", ["cruel", "savage", "violent"], "Gentle is the opposite of brutal.", "gentle"],
      ["Choose the option OPPOSITE in meaning to: CLOUDY", "clear", ["overcast", "gloomy", "dull"], "Clear weather is the opposite of cloudy.", "clear"],
      ["Choose the option OPPOSITE in meaning to: DANGER", "safety", ["risk", "hazard", "threat"], "Safety is the opposite of danger.", "safety"],
      ["Choose the option OPPOSITE in meaning to: ELITE", "masses", ["nobles", "upper class", "select few"], "The masses are the opposite of the elite.", "masses"],
      ["Choose the option OPPOSITE in meaning to: FLEXIBLE", "rigid", ["bendable", "supple", "elastic"], "Rigid is the opposite of flexible.", "rigid"],
      ["Choose the option OPPOSITE in meaning to: GRATITUDE", "ingratitude", ["thanks", "appreciation", "warmth"], "Ingratitude is the opposite of gratitude.", "ingratitude"],
      ["Choose the option OPPOSITE in meaning to: HASTE", "delay", ["speed", "rush", "quickness"], "Delay is the opposite of haste.", "delay"],
      ["Choose the option OPPOSITE in meaning to: IMPORT", "export", ["bring in", "ship in", "introduce"], "Export is the opposite of import.", "export"],
      ["Choose the option OPPOSITE in meaning to: MANDATORY", "optional", ["required", "compulsory", "obligatory"], "Optional is the opposite of mandatory.", "optional"],
    ],
  }),
  recallFamily({
    id: "idioms-meaning",
    topicSlug: "lexis-structure",
    label: "Idiomatic expressions",
    hint: "Take the idiom as a whole, not word by word.",
    rows: [
      ["'To let the cat out of the bag' means to", "reveal a secret", ["lose a pet", "cause a panic", "tell a lie"], "The idiom means disclosing something hidden.", "reveal a secret"],
      ["'To burn the midnight oil' means to", "study or work late into the night", ["waste fuel", "sleep early", "cook at night"], "It describes late-night work by lamplight.", "study or work late into the night"],
      ["'A blessing in disguise' means", "something good that seemed bad at first", ["a hidden danger", "a religious gift", "a lucky charm"], "The misfortune turns out to be fortunate.", "something good that seemed bad at first"],
      ["'To beat about the bush' means to", "avoid coming to the point", ["clear a garden", "speak bluntly", "hurry up"], "It means approaching indirectly.", "avoid coming to the point"],
      ["'To break the ice' means to", "make strangers feel at ease", ["damage the freezer", "start a quarrel", "cool a drink"], "It is about easing first-meeting tension.", "make strangers feel at ease"],
      ["'To call a spade a spade' means to", "speak plainly and directly", ["hide the truth", "use hard words", "dig carefully"], "It means blunt, honest speech.", "speak plainly and directly"],
      ["'To carry the day' means to", "win or succeed", ["work hard", "arrive late", "be dismissed"], "Carrying the day is achieving victory.", "win or succeed"],
      ["'To face the music' means to", "accept the consequences", ["listen to a concert", "start an argument", "hide from blame"], "It means meeting the results of one's actions.", "accept the consequences"],
      ["'To give someone the cold shoulder' means to", "deliberately ignore them", ["offer a coat", "help a friend", "attack an enemy"], "It means showing studied indifference.", "deliberately ignore them"],
      ["'To have an axe to grind' means to", "have a personal motive", ["sharpen a tool", "do hard labour", "hold a grudge only"], "It means a private reason for one's actions.", "have a personal motive"],
      ["'To kill two birds with one stone' means to", "achieve two aims with one action", ["waste effort", "hurt animals", "plan carefully"], "One action, two results.", "achieve two aims with one action"],
      ["'To leave no stone unturned' means to", "try every possible means", ["give up early", "hide evidence", "lose keys"], "It means exhaustive effort.", "try every possible means"],
      ["'To make ends meet' means to", "manage within one's income", ["tie ropes", "argue fairly", "agree finally"], "It describes financial balancing.", "manage within one's income"],
      ["'To play second fiddle' means to", "take a subordinate role", ["learn music", "copy exactly", "reply late"], "It means being less important than another.", "take a subordinate role"],
      ["'To put all eggs in one basket' means to", "risk everything on a single venture", ["shop carefully", "save money", "cook in bulk"], "It warns against total concentration of risk.", "risk everything on a single venture"],
      ["'To smell a rat' means to", "suspect something wrong", ["have a cold", "be hungry", "clean a house"], "It means detecting deceit.", "suspect something wrong"],
      ["'To spill the beans' means to", "disclose a secret", ["waste food", "start a riot", "lose a game"], "Spilling beans is revealing hidden facts.", "disclose a secret"],
      ["'To turn a deaf ear' means to", "refuse to listen", ["ask loudly", "need hearing aids", "sing loudly"], "It means ignoring a request.", "refuse to listen"],
      ["'To be under the weather' means to", "feel slightly ill", ["hide from rain", "shelter outdoors", "be too busy"], "It describes mild illness.", "feel slightly ill"],
      ["'To bite the dust' means to", "fail or die", ["eat soil", "start work", "fall asleep"], "It means collapsing or failing.", "fail or die"],
      ["'To cross one's mind' means to", "come into one's thoughts", ["walk away", "disagree", "be train"], "A thought suddenly occurs.", "come into one's thoughts"],
      ["'To eat one's words' means to", "retract what one said", ["speak badly", "apologise formally", "stutter"], "It is taking back a statement.", "retract what one said"],
      ["'To get the sack' means to", "be dismissed from a job", ["be promoted", "receive a gift", "go on leave"], "It means losing one's employment.", "be dismissed from a job"],
      ["'To hit the nail on the head' means to", "describe exactly what is true", ["hammer loudly", "miss the point", "injure oneself"], "It is being precisely right.", "describe exactly what is true"],
      ["'To keep one's fingers crossed' means to", "hope for a good outcome", ["tell a lie", "refuse to help", "sign a deal"], "It is a gesture of hope.", "hope for a good outcome"],
      ["'Once in a blue moon' means", "very rarely", ["every night", "twice a year", "always on time"], "The rare blue moon marks rarity.", "very rarely"],
      ["'To read between the lines' means to", "understand the hidden meaning", ["read too fast", "skip pages", "copy notes"], "It means sensing implication.", "understand the hidden meaning"],
      ["'To sit on the fence' means to", "avoid taking sides", ["hide in a garden", "watch a match", "break a rule"], "It means staying neutral.", "avoid taking sides"],
      ["'A storm in a teacup' means", "a fuss over a trivial matter", ["heavy weather", "a broken cup", "a long delay"], "It is exaggerated anger over nothing.", "a fuss over a trivial matter"],
      ["'To turn over a new leaf' means to", "start afresh with better behaviour", ["buy a new book", "lose a page", "garden at night"], "It means beginning to behave better.", "start afresh with better behaviour"],
    ],
  }),
  recallFamily({
    id: "phrasal-verbs",
    topicSlug: "lexis-structure",
    label: "Phrasal verbs",
    hint: "The particle changes the meaning of the base verb completely.",
    rows: [
      ["'The manager called OFF the meeting.' The phrasal verb 'call off' means", "cancel", ["postpone", "announce", "open"], "Calling off cancels an arrangement.", "cancel"],
      ["'Please fill IN the form.' 'Fill in' means", "complete", ["paint", "clean", "enlarge"], "To fill in a form is to complete it.", "complete"],
      ["'The plane took off at dawn.' 'Take off' here means", "leave the ground", ["remove clothing", "imitate a person", "reduce a price"], "Aircraft take off when they rise.", "leave the ground"],
      ["'They put out the fire.' 'Put out' means", "extinguish", ["postpone", "increase", "store"], "Putting out a fire is extinguishing it.", "extinguish"],
      ["'I ran into an old friend.' 'Run into' means", "meet by chance", ["hit with a car", "enter a room", "escape from"], "It means an unexpected meeting.", "meet by chance"],
      ["'She looks after her sister.' 'Look after' means", "care for", ["search for", "watch behind", "admire"], "Looking after is caring for someone.", "care for"],
      ["'The car broke down on the bridge.' 'Break down' here means", "stop working", ["collapse physically", "analyse", "reduce numbers"], "A machine that breaks down fails to function.", "stop working"],
      ["'He gave up smoking.' 'Give up' means", "stop doing something", ["hand over", "lose hope", "donate"], "Giving up a habit is stopping it.", "stop doing something"],
      ["'Please put away your books.' 'Put away' means", "return to its place", ["discard", "hide outside", "publish"], "Putting away is storing things tidily.", "return to its place"],
      ["'The teacher pointed out the error.' 'Point out' means", "draw attention to", ["measure with a finger", "cancel", "print out"], "It means indicating something.", "draw attention to"],
      ["'We set off early.' 'Set off' means", "begin a journey", ["explode", "arrange", "switch off"], "Setting off is starting out.", "begin a journey"],
      ["'The teacher handed out the papers.' 'Hand out' means", "distribute", ["wave goodbye", "collect in", "sign over"], "Handing out is distributing.", "distribute"],
      ["'She brought up her children well.' 'Bring up' means", "raise a child", ["carry upward", "vomit", "mention briefly"], "Rearing children is bringing them up.", "raise a child"],
      ["'They carried on working.' 'Carry on' means", "continue", ["lift", "behave", "postpone"], "To carry on is to continue.", "continue"],
      ["'He came across the letter.' 'Come across' means", "find by chance", ["walk across", "object openly", "deliver across"], "It means discovering unexpectedly.", "find by chance"],
      ["'The firemen put the fire out quickly.' 'Put out' again means", "extinguish", ["postpone", "extend", "store"], "Fires are extinguished, i.e. put out.", "extinguish"],
      ["'Turn down the music.' 'Turn down' means", "reduce the volume", ["refuse an offer", "reverse a car", "switch on"], "Turning down lowers intensity.", "reduce the volume"],
      ["'He turned down the offer.' 'Turn down' here means", "refuse", ["lower the sound", "turn the page", "arrive late"], "In this context it means refusal.", "refuse"],
      ["'The meeting was put off until Monday.' 'Put off' means", "postpone", ["extinguish", "cancel forever", "wear clothes"], "Putting off is delaying.", "postpone"],
      ["'She takes after her mother.' 'Take after' means", "resemble a parent", ["care for", "follow behind", "copy homework"], "It means resembling a family member.", "resemble a parent"],
      ["'Look up the word in the dictionary.' 'Look up' means", "search for information", ["admire from below", "visit later", "improve"], "Looking up is consulting a reference.", "search for information"],
      ["'The thieves got away.' 'Get away' means", "escape", ["be captured", "travel far", "depart politely"], "Getting away is escaping.", "escape"],
      ["'They made up the story.' 'Make up' here means", "invent", ["apply cosmetics", "reconcile", "compose music only"], "Making up a story is inventing it.", "invent"],
      ["'The two friends made up.' 'Make up' here means", "become reconciled", ["invented", "cosmetic", "composed"], "Making up after a quarrel is reconciling.", "become reconciled"],
      ["'Keep off the grass.' 'Keep off' means", "stay away from", ["remove from", "continue on", "step onto"], "It warns not to enter.", "stay away from"],
      ["'We got on the bus.' 'Get on' means", "board", ["leave a vehicle", "progress", "switch on"], "To get on a bus is to board it.", "board"],
      ["'Drop in whenever you are free.' 'Drop in' means", "visit informally", ["fall down", "withdraw from", "post a letter"], "It means a casual visit.", "visit informally"],
      ["'The candle went out.' 'Go out' here means", "cease burning", ["leave the house", "be extinguished deliberately", "stop dating"], "A flame that goes out is extinguished.", "cease burning"],
      ["'He is looking for his keys.' 'Look for' means", "search for", ["admire", "await", "face"], "Looking for is searching.", "search for"],
      ["'She takes care of the baby.' 'Take care of' means", "be responsible for", ["collect from", "caution against", "enjoy"], "It means assuming responsibility.", "be responsible for"],
    ],
  }),
  recallFamily({
    id: "preposition-collocation",
    topicSlug: "lexis-structure",
    label: "Preposition choices",
    hint: "Some prepositions are fixed by the verb or adjective they follow.",
    rows: [
      ["Choose the correct preposition: good ___ mathematics", "at", ["in", "on", "for"], "We are good AT a skill or subject.", "at"],
      ["Choose the correct preposition: afraid ___ snakes", "of", ["from", "with", "about"], "Afraid takes 'of'.", "of"],
      ["Choose the correct preposition: capable ___ doing it", "of", ["to", "for", "with"], "Capable is followed by 'of'.", "of"],
      ["Choose the correct preposition: depend ___ hard work", "on", ["from", "of", "at"], "One depends ON something.", "on"],
      ["Choose the correct preposition: congratulate him ___ his success", "on", ["for", "of", "at"], "Congratulations are offered ON an occasion.", "on"],
      ["Choose the correct preposition: tired ___ waiting", "of", ["from", "with", "for"], "Tired of means bored with; tired from means exhausted by work.", "of"],
      ["Choose the correct preposition: accused ___ theft", "of", ["for", "with", "about"], "One is accused OF a crime.", "of"],
      ["Choose the correct preposition: married ___ a doctor", "to", ["with", "of", "by"], "One is married TO someone.", "to"],
      ["Choose the correct preposition: listen ___ the radio", "to", ["at", "on", "in"], "We listen TO something.", "to"],
      ["Choose the correct preposition: arrived ___ the station", "at", ["to", "in", "on"], "We arrive AT a small place, IN a large one.", "at"],
      ["Choose the correct preposition: proud ___ her work", "of", ["in", "for", "about"], "Pride is expressed with 'of'.", "of"],
      ["Choose the correct preposition: interested ___ music", "in", ["on", "at", "for"], "Interest takes 'in'.", "in"],
      ["Choose the correct preposition: charge ___ theft", "with", ["of", "for", "on"], "One is charged WITH an offence.", "with"],
      ["Choose the correct preposition: ashamed ___ his conduct", "of", ["for", "at", "from"], "Ashamed takes 'of'.", "of"],
      ["Choose the correct preposition: comply ___ the rules", "with", ["to", "at", "on"], "We comply WITH a rule.", "with"],
      ["Choose the correct preposition: aware ___ the danger", "of", ["about", "to", "with"], "Aware takes 'of'.", "of"],
      ["Choose the correct preposition: jealous ___ her sister", "of", ["with", "at", "for"], "Jealousy takes 'of'.", "of"],
      ["Choose the correct preposition: responsible ___ the fault", "for", ["of", "to", "at"], "Responsibility takes 'for'.", "for"],
      ["Choose the correct preposition: differ ___ his brother", "from", ["with", "than", "to"], "One thing differs FROM another.", "from"],
      ["Choose the correct preposition: familiar ___ the route", "with", ["to", "of", "at"], "Familiar takes 'with'.", "with"],
      ["Choose the correct preposition: grateful ___ your help", "for", ["of", "to", "with"], "Gratitude takes 'for'.", "for"],
      ["Choose the correct preposition: sorry ___ the delay", "for", ["of", "at", "about"], "One apologises FOR something.", "for"],
      ["Choose the correct preposition: superior ___ the rest", "to", ["than", "of", "over"], "Superior takes 'to', never 'than'.", "to"],
      ["Choose the correct preposition: prefer tea ___ coffee", "to", ["than", "over", "against"], "Prefer takes 'to'.", "to"],
      ["Choose the correct preposition: good ___ children", "with", ["at", "in", "for"], "Good WITH people; good AT skills.", "with"],
      ["Choose the correct preposition: borrow money ___ a friend", "from", ["of", "to", "off"], "We borrow FROM and lend TO.", "from"],
      ["Choose the correct preposition: divide the class ___ four groups", "into", ["in", "to", "among"], "Divide INTO groups; divide AMONG many.", "into"],
      ["Choose the correct preposition: share the food ___ the boys", "among", ["between", "into", "amongst always"], "Among for more than two; between for two.", "among"],
      ["Choose the correct preposition: congratulate ___ passing", "on", ["for", "at", "about"], "Congratulate ON an achievement (the noun takes 'on').", "on"],
      ["Choose the correct preposition: insist ___ paying", "on", ["to", "in", "at"], "Insist takes 'on'.", "on"],
    ],
  }),
  recallFamily({
    id: "oral-vowel-sounds",
    topicSlug: "oral-english",
    label: "Vowel sounds and minimal pairs",
    hint: "Rhyme means the same vowel and following consonants, not just the same letters.",
    rows: [
      ["Which word rhymes with 'book'?", "look", ["boot", "food", "pool"], "Book has the short /ʊ/; boot, food and pool have /uː/.", "look"],
      ["Which word rhymes with 'seat'?", "beat", ["sit", "set", "sat"], "Seat /iː/ rhymes with beat.", "beat"],
      ["Which word rhymes with 'heard'?", "word", ["beard", "sheared", "neared"], "Heard /ɜː/ rhymes with word.", "word"],
      ["Which word rhymes with 'cow'?", "now", ["caw", "low", "sow"], "Cow has the /aʊ/ diphthong; low and sow have /əʊ/.", "now"],
      ["Which word rhymes with 'bear'?", "hair", ["beer", "burr", "bar"], "Bear has /eə/ like hair; beer has /ɪə/.", "hair"],
      ["Which word rhymes with 'bird'?", "herd", ["beard", "bored", "blood"], "Bird /ɜː/ rhymes with herd.", "herd"],
      ["Which word has the sound in 'put'?", "full", ["fool", "pool", "rule"], "Put and full share the short /ʊ/.", "full"],
      ["Which word has the sound in 'sheep'?", "seat", ["ship", "shepherd", "sleep"], "Sheep /iː/ matches seat.", "seat"],
      ["Which word has the sound in 'hat'?", "cat", ["heart", "hate", "hot"], "Hat and cat share /æ/.", "cat"],
      ["Which word has the sound in 'caught'?", "bought", ["boat", "boot", "bout"], "Caught and bought share /ɔː/.", "bought"],
      ["Which word has the sound in 'day'?", "they", ["den", "din", "done"], "Day has the /eɪ/ diphthong.", "they"],
      ["Which word has the sound in 'go'?", "show", ["now", "gnaw", "song"], "Go has /əʊ/ like show; now and gnaw carry different vowels.", "show"],
      ["Which word has the sound in 'boy'?", "coin", ["cone", "cane", "comb"], "Boy /ɔɪ/ matches coin.", "coin"],
      ["Which word has the sound in 'ear' (to hear)?", "here", ["hair", "hare", "air"], "'Hear' has /ɪə/ like here.", "here"],
      ["Which word has the sound in 'poor'?", "sure", ["poll", "pull", "pale"], "Poor, sure, tour and four often share /ʊə/.", "sure"],
      ["Which word has the sound in 'bird'?", "nurse", ["nose", "mouse", "boss"], "Nurse /ɜː/ matches bird.", "nurse"],
      ["Which word has the sound in 'card'?", "cart", ["cat", "cut", "coat"], "Card /ɑː/ matches cart.", "cart"],
      ["Which word has the sound in 'two'?", "blue", ["plow", "how", "low"], "Two /uː/ matches blue; how has /aʊ/.", "blue"],
      ["Which word has the sound in 'price'?", "wise", ["wrote", "woes", "rope"], "Price /aɪ/ matches wise.", "wise"],
      ["Which word has the sound in 'mouth'?", "south", ["math", "month", "mother"], "Mouth /aʊ/ matches south.", "south"],
      ["Which word has the sound in 'cheer'?", "fierce", ["far", "four", "fir"], "Cheer /ɪə/ matches fierce.", "fierce"],
      ["Which word has the sound in 'force'?", "horse", ["house", "hose", "hiss"], "Force /ɔː/ matches horse.", "horse"],
      ["Which word has the sound in 'cup'?", "love", ["loop", "leap", "cope"], "Cup /ʌ/ matches love.", "love"],
      ["Which word has the sound in 'turn'?", "learn", ["lone", "ten", "tone"], "Turn /ɜː/ matches learn.", "learn"],
      ["Which word has the sound in 'tea'?", "key", ["kick", "kept", "keel not chosen"], "Tea /iː/ matches key.", "key"],
      ["Which word has the sound in 'so'?", "toe", ["tow", "too not chosen", "toy"], "So /əʊ/ matches toe.", "toe"],
      ["Which word has the sound in 'air'?", "heir", ["her", "hire", "hour"], "Air /eə/ matches heir.", "heir"],
      ["Which word has the sound in 'paw'?", "law", ["plow", "low", "lay"], "Paw /ɔː/ matches law.", "law"],
      ["Which word has the sound in 'news'?", "choose", ["nose", "noise", "nearer"], "News /uː/ (for most speakers) matches choose.", "choose"],
      ["Which word has the sound in 'fear'?", "pier", ["far", "farer", "pair"], "Fear /ɪə/ matches pier.", "pier"],
    ],
  }),
  recallFamily({
    id: "oral-stress",
    topicSlug: "oral-english",
    label: "Word stress patterns",
    hint: "Primary stress is the loudest syllable; count syllables from the start of the word.",
    rows: [
      ["Where is the primary stress in 'photograph'?", "first syllable (PHO-to-graph)", ["second syllable", "third syllable", "even stress"], "The noun PHO-to-graph stresses the first syllable.", "first syllable (PHO-to-graph)"],
      ["Where is the primary stress in 'photography'?", "second syllable (pho-TO-gra-phy)", ["first syllable", "third syllable", "fourth syllable"], "The -graphy ending pushes stress to the second.", "second syllable (pho-TO-gra-phy)"],
      ["Where is the primary stress in 'photographer'?", "third syllable (pho-to-GRA-pher)", ["first syllable", "second syllable", "fourth syllable"], "The -grapher noun stresses the third.", "third syllable (pho-to-GRA-pher)"],
      ["Where is the primary stress in 'advertise'?", "third syllable (ad-ver-TISE)", ["first syllable", "second syllable", "fourth syllable"], "Two-syllable verbs stress the last; three-syllable -ise verbs land on the third.", "third syllable (ad-ver-TISE)"],
      ["Where is the primary stress in 'advertisement'?", "third syllable (ad-ver-TISE-ment)", ["first syllable", "second syllable", "fourth syllable"], "The noun advertISement stresses the third.", "third syllable (ad-ver-TISE-ment)"],
      ["Where is the primary stress in 'government'?", "first syllable (GOV-ern-ment)", ["second syllable", "third syllable", "even stress"], "Most three-syllable nouns stress the first.", "first syllable (GOV-ern-ment)"],
      ["Where is the primary stress in 'important'?", "second syllable (im-POR-tant)", ["first syllable", "third syllable", "even stress"], "The adjective imPORtant stresses the second.", "second syllable (im-POR-tant)"],
      ["Where is the primary stress in 'beautiful'?", "first syllable (BEAU-ti-ful)", ["second syllable", "third syllable", "even stress"], "Three-syllable adjectives often take first stress.", "first syllable (BEAU-ti-ful)"],
      ["Where is the primary stress in 'university'?", "fourth syllable (u-ni-VER-si-ty)", ["first syllable", "second syllable", "third syllable"], "UniVERsity stress falls on the -ver- syllable.", "fourth syllable (u-ni-VER-si-ty)"],
      ["Where is the primary stress in 'education'?", "third syllable (e-du-CA-tion)", ["first syllable", "second syllable", "fourth syllable"], "Education takes third-syllable stress.", "third syllable (e-du-CA-tion)"],
      ["Where is the primary stress in 'employment'?", "second syllable (em-PLOY-ment)", ["first syllable", "third syllable", "fourth syllable"], "emPLOYment stresses the root verb syllable.", "second syllable (em-PLOY-ment)"],
      ["Where is the primary stress in 'develop'?", "second syllable (de-VE-lop)", ["first syllable", "third syllable", "even stress"], "The verb deVElop stresses the second.", "second syllable (de-VE-lop)"],
      ["Where is the primary stress in 'development'?", "second syllable (de-VE-lop-ment)", ["first syllable", "third syllable", "fourth syllable"], "deVElopment keeps the verb stress.", "second syllable (de-VE-lop-ment)"],
      ["Where is the primary stress in 'agriculture'?", "first syllable (AG-ri-cul-ture)", ["second syllable", "third syllable", "fourth syllable"], "AGriculture takes first-syllable stress.", "first syllable (AG-ri-cul-ture)"],
      ["Where is the primary stress in 'accountant'?", "second syllable (ac-COUN-tant)", ["first syllable", "third syllable", "even stress"], "acCOUNtant stresses the second.", "second syllable (ac-COUN-tant)"],
      ["Where is the primary stress in 'history'?", "first syllable (HIS-to-ry)", ["second syllable", "third syllable", "even stress"], "Mono-root nouns like HIStory take first stress.", "first syllable (HIS-to-ry)"],
      ["Where is the primary stress in 'reporter'?", "second syllable (re-POR-ter)", ["first syllable", "third syllable", "even stress"], "rePORter follows the rePORT + -er pattern.", "second syllable (re-POR-ter)"],
      ["Where is the primary stress in 'invitation'?", "third syllable (in-vi-TA-tion)", ["first syllable", "second syllable", "fourth syllable"], "inviTAtion stresses the third.", "third syllable (in-vi-TA-tion)"],
      ["Where is the primary stress in 'medicine'?", "first syllable (MED-i-cine)", ["second syllable", "third syllable", "even stress"], "MEDicine (noun) takes first-syllable stress.", "first syllable (MED-i-cine)"],
      ["Where is the primary stress in 'examination'?", "third syllable (ex-am-i-NA-tion)", ["first syllable", "second syllable", "fourth syllable"], "examiNAtion stresses -na-.", "third syllable (ex-am-i-NA-tion)"],
      ["Where is the primary stress in 'computer'?", "second syllable (com-PU-ter)", ["first syllable", "third syllable", "even stress"], "comPUter stresses the second syllable.", "second syllable (com-PU-ter)"],
      ["Where is the primary stress in 'remember'?", "second syllable (re-MEM-ber)", ["first syllable", "third syllable", "even stress"], "reMEMber stresses the second.", "second syllable (re-MEM-ber)"],
      ["Where is the primary stress in 'yesterday'?", "first syllable (YES-ter-day)", ["second syllable", "third syllable", "even stress"], "Compounds of time usually keep first-syllable stress.", "first syllable (YES-ter-day)"],
      ["Where is the primary stress in 'understand'?", "third syllable (un-der-STAND)", ["first syllable", "second syllable", "fourth syllable"], "underSTAND stresses the root last.", "third syllable (un-der-STAND)"],
      ["Where is the primary stress in 'conversation'?", "third syllable (con-ver-SA-tion)", ["first syllable", "second syllable", "fourth syllable"], "converSAtion takes third-syllable stress.", "third syllable (con-ver-SA-tion)"],
      ["Where is the primary stress in 'delicious'?", "second syllable (de-LI-cious)", ["first syllable", "third syllable", "even stress"], "deLIcious stresses the second.", "second syllable (de-LI-cious)"],
      ["Where is the primary stress in 'envelope' (the noun)?", "first syllable (EN-ve-lope)", ["second syllable", "third syllable", "even stress"], "The noun ENvelope takes first stress; the verb takes second.", "first syllable (EN-ve-lope)"],
      ["Where is the primary stress in 'compromise'?", "first syllable (COM-pro-mise)", ["second syllable", "third syllable", "even stress"], "COMpromise (noun) stresses the first.", "first syllable (COM-pro-mise)"],
      ["Where is the primary stress in 'translation'?", "third syllable (trans-la-TION)", ["first syllable", "second syllable", "fourth syllable"], "translaTION follows the transLATE + -ion pattern.", "third syllable (trans-la-TION)"],
      ["Where is the primary stress in 'festival'?", "first syllable (FES-ti-val)", ["second syllable", "third syllable", "even stress"], "FESsival is first-stressed.", "first syllable (FES-ti-val)"],
    ],
  }),
  recallFamily({
    id: "word-class-function",
    topicSlug: "grammar-foundations",
    label: "Word class in context",
    hint: "The job a word does in the sentence fixes its class.",
    rows: [
      ["In 'She sang BEAUTIFULLY', the underlined word is a", "adverb", ["adjective", "noun", "verb"], "It modifies the verb 'sang'; -ly adverbs are easy to spot.", "adverb"],
      ["In 'The FAST train left', the underlined word is a", "adjective", ["adverb", "noun", "pronoun"], "It describes the noun 'train'.", "adjective"],
      ["In 'They elected him PRESIDENT', the underlined word is a", "noun", ["adjective", "adverb", "verb"], "It names the role — a complement noun.", "noun"],
      ["In 'He runs QUICKLY', the underlined word is a", "adverb", ["adjective", "noun", "conjunction"], "It tells how he runs — manner adverb.", "adverb"],
      ["In 'Her LAUGHTER filled the room', the underlined word is a", "noun", ["verb", "adjective", "adverb"], "The -ther form is a noun here.", "noun"],
      ["In 'It is a STONE wall', the underlined word is a", "noun used as an adjective", ["adjective", "adverb", "verb"], "Nouns can modify nouns: 'stone wall'.", "noun used as an adjective"],
      ["In 'We walked BUT it rained', the underlined word is a", "conjunction", ["preposition", "adverb", "pronoun"], "'But' joins two clauses.", "conjunction"],
      ["In 'She went OUT', the underlined word is a", "adverb", ["preposition", "adjective", "conjunction"], "It completes the verb; no object follows.", "adverb"],
      ["In 'He sat ON the chair', the underlined word is a", "preposition", ["adverb", "conjunction", "pronoun"], "It shows position and takes an object.", "preposition"],
      ["In 'The rich should help the POOR', the underlined word is a", "noun", ["adjective", "verb", "adverb"], "Adjectives can act as nouns meaning 'poor people'.", "noun"],
      ["In 'I will GO now', the underlined word is a", "verb", ["noun", "adverb", "auxiliary"], "It is the main action verb.", "verb"],
      ["In 'He has EATEN', the underlined word is a", "past participle", ["present participle", "infinitive", "gerund"], "Eaten is the past participle of eat.", "past participle"],
      ["In 'WAITING is boring', the underlined word is a", "gerund", ["participle", "infinitive", "noun clause"], "The -ing form acting as the subject is a gerund.", "gerund"],
      ["In 'To SEE is to believe', the underlined words are an", "infinitive", ["gerund", "participle", "clause"], "'To see' is the to-infinitive used as a noun.", "infinitive"],
      ["In 'The girl WHO called is here', the underlined word is a", "relative pronoun", ["personal pronoun", "conjunction", "adverb"], "'Who' introduces a relative clause.", "relative pronoun"],
      ["In 'OUCH, that hurts', the underlined word is an", "interjection", ["noun", "adverb", "preposition"], "It expresses sudden feeling.", "interjection"],
      ["In 'He spoke SOFTLY', the underlined word is a", "adverb", ["adjective", "noun", "verb"], "It modifies 'spoke'.", "adverb"],
      ["In 'The TALL boy', the underlined word is a", "adjective", ["noun", "adverb", "pronoun"], "It modifies 'boy'.", "adjective"],
      ["In 'She is my MOTHER', the underlined word is a", "noun", ["pronoun", "adjective", "verb"], "It names a person.", "noun"],
      ["In 'The boy KICKED the ball', the underlined word is a", "verb", ["noun", "adverb", "adjective"], "It is the action.", "verb"],
      ["In 'He ran AFTER the bus', the underlined word is a", "preposition", ["adverb", "conjunction", "adjective"], "It takes 'the bus' as its object.", "preposition"],
      ["In 'Good HEALTH matters', the underlined word is a", "abstract noun", ["concrete noun", "proper noun", "collective noun"], "Health is a quality you cannot touch.", "abstract noun"],
      ["In 'A CROWD gathered', the underlined word is a", "collective noun", ["proper noun", "material noun", "abstract noun"], "A crowd names a group treated as one.", "collective noun"],
      ["In 'THIS is yours', the underlined word is a", "demonstrative pronoun", ["demonstrative adjective", "personal pronoun", "relative pronoun"], "It stands alone, so it is a pronoun.", "demonstrative pronoun"],
    ],
  }),
  recallFamily({
    id: "letter-format",
    topicSlug: "continuous-writing",
    label: "Formal letter features",
    hint: "A formal letter keeps address, date, salutation and close in fixed order.",
    rows: [
      ["A formal letter should open with", "the writer's address", ["the recipient's mood", "a proverb", "a summary of the topic"], "Your address comes first, then the date.", "the writer's address"],
      ["The date of a formal letter is written", "below the writer's address", ["in the middle of the body", "at the end of the letter", "nowhere"], "Address, then date, then the recipient's address.", "below the writer's address"],
      ["The greeting of a formal letter is called the", "salutation", ["subscription", "valediction", "heading"], "Dear Sir / Dear Madam is the salutation.", "salutation"],
      ["An unknown recipient is addressed as", "Dear Sir or Dear Madam", ["Dear Friend", "Dear Beloved", "Your Excellency always"], "Use Sir/Madam when the name is unknown; a title when known.", "Dear Sir or Dear Madam"],
      ["The closing of a formal letter is called the", "subscription or valediction", ["salutation", "heading", "argument"], "Yours faithfully / Yours sincerely closes it.", "subscription or valediction"],
      ["'Yours sincerely' closes a letter that", "names the recipient in the salutation", ["uses Dear Sir", "is informal", "has no signature"], "Name known -> sincerely; unknown -> faithfully.", "names the recipient in the salutation"],
      ["'Yours faithfully' is used when the salutation is", "Dear Sir or Dear Madam", ["Dear James", "Dear Aunty", "Hi there"], "Unknown name -> faithfully.", "Dear Sir or Dear Madam"],
      ["The line that states the letter's purpose is", "the opening paragraph", ["the address block", "the signature", "the postscript"], "State the reason early and plainly.", "the opening paragraph"],
      ["Contractions such as 'don't' in a formal letter are", "avoided", ["encouraged", "mandatory", "ignored"], "Formal register expands contractions.", "avoided"],
      ["The recipient's address is written", "before the salutation", ["after the signature", "inside the body", "on the envelope only"], "It sits below the date.", "before the salutation"],
      ["A postscript should", "carry only a brief afterthought", ["replace the body", "hold the main argument", "be signed twice"], "The body carries the argument; P.S. is short.", "carry only a brief afterthought"],
      ["The signature block includes", "the writer's name and signature", ["the date again", "the recipient's title", "the salutation"], "Yours faithfully, then name and signature.", "the writer's name and signature"],
      ["An informal letter may address the reader as", "Dear Uncle Tunji", ["Dear Sir", "Your Excellency", "To whom it may concern"], "Familiar terms suit informal letters.", "Dear Uncle Tunji"],
      ["'To whom it may concern' is used when", "the recipient is completely unknown", ["writing to a friend", "writing to a boss", "writing a resignation"], "It is the last-resort salutation.", "the recipient is completely unknown"],
      ["Language in a formal letter should be", "polite and precise", ["slangy and chatty", "short and rude", "poetic and vague"], "Register must stay courteous and clear.", "polite and precise"],
      ["The main body of the letter is divided into", "clear paragraphs", ["one endless sentence", "rhyming lines", "bullet points only"], "Paragraphs organise the argument.", "clear paragraphs"],
      ["A personal letter is likely to include", "enquiries about family", ["official stamps", "a job application", "legal clauses"], "Personal news suits personal letters.", "enquiries about family"],
      ["The address of the recipient is called the", "inside address", ["salutation", "subscription", "postscript"], "It sits inside the letter, before the greeting.", "inside address"],
      ["A letter to an editor should", "address a public issue briefly and clearly", ["include family gossip", "use slang", "ignore the topic"], "State the issue and your stand in order.", "address a public issue briefly and clearly"],
      ["In a resignation letter, the writer should", "state the decision and the last working day", ["apologise for leaving badly", "omit the date", "threaten the employer"], "Be direct, brief and courteous.", "state the decision and the last working day"],
    ],
  }),
  recallFamily({
    id: "summary-writing",
    topicSlug: "summary-writing",
    label: "Summary writing",
    hint: "A summary carries only the points that answer the question.",
    rows: [
      ["A summary should be written in", "continuous prose", ["bullet points", "dialogue form", "poetic lines"], "Answers flow as prose unless told otherwise.", "continuous prose"],
      ["When a word limit is given you should", "stay within it exactly in spirit", ["double the length", "ignore the limit", "write one long sentence"], "Examiners penalise length violations.", "stay within it exactly in spirit"],
      ["The most important summary skill is", "identifying the relevant points", ["copying the passage", "using long words", "adding your opinions"], "Select the facts that answer the question.", "identifying the relevant points"],
      ["Good summaries avoid", "illustrations and examples", ["main points", "repeated ideas in new words", "precise wording"], "Examples pad but rarely carry marks.", "illustrations and examples"],
      ["Direct copying from the passage is called", "lifting", ["paraphrasing", "inference", "selection"], "Lifted phrases count against the answer.", "lifting"],
      ["A paraphrase should", "keep the meaning in fresh words", ["change the meaning", "quote exactly", "shorten by half always"], "Same sense, new expression.", "keep the meaning in fresh words"],
      ["Summary sentences should be", "short and complete", ["fragments", "run-ons", "questions"], "Full short sentences score best.", "short and complete"],
      ["One mark in summary is usually awarded for", "each relevant point expressed correctly", ["each sentence written", "each word copied", "each paragraph read"], "Points, not word count, earn marks.", "each relevant point expressed correctly"],
      ["When numbering a summary, numbers", "count as words or as instructed", ["are always free", "never count", "are forbidden"], "Follow the rubric on whether numerals count.", "count as words or as instructed"],
      ["A summary of a speech should include", "the speaker's main arguments only", ["every joke", "every repetition", "the audience's mood"], "Strip the rhetoric, keep the substance.", "the speaker's main arguments only"],
      ["Irrelevant decorative details in a passage should be", "omitted", ["kept for interest", "quoted at length", "reworded twice"], "They are not points.", "omitted"],
      ["The first step in summarising is to", "read the whole passage carefully", ["write immediately", "copy paragraph one", "count words"], "Understanding precedes selection.", "read the whole passage carefully"],
      ["A good summary is", "shorter than the original but complete in points", ["as long as the passage", "longer than the passage", "any length"], "Brevity with completeness.", "shorter than the original but complete in points"],
      ["If the passage repeats a point for emphasis, the summary should", "state it once", ["repeat it fully", "repeat it thrice", "omit everything"], "One clear statement is enough.", "state it once"],
      ["Transitional words in a summary", "help the answer flow but are not points", ["replace points", "count for two marks", "should be many"], "Keep one or two, not a chain.", "help the answer flow but are not points"],
      ["Figures and statistics in a summary should be", "used only where they carry a point", ["always quoted", "ignored always", "converted to words"], "Numbers earn marks only when relevant.", "used only where they carry a point"],
      ["When the question says 'in five sentences', you should", "cover the points in exactly five sentences", ["write ten", "use fragments", "write one sentence"], "Obey the structural instruction.", "cover the points in exactly five sentences"],
      ["Adding a personal opinion to a summary", "costs marks", ["earns extra", "is expected", "is always safe"], "Summaries are objective.", "costs marks"],
      ["The purpose of summary writing is to", "test understanding and selection", ["test handwriting", "test memory of quotes", "test vocabulary guessing"], "It tests comprehension, not recall of wording.", "test understanding and selection"],
      ["A summary paragraph should open with", "the first relevant point directly", ["the writer's name", "the title of the book", "a proverb"], "No preamble; start with content.", "the first relevant point directly"],
    ],
  }),
  recallFamily({
    id: "oral-consonants",
    topicSlug: "oral-english",
    label: "Consonant sounds",
    hint: "Name the sound (not the letter) when classifying consonants.",
    rows: [
      ["The sound /θ/ as in 'think' is a", "voiceless dental fricative", ["voiced dental fricative", "alveolar fricative", "nasal"], "The th of 'think' is voiceless; the th of 'this' is voiced.", "voiceless dental fricative"],
      ["The sound /ð/ as in 'this' is", "voiced", ["voiceless", "nasal", "plosive"], "The vocal cords vibrate for 'this'.", "voiced"],
      ["The sound /ʃ/ as in 'ship' is a", "voiceless palato-alveolar fricative", ["voiced labiodental", "nasal", "plosive"], "Sh sounds are voiceless fricatives made at the alveolar ridge.", "voiceless palato-alveolar fricative"],
      ["The sound /ʒ/ as in 'measure' is", "voiced", ["voiceless", "nasal", "glottal"], "The zh sound of 'measure' is voiced.", "voiced"],
      ["The sound /ŋ/ as in 'sing' is a", "nasal", ["fricative", "plosive", "lateral"], "Ng is a velar nasal.", "nasal"],
      ["The sound /tʃ/ as in 'church' is a", "affricate", ["fricative", "nasal", "approximant"], "A stop then a fricative at the same place.", "affricate"],
      ["The sound /dʒ/ as in 'judge' is", "voiced affricate", ["voiceless affricate", "nasal", "fricative"], "Dzh is the voiced match of church.", "voiced affricate"],
      ["The sound /l/ as in 'light' is a", "lateral approximant", ["nasal", "plosive", "fricative"], "Air flows around one or both sides of the tongue.", "lateral approximant"],
      ["The sound /r/ as in 'red' is an", "approximant", ["trill", "plosive", "nasal"], "Most English accents use an approximant r.", "approximant"],
      ["The sound /m/ as in 'man' is a", "bilabial nasal", ["velar nasal", "alveolar nasal", "fricative"], "Both lips close and air escapes through the nose.", "bilabial nasal"],
      ["The sound /p/ as in 'pen' is a", "voiceless bilabial plosive", ["voiced bilabial plosive", "fricative", "nasal"], "Lips close then burst air, without voice.", "voiceless bilabial plosive"],
      ["The sound /b/ as in 'bed' is", "voiced", ["voiceless", "nasal", "fricative"], "Same place as /p/ but voiced.", "voiced"],
      ["The sound /f/ as in 'fish' is a", "voiceless labiodental fricative", ["voiced labiodental", "plosive", "nasal"], "Lip and teeth make f and v.", "voiceless labiodental fricative"],
      ["The sound /v/ as in 'van' is", "voiced", ["voiceless", "nasal", "plosive"], "V is the voiced match of f.", "voiced"],
      ["The sound /h/ as in 'hat' is a", "glottal fricative", ["velar nasal", "palatal", "plosive"], "H is made at the glottis.", "glottal fricative"],
      ["The sound /j/ as in 'yes' is a", "palatal approximant", ["velar plosive", "labiodental", "nasal"], "Y is a glide between vowels and consonants.", "palatal approximant"],
      ["The sound /w/ as in 'wet' is a", "labio-velar approximant", ["bilabial plosive", "dental", "nasal"], "W combines lip rounding with a velar glide.", "labio-velar approximant"],
      ["The sound /k/ as in 'cat' is a", "voiceless velar plosive", ["voiced velar plosive", "fricative", "affricate"], "Back of tongue against the soft palate.", "voiceless velar plosive"],
      ["The sound /g/ as in 'get' is", "voiced velar plosive", ["voiceless velar plosive", "nasal", "approximant"], "G is the voiced match of k.", "voiced velar plosive"],
      ["The sound /s/ as in 'sun' is a", "voiceless alveolar fricative", ["voiced alveolar fricative", "nasal", "plosive"], "S is voiceless; z is its voiced partner.", "voiceless alveolar fricative"],
    ],
  }),
  recallFamily({
    id: "spelling-rules",
    topicSlug: "punctuation-mechanics",
    label: "Spelling rules",
    hint: "These are rule-plus-exception patterns, not random spellings.",
    rows: [
      ["Which spelling is correct?", "definitely", ["definately", "definitly", "defenitely"], "'Definitely' keeps the root 'finite' with -ite.", "definitely"],
      ["Which spelling is correct?", "separate", ["seperate", "separete", "separatte"], "There is 'a rat' in separ-a-rate.", "separate"],
      ["Which spelling is correct?", "occurred", ["ocurred", "occured", "occurredd"], "Stress on the last syllable doubles the r: occurred.", "occurred"],
      ["Which spelling is correct?", "beginning", ["begining", "beginnning", "beginig"], "CVC stress doubles the n: beginning.", "beginning"],
      ["Which spelling is correct?", "receive", ["recieve", "receeve", "receivee"], "'I before e except after c' gives receive.", "receive"],
      ["Which spelling is correct?", "belief", ["beleif", "beleef", "bielief"], "Belief follows 'i before e' (no c).", "belief"],
      ["Which spelling is correct?", "argue", ["argu", "argoo", "arguee"], "Final -e drops before -ing (arguing) and stays in argue.", "argue"],
      ["Which spelling is correct?", "dying", ["dieing", "dyeing", "dinng"], "Die forms dying: ie -> y before -ing.", "dying"],
      ["Which spelling is correct?", "necessary", ["neccessary", "necesary", "necesssary"], "One c, two s's: necessary.", "necessary"],
      ["Which spelling is correct?", "accommodation", ["acomodation", "accomodation", "acommodation"], "It accommodates two c's and two m's.", "accommodation"],
      ["Which spelling is correct?", "embarrass", ["embarass", "embarras", "embarasss"], "Double r and double s.", "embarrass"],
      ["Which spelling is correct?", "maintenance", ["maintainance", "maintenence", "maintenace"], "The noun keeps -tenance.", "maintenance"],
      ["Which spelling is correct?", "privilege", ["priviledge", "privelege", "priviledgege"], "Privilege ends in -ege, not -edge.", "privilege"],
      ["Which spelling is correct?", "independent", ["independant", "indipendent", "independend"], "The ending is -ent, not -ant.", "independent"],
      ["Which spelling is correct?", "existence", ["existance", "exsistence", "existancee"], "From exist: existence.", "existence"],
      ["Which spelling is correct?", "rhythm", ["rythm", "rhytm", "rythme"], "No standard vowel between h and t; order is r-h-y-t-h-m.", "rhythm"],
      ["Which spelling is correct?", "accompany", ["acompany", "accompaney", "accompanyy"], "Double c before company.", "accompany"],
      ["Which spelling is correct?", "practical", ["practicle", "practikal", "practicel"], "Practical follows 'practice' + -al.", "practical"],
      ["Which spelling is correct?", "proceed", ["procede", "proceedd", "proceede"], "Proceed has -eed; precede has -ede.", "proceed"],
      ["Which spelling is correct?", "supersede", ["supercede", "superseed", "supersedee"], "The '-sede' spelling is unique to supersede.", "supersede"],
    ],
  }),
];

// keep parseNum/pool3 referenced so linters see the imports are intentional
void parseNum;
void pool3;
void int;
