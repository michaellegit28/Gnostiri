/**
 * Agricultural science families (round 2, JAMB pool).
 * Computable families re-derive from the statement; recall tables use the
 * dual-answer contract (key + independently authored proof).
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

export const families = [
  {
    id: "percentage-germination",
    topicSlug: "agriculture",
    label: "Percentage germination of seeds",
    params(r) {
      const total = pick(r, [50, 100, 200, 400, 500]);
      const germinated = Math.round((total * pick(r, [70, 72, 75, 80, 85, 88, 90, 92, 96])) / 100);
      return { total, germinated, pct: (germinated / total) * 100 };
    },
    answer: (p) => `${p.pct}%`,
    stem(p) {
      return `Of ${p.total} seeds sown, ${p.germinated} germinated. What is the percentage germination?`;
    },
    distractors(p, r) {
      return pool3(r, p.pct, [100 - p.pct, (p.germinated - p.total) / p.germinated * 100, p.total, p.pct * 2, p.germinated], String).map((v) => `${trim(v, 1)}%`);
    },
    explanation(p) {
      return `Germination % = germinated / sown x 100 = ${p.germinated}/${p.total} x 100 = ${p.pct}%. Quoting the seed count, or the failure rate, are the usual slips.`;
    },
    hint: () => "Percentage germination = seeds that germinate / seeds sown x 100.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.germinated / p.total) * 100) < 0.5;
    },
  },
  {
    id: "stocking-rate",
    topicSlug: "agriculture",
    label: "Stocking rate of pasture",
    params(r) {
      let animals = int(r, 2, 20) * 5;
      let hectares = int(r, 2, 12) * 5;
      // keep rates that print cleanly at 2 dp
      for (let g = 0; g < 60 && Math.abs(animals / hectares - Number((animals / hectares).toFixed(2))) > 1e-9; g++) {
        animals = int(r, 2, 10) * 5;
        hectares = int(r, 2, 10) * 5;
      }
      if (Math.abs(animals / hectares - Number((animals / hectares).toFixed(2))) > 1e-9) {
        animals = 20;
        hectares = 5;
      }
      return { animals, hectares, rate: animals / hectares };
    },
    answer: (p) => `${trim(p.rate, 2)} animals/ha`,
    stem(p) {
      return `A rancher keeps ${p.animals} cattle on ${p.hectares} hectares of pasture. What is the stocking rate?`;
    },
    distractors(p, r) {
      return pool3(r, p.rate, [p.animals * p.hectares, p.animals - p.hectares, p.rate * 2, Math.max(0.1, p.rate - 1), p.hectares], (v) => `${trim(v, 2)} animals/ha`);
    },
    explanation(p) {
      return `Stocking rate = animals / area = ${p.animals}/${p.hectares} = ${trim(p.rate, 2)} animals/ha. It divides, never multiplies.`;
    },
    hint: () => "Stocking rate = number of animals divided by hectares.",
    verify(p, chosen) {
      return Math.abs(parseNum(String(chosen).split("/")[0]) - p.animals / p.hectares) < 6e-3;
    },
  },
  {
    id: "feed-ration-percentage",
    topicSlug: "agriculture",
    label: "Percentage of a feed ingredient in a ration",
    params(r) {
      // only integer percentages ship, so the printed key re-verifies exactly
      let total = int(r, 3, 12) * 100;
      let part = int(r, 1, total / 50) * 50;
      for (let g = 0; g < 80 && Number.isInteger((100 * part) / total) === false; g++) {
        total = int(r, 3, 12) * 100;
        part = int(r, 1, total / 50) * 50;
      }
      if (!Number.isInteger((100 * part) / total)) {
        total = 800;
        part = 200;
      }
      return { total, part, pct: (100 * part) / total };
    },
    answer: (p) => `${p.pct}%`,
    stem(p) {
      return `A ${p.total} kg feed ration contains ${p.part} kg of groundnut cake. What percentage of the ration is groundnut cake?`;
    },
    distractors(p, r) {
      return pool3(
        r,
        p.pct,
        [100 - p.pct, p.part, ((p.total - p.part) / p.part) * 100, p.pct * 2, p.pct / 2],
        (v) => `${trim(v, 1)}%`,
      );
    },
    explanation(p) {
      return `${p.part}/${p.total} x 100 = ${p.pct}%. The complement is the share of all other ingredients.`;
    },
    hint: () => "Percentage share = ingredient mass / total ration mass x 100.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.part / p.total) * 100) < 0.5;
    },
  },
  {
    id: "plant-population",
    topicSlug: "agriculture",
    label: "Plant population per hectare",
    params(r) {
      const spacingX = pick(r, [25, 50, 60, 75, 90, 100, 150]);
      const spacingY = pick(r, [25, 50, 60, 75, 90, 100, 150]);
      const area = spacingX * spacingY * 100; // cm² per plant x 100 plants per m² scaled
      const population = 10000 / ((spacingX / 100) * (spacingY / 100));
      return { spacingX, spacingY, population: Number.isInteger(population) ? population : Math.round(10000 / ((spacingX / 100) * (spacingY / 100))) };
    },
    answer: (p) => `${p.population} plants/ha`,
    stem(p) {
      return `Maize is planted at a spacing of ${p.spacingX} cm x ${p.spacingY} cm. What is the plant population per hectare? (1 ha = 10 000 m²)`;
    },
    distractors(p, r) {
      const perPlant = (p.spacingX / 100) * (p.spacingY / 100);
      return pool3(r, p.population, [10000 / perPlant, 1000 / perPlant, p.population / 10, p.population * 10, p.population + 100], String).map((v) => `${trim(v, 2)} plants/ha`);
    },
    explanation(p) {
      return `One plant occupies ${perPlant_(p)} m², so per hectare 10 000 / ${perPlant_(p)} = ${p.population} plants/ha. Using 1 000 instead of 10 000 m² undercounts hectare area.`;
      function perPlant_(p) {
        return trim((p.spacingX / 100) * (p.spacingY / 100), 4);
      }
    },
    hint: () => "Population = hectare area / area per plant; convert cm spacing to metres.",
    verify(p, chosen) {
      return parseNum(String(chosen).split("/")[0]) === Math.round(10000 / ((p.spacingX / 100) * (p.spacingY / 100)));
    },
  },
  {
    id: "dose-calculation",
    topicSlug: "agriculture",
    label: "Drug dose from body weight (mg/kg)",
    params(r) {
      const weight = int(r, 10, 40) * 5;
      const mgPerKg = pick(r, [2, 5, 10]);
      return { weight, mgPerKg, dose: (weight * mgPerKg) / 1000 };
    },
    answer: (p) => `${p.dose} g`,
    stem(p) {
      return `A vet prescribes ${p.mgPerKg} mg of drug per kg of body weight. What dose should a ${p.weight} kg goat receive?`;
    },
    distractors(p, r) {
      return pool3(r, p.dose, [p.weight * p.mgPerKg, p.weight, p.dose * 10, p.dose / 10, p.weight + p.mgPerKg], (v) => `${trim(v, 2)} g`);
    },
    explanation(p) {
      return `Dose = ${p.mgPerKg} mg/kg x ${p.weight} kg = ${p.weight * p.mgPerKg} mg = ${p.dose} g. Quoting mg as g inflates the dose 1000-fold.`;
    },
    hint: () => "Multiply the rate by the weight, then convert mg to grams.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.weight * p.mgPerKg) / 1000;
    },
  },
  {
    id: "land-area-rectangle",
    topicSlug: "agriculture",
    label: "Farm area in hectares",
    params(r) {
      const length = int(r, 2, 10) * 50;
      const width = int(r, 2, 10) * 50;
      return { length, width, area: (length * width) / 10000 };
    },
    answer: (p) => `${trim(p.area, 2)} ha`,
    stem(p) {
      return `A rectangular farm measures ${p.length} m by ${p.width} m. What is its area in hectares? (1 ha = 10 000 m²)`;
    },
    distractors(p, r) {
      return pool3(r, p.area, [p.length * p.width, p.length + p.width, p.area * 10, p.area / 10, Math.max(0.01, p.area - 1)], (v) => `${trim(v, 2)} ha`);
    },
    explanation(p) {
      return `Area = ${p.length} x ${p.width} = ${p.length * p.width} m² = ${trim(p.area, 2)} ha (10 000 m² per ha). Quoting square metres as hectares overstates the farm.`;
    },
    hint: () => "Divide square metres by 10 000 for hectares.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.length * p.width) / 10000) < 5e-3;
    },
  },
  recallFamily({
    id: "soil-science",
    topicSlug: "agriculture",
    label: "Soil science",
    hint: "Soil texture, structure and chemistry all affect crop yield.",
    rows: [
      ["Soil is formed by the", "weathering of parent rock", ["burning of waste", "mixing of water", "freezing of air"], "Weathering breaks rock into mineral particles.", "weathering of parent rock"],
      ["The parent rock determines soil", "texture", ["colour only", "smell", "pH only"], "Texture follows the mineral composition.", "texture"],
      ["The main soil separates are", "sand, silt and clay", ["salt, lime and ash", "iron, gold and coal", "water, air and plants"], "Texture comes from the particle mix.", "sand, silt and clay"],
      ["Sandy soils are", "coarse and free-draining", ["sticky and heavy", "fine and waterlogged", "rocky and cold"], "Large pores drain fast.", "coarse and free-draining"],
      ["Clay soils are", "fine and water-retaining", ["coarse and dry", "granular and loose", "sandy and warm"], "Tiny pores hold water tightly.", "fine and water-retaining"],
      ["Loam soil is prized because it", "balances sand, silt and clay", ["is all sand", "is all clay", "is pure rock"], "Loam drains yet retains moisture.", "balances sand, silt and clay"],
      ["Soil pH measures", "acidity or alkalinity", ["moisture content", "temperature", "fertility alone"], "pH runs from acidic to alkaline.", "acidity or alkalinity"],
      ["Crops prefer soils that are", "slightly acidic to neutral", ["strongly acidic", "strongly alkaline", "salt-encrusted"], "Nutrients are available near pH 6-7.", "slightly acidic to neutral"],
      ["Lime is added to soil to", "reduce acidity", ["raise acidity", "kill weeds only", "add nitrogen"], "Lime neutralises acid.", "reduce acidity"],
      ["Humus improves soil by adding", "organic matter", ["acid", "salt", "sand"], "Decomposed matter feeds soil life.", "organic matter"],
      ["Soil organisms such as earthworms", "improve aeration and structure", ["destroy fertility", "remove minerals", "raise acidity only"], "Burrowing aerates the profile.", "improve aeration and structure"],
      ["Nitrogen-fixing bacteria live in nodules on", "legume roots", ["maize roots", "cassava roots", "yam roots"], "Rhizobium partners with legumes.", "legume roots"],
      ["The main nutrients required by crops are", "nitrogen, phosphorus and potassium", ["carbon, oxygen and hydrogen", "gold, silver and iron", "salt, sugar and starch"], "N, P and K are the primary nutrients.", "nitrogen, phosphorus and potassium"],
      ["Yellowing leaves point to a shortage of", "nitrogen", ["phosphorus", "potassium", "calcium only"], "Chlorosis signals N deficiency.", "nitrogen"],
      ["Poor root growth may signal a shortage of", "phosphorus", ["nitrogen only", "magnesium", "sodium"], "P drives root and flower development.", "phosphorus"],
      ["Weak stems and leaf edges scorched suggest a shortage of", "potassium", ["nitrogen", "phosphorus only", "carbon"], "K governs vigour and water use.", "potassium"],
      ["Organic manure", "improves soil structure", ["burns roots at once", "replaces lime always", "kills microbes"], "It builds humus over time.", "improves soil structure"],
      ["Inorganic fertiliser", "supplies nutrients quickly", ["never dissolves", "replaces humus", "lasts for years always"], "Salts feed plants immediately.", "supplies nutrients quickly"],
      ["Erosion by water is worst when", "vegetation is removed", ["cover crops grow", "contours are ploughed", "terraces are built"], "Bare soil washes away.", "vegetation is removed"],
      ["Contour ploughing prevents erosion by", "slowing runoff across a slope", ["ploughing downhill", "burning stubble", "deep flooding"], "Ridges follow the contours.", "slowing runoff across a slope"],
      ["Mulching helps soil by", "conserving moisture and adding humus", ["raising acidity", "blocking roots", "draining too fast"], "Cover protects and feeds.", "conserving moisture and adding humus"],
      ["Crop rotation helps because it", "breaks pest cycles and balances nutrients", ["reduces labour only", "drains the soil", "raises the pH"], "Different crops demand different nutrients.", "breaks pest cycles and balances nutrients"],
      ["Cover cropping protects soil from", "erosion", ["frost only", "sunshine", "birds only"], "Cover shields the bare surface.", "erosion"],
      ["A soil test tells the farmer about", "nutrient levels and pH", ["seed prices", "market demand", "rain forecast"], "It guides fertiliser choice.", "nutrient levels and pH"],
      ["Waterlogging harms roots because it", "blocks air from the soil", ["adds nutrients", "warms the soil", "feeds microbes"], "Roots need oxygen in pore spaces.", "blocks air from the soil"],
      ["Leaching removes", "soluble nutrients below the root zone", ["sand", "stones", "weed seeds"], "Rain washes nutrients down.", "soluble nutrients below the root zone"],
      ["Soil structure refers to", "how particles clump together", ["the colour", "the pH", "the rock type"], "Peds give the soil its structure.", "how particles clump together"],
      ["A hardpan is", "a compacted layer that blocks roots", ["a fertile horizon", "a mulch of straw", "a manure heap"], "Compaction restricts root depth.", "a compacted layer that blocks roots"],
    ],
  }),
  recallFamily({
    id: "crop-production",
    topicSlug: "agriculture",
    label: "Crop production",
    hint: "Crops are classified by use: cereals, legumes, tubers, cash crops.",
    rows: [
      ["Maize, rice and millet are examples of", "cereals", ["legumes", "tubers", "cash crops"], "Cereals supply carbohydrate grains.", "cereals"],
      ["Cowpea, soybean and groundnut are", "legumes", ["cereals", "tubers", "fibres"], "Legumes fix nitrogen and supply protein.", "legumes"],
      ["Cassava, yam and potato are", "tubers", ["cereals", "legumes", "vegetables"], "They store food underground.", "tubers"],
      ["Cocoa, coffee and cotton are", "cash crops", ["cereals", "legumes", "root crops"], "They are grown mainly for sale.", "cash crops"],
      ["The part of the maize plant that develops into the grain is the", "cob", ["tassel", "silk", "leaf sheath"], "Kernels form on the cob after pollination.", "cob"],
      ["Vegetative propagation uses", "plant parts such as stems or roots", ["seeds", "flowers only", "pollen only"], "Cassava stems and yam setts reproduce clones.", "plant parts such as stems or roots"],
      ["A seed nursery is used to", "raise seedlings before transplanting", ["store grains", "dry crops", "mill rice"], "It gives young plants a protected start.", "raise seedlings before transplanting"],
      ["Transplanting is common in", "rice and tomato", ["maize and cowpea", "sorghum and millet", "groundnut and cotton"], "Seedlings are moved to the field.", "rice and tomato"],
      ["Monoculture means", "growing one crop over an area", ["mixing many crops", "planting trees", "fallowing land"], "It simplifies management but risks pests.", "growing one crop over an area"],
      ["Mixed farming involves", "crops and livestock together", ["only crops", "only fish", "only poultry"], "The two enterprises support each other.", "crops and livestock together"],
      ["Intercropping means", "growing two crops on the same field", ["one crop only", "grazing cattle", "storing grains"], "It can raise total yield per hectare.", "growing two crops on the same field"],
      ["Harvesting should occur when", "the crop reaches physiological maturity", ["the rain starts", "the birds arrive", "the market peaks only"], "Maturity maximises yield and quality.", "the crop reaches physiological maturity"],
      ["Grains are dried before storage to", "prevent mould growth", ["increase weight", "attract pests", "speed sprouting"], "Dry grain keeps better.", "prevent mould growth"],
      ["A silo is used for", "bulk grain storage", ["water storage", "manure storage", "tool storage"], "It protects grain from pests.", "bulk grain storage"],
      ["Rhizomes of ginger are stored", "in cool dry conditions", ["in flooded fields", "in direct sun", "under leaking roofs"], "Damp storage rots rhizomes.", "in cool dry conditions"],
      ["Land preparation for a nursery bed begins with", "clearing and tillage", ["harvesting", "threshing", "marketing"], "A fine tilth is prepared first.", "clearing and tillage"],
      ["The plant spacing question asks about", "distance between and within rows", ["seed colour", "market price", "wind speed"], "Spacing sets plant population.", "distance between and within rows"],
      ["Irrigation supplements", "rainfall for crops", ["soil fertility", "pest control", "seed quality"], "It supplies water in dry spells.", "rainfall for crops"],
      ["Drip irrigation delivers water", "drop by drop to the roots", ["by flooding fields", "by rainfall", "by overhead sprinklers"], "It wastes least water.", "drop by drop to the roots"],
      ["Furrow irrigation channels water", "along trenches between beds", ["over the leaves", "into storage silos", "onto roads"], "It floods the furrows.", "along trenches between beds"],
      ["The first stage of growing a crop is", "land clearing and preparation", ["harvesting", "threshing", "marketing"], "The field must be prepared first.", "land clearing and preparation"],
      ["A green manure crop is", "ploughed in to enrich soil", ["sold in market", "fed to cattle", "burned for ash"], "It adds organic matter when ploughed under.", "ploughed in to enrich soil"],
      ["Legumes in rotation add", "nitrogen to the soil", ["phosphorus", "potassium", "calcium"], "Their nodules fix atmospheric nitrogen.", "nitrogen to the soil"],
      ["A seed is made up of", "embryo, endosperm and seed coat", ["roots only", "leaves only", "flowers only"], "These parts feed and protect the embryo.", "embryo, endosperm and seed coat"],
      ["The embryo of a seed develops into", "the seedling", ["the fruit", "the flower", "the seed coat"], "It grows into the young plant.", "the seedling"],
      ["Pollination in cereals relies mostly on", "wind", ["insects", "water", "birds"], "Maize and rice are wind-pollinated.", "wind"],
      ["A fruit develops from the", "ovary of a flower", ["the root", "the stem", "the leaf"], "Fertilised ovaries become fruits.", "ovary of a flower"],
      ["Weeds compete with crops for", "nutrients, water and light", ["only shade", "only air", "only birds"], "They drain the same resources.", "nutrients, water and light"],
    ],
  }),
  recallFamily({
    id: "pests-and-diseases",
    topicSlug: "agriculture",
    label: "Pests and diseases",
    hint: "Name the pest or pathogen class before choosing control.",
    rows: [
      ["A grasshopper eating maize leaves is a", "field pest", ["storage pest", "soil pest only", "parasite"], "It feeds in the field on the crop.", "field pest"],
      ["Weevils boring into stored grains are", "storage pests", ["field pests", "pollinators", "predators"], "They damage grain in stores.", "storage pests"],
      ["Pod borers in cowpea attack", "the pods", ["the roots", "the leaves only", "the flowers only"], "Larvae tunnel in the pods.", "the pods"],
      ["Birds and rodents that raid fields are", "pests", ["pollinators", "predators", "soil organisms"], "Vertebrate pest groups raid fields and stores for food.", "pests"],
      ["A fungal disease showing leaf rust spots is", "cereal rust", ["mosaic virus", "bacterial wilt", "root rot"], "Rust pustules mark foliage.", "cereal rust"],
      ["Cassava mosaic is caused by a", "virus", ["bacterium", "fungus", "nematode"], "Mosaics are viral and spread by vectors.", "virus"],
      ["Bacterial wilt in bananas is spread by", "contaminated tools", ["wind only", "birds", "sunlight"], "Tools move bacteria between plants.", "contaminated tools"],
      ["A nematode attacks", "plant roots", ["only leaves", "only flowers", "only fruits"], "Eelworms feed on root tissue.", "plant roots"],
      ["Aphids damage crops by", "sucking sap and spreading virus", ["chewing stems at night", "eating roots", "pollinating flowers"], "They pierce and suck the phloem.", "sucking sap and spreading virus"],
      ["Caterpillars feed by", "chewing leaves", ["sucking sap", "mining stems only", "eating roots only"], "Larvae of moths chew foliage.", "chewing leaves"],
      ["The best control for storage pests begins with", "clean, dry stores", ["water sprays", "open windows", "fresh straw"], "Clean dry stores deny shelter and moisture.", "clean, dry stores"],
      ["Crop rotation breaks pest cycles because", "pests lose their host", ["pests fly away", "cows eat them", "rain kills them"], "Removing the host starves the pest.", "pests lose their host"],
      ["Biological pest control uses", "natural enemies", ["more chemicals", "burning crops", "salting soil"], "Predators and parasitoids suppress pests.", "natural enemies"],
      ["A pesticide that kills insects is", "an insecticide", ["a herbicide", "a fungicide", "a nematicide"], "It targets insect pests.", "an insecticide"],
      ["A chemical that kills weeds is", "a herbicide", ["insecticide", "fungicide", "rodenticide"], "It targets unwanted plants.", "a herbicide"],
      ["A fungicide controls", "fungal diseases", ["insect pests", "weeds", "rodents"], "It targets fungal pathogens.", "fungal diseases"],
      ["Quarantine of plants checks the spread by", "blocking movement of infected material", ["spraying farms", "burning markets", "closing rain"], "It stops the pest at the border.", "blocking movement of infected material"],
      ["Resistant crop varieties work because they", "carry genes the pest tolerates poorly", ["repel all chemicals", "grow faster only", "need no water"], "Tolerance limits pest damage.", "carry genes the pest tolerates poorly"],
      ["Scouting means", "checking fields for early pest signs", ["waiting for harvest", "spraying blindly", "burning straw"], "Monitoring triggers timely control.", "checking fields for early pest signs"],
      ["Integrated pest management combines", "cultural, biological and chemical control", ["only chemicals", "only fire", "only hand-picking"], "IPM blends methods to cut chemical use.", "cultural, biological and chemical control"],
      ["A symptom of viral disease in crops includes", "mottled or mosaic leaves", ["rust pustules", "chewed holes", "galls on roots"], "Mosaics point to viruses.", "mottled or mosaic leaves"],
      ["A gall on a root is caused by", "nematodes", ["viruses", "rust fungi", "aphids"], "Root-knot nematodes cause galls.", "nematodes"],
      ["Damping-off of seedlings is caused by", "soil fungi", ["wind damage", "sun scald", "bird pecking"], "Fungi rot the stem at soil level.", "soil fungi"],
      ["Wilt diseases make plants", "droop from water loss in the stem", ["grow taller", "flower early", "turn yellow only"], "Blocked xylem collapses turgor.", "droop from water loss in the stem"],
      ["Rodents in stores are controlled by", "traps and clean stores", ["watering the grain", "leaving grain uncovered", "open sacks"], "Traps plus hygiene cut losses.", "traps and clean stores"],
      ["Striga (witchweed) attacks", "cereal roots", ["cassava stems", "maize leaves", "cowpea pods"], "It parasitises cereal roots.", "cereal roots"],
      ["Tsetse flies transmit", "trypanosomiasis in livestock", ["maize streak", "cassava mosaic", "cocoa black pod"], "The disease is livestock, not crop.", "trypanosomiasis in livestock"],
      ["Timely weeding helps because weeds", "harbour pests too", ["feed the soil only", "attract rain", "shade crops well"], "They host pests as well as compete.", "harbour pests too"],
    ],
  }),
  recallFamily({
    id: "livestock-husbandry",
    topicSlug: "agriculture",
    label: "Animal husbandry",
    hint: "Breeds, feeds, housing and health keep livestock productive.",
    rows: [
      ["Animal husbandry is the", "care and breeding of farm animals", ["growing of crops", "building of roads", "catching of fish"], "It covers livestock management.", "care and breeding of farm animals"],
      ["The White Fulani is a breed of", "cattle", ["sheep", "goats", "poultry"], "It is a trypanotolerant zebu cattle breed.", "cattle"],
      ["The West African Dwarf is a breed of", "goat and sheep", ["cattle", "pig", "rabbit"], "It is a small ruminant breed.", "goat and sheep"],
      ["The Large White is a breed of", "pig", ["cattle", "goat", "sheep"], "It is an improved pig breed.", "pig"],
      ["Roughages are feeds that", "are high in fibre", ["are high in protein", "are all grains", "are all minerals"], "Grass and hay form the roughage base.", "are high in fibre"],
      ["Concentrates are feeds", "low in fibre and high in energy", ["fresh grass", "maize stalks", "water only"], "Grains and cakes are concentrates.", "low in fibre and high in energy"],
      ["Minerals in animal feeds are needed for", "bone and metabolic health", ["energy only", "fibre only", "water only"], "They support bone and enzyme function.", "bone and metabolic health"],
      ["Colostrum is important to newborn animals because it", "carries antibodies", ["is a medicine for worms", "gives no value", "keeps them awake"], "First milk transfers immunity.", "carries antibodies"],
      ["Ruminants such as cattle digest cellulose in the", "rumen", ["gizzard", "crop", "proventriculus"], "Microbes ferment fibre in the rumen.", "rumen"],
      ["Poultry digest food partly in the", "gizzard", ["rumen", "caecum only", "stomach only"], "The gizzard grinds food mechanically.", "gizzard"],
      ["Dual-purpose cattle are kept for", "meat and draught", ["milk only", "eggs", "wool"], "They serve two purposes.", "meat and draught"],
      ["The exotic layers kept for eggs include the", "Rhode Island Red", ["White Fulani", "Red Sokoto", "Boer"], "It is an egg-producing breed.", "Rhode Island Red"],
      ["Crossbreeding aims to", "combine traits from two breeds", ["reduce fertility", "slow growth", "raise costs"], "Hybrid vigour improves production.", "combine traits from two breeds"],
      ["Record keeping on a farm helps the farmer to", "track performance and costs", ["rest more", "skip markets", "avoid vaccines"], "Records guide decisions.", "track performance and costs"],
      ["Poultry litter is useful as", "manure", ["feed", "medicine", "bedding for fish"], "It is rich in nutrients for soil.", "manure"],
      ["Vaccination of chicks is done against", "Newcastle disease", ["drought", "heat", "floods"], "Newcastle is a major poultry disease.", "Newcastle disease"],
      ["Culling means", "removing unproductive animals", ["feeding supplements", "washing pens", "buying feeds"], "It removes poor performers.", "removing unproductive animals"],
      ["A weaner is a", "young animal newly taken off milk", ["old bull", "pregnant cow", "laying hen"], "It has just been weaned.", "young animal newly taken off milk"],
      ["Gestation is the period of", "pregnancy", ["milk flow", "rest", "moulting"], "It runs from conception to birth.", "pregnancy"],
      ["Heat detection in cattle shows", "readiness to mate", ["illness", "hunger", "thirst"], "Oestrus marks mating time.", "readiness to mate"],
      ["Artificial insemination collects semen and", "deposits it in the female", ["feeds it to stock", "stores it as feed", "mixes it with milk"], "It achieves conception without mating.", "deposits it in the female"],
      ["Deep-litter poultry housing uses", "bedding material on the floor", ["battery cages only", "open fields", "water pens"], "Litter absorbs droppings.", "bedding material on the floor"],
      ["Battery cages are used mainly for", "laying hens", ["day-old chicks", "broilers", "bulls"], "They ease egg collection.", "laying hens"],
      ["Milking should be done", "cleanly with clean utensils", ["in the dusty pen", "with wet hands", "once a month"], "Hygiene protects milk quality.", "cleanly with clean utensils"],
      ["Pasteurised milk has been", "heat-treated to kill pathogens", ["frozen", "diluted", "sweetened"], "Heat secures the milk.", "heat-treated to kill pathogens"],
      ["A brooder provides", "warmth for chicks", ["shade for cattle", "water for fish", "feed for goats"], "Chicks need artificial heat.", "warmth for chicks"],
      ["Beak trimming in poultry prevents", "cannibalism", ["egg eating only", "dust bathing", "feather growth"], "It curbs pecking injuries.", "cannibalism"],
      ["Deworming controls", "internal parasites", ["external ticks only", "flies only", "fungi"], "Anthelmintics clear worms.", "internal parasites"],
    ],
  }),
  recallFamily({
    id: "agricultural-economics",
    topicSlug: "agriculture",
    label: "Agricultural economics and extension",
    hint: "Farming is a business as well as a science.",
    rows: [
      ["Agricultural economics applies economics to", "farming decisions", ["weather control", "seed colour", "soil smell"], "It studies choices on the farm.", "farming decisions"],
      ["Agricultural extension helps farmers by", "sharing new knowledge", ["buying their crops", "taxing them", "writing laws"], "Extension agents teach practice.", "sharing new knowledge"],
      ["An extension agent works mainly to", "advise farmers", ["sell land", "print money", "judge disputes"], "Advice is the extension core job.", "advise farmers"],
      ["The demand for farm produce is affected by", "population and income", ["soil colour", "wind", "rainfall"], "Buyers drive demand.", "population and income"],
      ["Perishable produce should be sold", "quickly or processed", ["after months", "only at funerals", "by barter only"], "Time spoils fresh produce.", "quickly or processed"],
      ["Farm records include", "production and financial records", ["weather folklore", "market gossip", "birthday cards"], "They track output and money.", "production and financial records"],
      ["A marketing board", "regulates sale of farm produce", ["makes laws", "prints money", "rains on farms"], "It stabilises marketing.", "regulates sale of farm produce"],
      ["Seasonality of supply affects farm prices because", "harvests arrive in gluts", ["buyers vanish", "crops change colour", "rains stop"], "Gluts lower prices.", "harvests arrive in gluts"],
      ["Processing farm produce", "adds value and shelf life", ["reduces weight always", "raises taxes", "spoils food"], "It extends storage and sale.", "adds value and shelf life"],
      ["Cooperative farming lets farmers", "pool resources", ["compete alone", "share debts", "hide records"], "They buy and sell together.", "pool resources"],
      ["A farm budget compares", "costs with expected returns", ["births with deaths", "rain with sun", "seeds with stones"], "It plans profit.", "costs with expected returns"],
      ["Smallholder farmers dominate Nigerian production because", "they are numerous", ["they use drones", "they own factories", "they export oil"], "Numbers favour smallholders.", "they are numerous"],
      ["Mechanisation raises output by", "replacing hand labour with machines", ["hiring more hands", "planting less", "spraying less"], "Machines speed field work.", "replacing hand labour with machines"],
      ["The risk of monoculture includes", "widespread pest or disease loss", ["higher diversity", "stabler prices", "lower labour"], "One pest can ruin all.", "widespread pest or disease loss"],
      ["Insurance for farmers covers", "losses from crop or livestock failure", ["school fees", "road repairs", "party dues"], "It cushions farm risk.", "losses from crop or livestock failure"],
      ["A subsidy is a", "government payment that lowers cost", ["tax on inputs", "fine", "loan to banks"], "It supports production.", "government payment that lowers cost"],
      ["Labour on a farm includes", "family and hired workers", ["only machines", "only buyers", "only the rain"], "Human effort is labour.", "family and hired workers"],
      ["Capital in agriculture includes", "tools, machines and money", ["only land", "only rain", "only seeds"], "Durable inputs are capital.", "tools, machines and money"],
      ["The entrepreneur in farming", "organises the other factors", ["only tills the soil", "only sells seeds", "only rains"], "They carry the risk and plan.", "organises the other factors"],
      ["Post-harvest loss is reduced by", "good storage and processing", ["waiting for prices", "open storage", "wet packing"], "Care after harvest protects yield.", "good storage and processing"],
      ["A market channel is the", "path produce takes to the buyer", ["seed variety", "soil type", "weather pattern"], "It links farm to market.", "path produce takes to the buyer"],
      ["A glut lowers price because", "supply exceeds demand", ["demand falls to zero", "buyers vanish", "rain stops"], "Surplus pressures prices down.", "supply exceeds demand"],
      ["Greenhouse farming controls", "temperature and moisture", ["soil colour", "wind direction", "farm laws"], "It shelters the microclimate.", "temperature and moisture"],
      ["Hydroponics grows plants", "without soil in nutrient solution", ["in deep water only", "on rocks only", "in sand only"], "Roots sit in nutrient solution.", "without soil in nutrient solution"],
      ["Precision agriculture uses data to", "target inputs precisely", ["plant randomly", "ignore soil", "spray everywhere"], "Data focuses each input.", "target inputs precisely"],
      ["A value chain in agriculture covers", "all steps from input to consumer", ["only planting", "only harvest", "only sale"], "It spans the whole flow.", "all steps from input to consumer"],
      ["The seasonal nature of farming makes", "storage and credit important", ["taxes higher", "laws weaker", "rain fall more"], "Time gaps need bridging.", "storage and credit important"],
      ["Sustainable agriculture seeks to", "keep producing without exhausting resources", ["maximise output this year", "clear forests", "mine water"], "It protects future yields.", "keep producing without exhausting resources"],
    ],
  }),
];
