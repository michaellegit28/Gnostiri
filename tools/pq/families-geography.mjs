/**
 * Geography families (round 2, JAMB pool).
 * Computable families re-derive from the statement (map scale, longitude,
 * gradient, density...); recall tables use the dual-answer contract.
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

export const families = [
  {
    id: "map-scale-distance",
    topicSlug: "geography",
    label: "Map scale: converting between map and ground",
    params(r) {
      const scale = pick(r, [1, 2, 5, 10, 50, 100]) * 50000;
      const cm = int(r, 2, 20);
      return { scale, cm, km: (scale * cm) / 100000 };
    },
    answer: (p) => `${trim(p.km, 2)} km`,
    stem(p) {
      return `On a map of scale 1 : ${p.scale.toLocaleString("en-NG")}, two towns are ${p.cm} cm apart. What is the actual distance on the ground?`;
    },
    distractors(p, r) {
      return pool3(r, p.km, [p.cm * (p.scale / 1000), p.cm * p.scale, p.k, p.km * 2, Math.max(0.05, p.km / 2)], (v) => `${trim(v, 2)} km`).filter((v) => v !== trim(p.km, 2));
    },
    explanation(p) {
      return `Ground distance = map distance x scale = ${p.cm} cm x ${p.scale.toLocaleString("en-NG")} = ${(p.scale * p.cm).toLocaleString("en-NG")} cm = ${trim(p.km, 2)} km (100 000 cm = 1 km).`;
    },
    hint: () => "Multiply the map measurement by the scale factor, then convert cm to km.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.scale * p.cm) / 100000) < 5e-3;
    },
  },
  {
    id: "longitude-time",
    topicSlug: "geography",
    label: "Longitude and time difference",
    params(r) {
      const degrees = int(r, 2, 24) * 5;
      const hours = degrees / 15;
      return { degrees, hours: Number.isInteger(hours) ? hours : degrees / 15 };
    },
    answer: (p) => `${p.hours} hours`,
    stem(p) {
      return `Two towns lie on the same latitude, ${p.degrees}° apart in longitude. What is the time difference between them? (15° = 1 hour)`;
    },
    distractors(p, r) {
      return pool3(r, p.hours, [p.degrees * 15, p.degrees, 24 - p.hours, p.hours * 2, Math.max(0.1, p.hours - 1)], String).map((v) => `${v} hours`);
    },
    explanation(p) {
      return `${p.degrees}° / 15° per hour = ${trim(p.hours, 2)} hours. Multiplying by 15 inverts the rule.`;
    },
    hint: () => "The Earth turns 15° per hour; divide the longitude difference by 15.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.degrees / 15) < 5e-3;
    },
  },
  {
    id: "latitude-distance",
    topicSlug: "geography",
    label: "Latitude difference to distance (1° = 111 km)",
    params(r) {
      const degrees = int(r, 2, 30);
      return { degrees, km: degrees * 111 };
    },
    answer: (p) => `${p.km} km`,
    stem(p) {
      return `Two places lie on the same meridian, ${p.degrees}° apart in latitude. How far apart are they? (1° of latitude = 111 km)`;
    },
    distractors(p, r) {
      return pool3(r, p.km, [p.degrees, p.degrees * 15, p.km / 2, p.km * 2, p.degrees * 100], String).map((v) => `${v} km`);
    },
    explanation(p) {
      return `${p.degrees}° x 111 km per degree = ${p.km} km. The 15° figure belongs to TIME zones, not distance.`;
    },
    hint: () => "Along a meridian, each degree of latitude spans about 111 km.",
    verify(p, chosen) {
      return parseNum(chosen) === p.degrees * 111;
    },
  },
  {
    id: "contour-gradient",
    topicSlug: "geography",
    label: "Gradient from contours",
    params(r) {
      const rise = int(r, 2, 20) * 50;
      const run = int(r, 2, 10) * 500;
      return { rise, run, gradient: rise / run };
    },
    answer: (p) => `1 : ${p.gradient === Math.floor(p.gradient) ? Math.round(1 / p.gradient) : trim(1 / p.gradient, 2)}`,
    stem(p) {
      return `Two points on a map are separated by ${p.run} m horizontally and a rise of ${p.rise} m. What is the gradient between them?`;
    },
    distractors(p, r) {
      const ratio = p.rise / p.run;
      const pool = [ratio * 2, 1 / ratio, ratio / 2, p.run / p.rise, p.rise].filter((v) => v > 0 && Math.abs(v - ratio) > 1e-9);
      return pool3(r, ratio, pool, (v) => `1 : ${trim(1 / v, 2)}`);
    },
    explanation(p) {
      return `Gradient = rise / run = ${p.rise}/${p.run} = 1 : ${trim(p.run / p.rise, 2)}. Inverting the ratio states the wrong side of the slope.`;
    },
    hint: () => "Gradient = vertical interval / horizontal equivalent.",
    verify(p, chosen) {
      const m = String(chosen).match(/1\s*:\s*([\d.]+)/);
      if (!m) return false;
      return Math.abs(Number(m[1]) - p.run / p.rise) < 5e-3;
    },
  },
  {
    id: "population-density",
    topicSlug: "geography",
    label: "Population density",
    params(r) {
      const people = int(r, 20, 90) * 100000;
      const area = int(r, 5, 40) * 100;
      return { people, area, density: Math.round(people / area) };
    },
    answer: (p) => `${p.density} persons/km²`,
    stem(p) {
      return `A city of ${(p.people / 1000000).toLocaleString("en-NG")} million people covers an area of ${p.area} km². What is its population density?`;
    },
    distractors(p, r) {
      return pool3(r, p.density, [p.people * p.area, p.people - p.area, p.density / 2, p.density * 10, p.area], String).map((v) => `${v} persons/km²`);
    },
    explanation(p) {
      return `Density = population / area = ${(p.people / 1000000).toLocaleString("en-NG")}m / ${p.area} km² = ${p.density} persons/km². Multiplying the two gives neither people nor area.`;
    },
    hint: () => "Density = population divided by land area.",
    verify(p, chosen) {
      return parseNum(chosen) === Math.round(p.people / p.area);
    },
  },
  {
    id: "natural-increase",
    topicSlug: "geography",
    label: "Natural increase of population",
    params(r) {
      const birth = pick(r, [30, 35, 40, 45]);
      const death = pick(r, [10, 12, 15, 18, 20]);
      const migrationNet = pick(r, [-5, 0, 0, 3, 5]);
      return { birth, death, migrationNet, increase: birth - death + migrationNet };
    },
    answer: (p) => `${p.birth - p.death} per 1000`,
    stem(p) {
      return `A country records ${p.birth} births, ${p.death} deaths and net migration of ${p.migrationNet} per thousand. What is the rate of natural increase (excluding migration)?`;
    },
    distractors(p, r) {
      return pool3(r, p.birth - p.death, [p.birth - p.death + p.migrationNet, p.birth + p.death, p.birth, p.death, (p.birth - p.death) / 2], String).map((v) => `${v} per 1000`);
    },
    explanation(p) {
      return `Natural increase = birth rate − death rate = ${p.birth} − ${p.death} = ${p.birth - p.death} per 1000. Net MIGRATION is a separate component of population change.`;
    },
    hint: () => "Natural increase counts only births and deaths.",
    verify(p, chosen) {
      return parseNum(String(chosen).split(" per ")[0]) === p.birth - p.death;
    },
  },
  {
    id: "river-discharge",
    topicSlug: "geography",
    label: "River discharge: width x depth x velocity",
    params(r) {
      const width = int(r, 2, 12) * 5;
      const depth = int(r, 2, 8) * 0.5;
      const velocity = int(r, 1, 4);
      return { width, depth, velocity, discharge: width * depth * velocity };
    },
    answer: (p) => `${p.discharge} m³/s`,
    stem(p) {
      return `A river channel is ${p.width} m wide, ${trim(p.depth, 1)} m deep and the mean velocity is ${p.velocity} m/s. What is the discharge?`;
    },
    distractors(p, r) {
      return pool3(r, p.discharge, [p.width * p.depth, p.width * p.velocity, p.depth * p.velocity, p.discharge * 2, Math.max(1, p.discharge / 2)], String).map((v) => `${v} m³/s`);
    },
    explanation(p) {
      return `Discharge = cross-section x velocity = (${p.width} x ${trim(p.depth, 1)}) x ${p.velocity} = ${p.discharge} m³/s. Area alone is not a discharge.`;
    },
    hint: () => "Discharge = volume of water passing per second.",
    verify(p, chosen) {
      return parseNum(chosen) === p.width * p.depth * p.velocity;
    },
  },
  {
    id: "temperature-lapse",
    topicSlug: "geography",
    label: "Environmental lapse rate (6.5°C per 1000 m)",
    params(r) {
      const base = int(r, 20, 34);
      const height = int(r, 2, 20) * 500;
      return { base, height, summit: base - (height / 1000) * 6.5 };
    },
    answer: (p) => `${trim(p.summit, 1)} °C`,
    stem(p) {
      return `The temperature at the foot of a mountain is ${p.base} °C. What is the temperature at the summit, ${p.height} m above the foot? (environmental lapse rate = 6.5 °C per 1000 m)`;
    },
    distractors(p, r) {
      return pool3(r, p.summit, [p.base + (p.height / 1000) * 6.5, p.base, p.base - p.height, p.summit + 1, p.base - (p.height / 1000)], (v) => `${trim(v, 1)} °C`);
    },
    explanation(p) {
      return `Temperature falls ${trim((p.height / 1000) * 6.5, 1)} °C over ${p.height} m, so the summit reads ${trim(p.summit, 1)} °C. Heating with altitude reverses the lapse rate.`;
    },
    hint: () => "Divide the height by 1000, then multiply by 6.5 °C and subtract.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.base - (p.height / 1000) * 6.5)) < 0.06;
    },
  },
  recallFamily({
    id: "map-reading",
    topicSlug: "geography",
    label: "Map reading and representation",
    hint: "Scale, direction and symbols carry the map's information.",
    rows: [
      ["A map is a representation of the earth drawn", "to scale on a flat surface", ["to full size", "in words", "in photographs only"], "Maps reduce and flatten reality on a paper.", "to scale on a flat surface"],
      ["The map ratio 1 : 50 000 means", "1 cm on the map is 500 m on the ground", ["1 cm is 50 m", "1 cm is 5 km", "1 cm is 50 km"], "Multiply cm by 50 000 then convert to metres.", "1 cm on the map is 500 m on the ground"],
      ["A large-scale map covers", "a small area in detail", ["a large area", "the whole world", "one continent"], "Large scale shows fine detail of a small area.", "a small area in detail"],
      ["A small-scale map shows", "a large area with little detail", ["a small estate", "a street", "a farm"], "Small scale condenses the world.", "a large area with little detail"],
      ["Contour lines join points", "of equal height", ["of equal rain", "of equal population", "of equal soil"], "They trace elevation.", "of equal height"],
      ["Close contour lines indicate", "steep slopes", ["gentle slopes", "flat land", "a river"], "Tight spacing means rapid height change.", "steep slopes"],
      ["Conventional signs on a map are", "standard symbols", ["random marks", "colours only", "grid lines only"], "They stand for features.", "standard symbols"],
      ["A grid reference system uses", "northings and eastings", ["latitude only", "longitude only", "compass points only"], "Grid squares locate features precisely.", "northings and eastings"],
      ["Latitude is measured", "north and south of the equator", ["east and west of Greenwich", "from the poles", "from the sea"], "Parallels of latitude run east-west.", "north and south of the equator"],
      ["Longitude is measured", "east and west of the prime meridian", ["north and south of the equator", "from the poles", "from map edges"], "Meridians run north-south.", "east and west of the prime meridian"],
      ["The prime meridian passes through", "Greenwich", ["Paris", "Rome", "Cairo"], "0° longitude sits at Greenwich.", "Greenwich"],
      ["The equator is", "0° latitude", ["0° longitude", "23.5° north", "66.5° south"], "It divides the hemispheres north-south.", "0° latitude"],
      ["The Tropic of Cancer lies at", "23.5°N", ["0°", "23.5°S", "66.5°N"], "The tropics bound the sun's apparent range.", "23.5°N"],
      ["A bearing is measured", "clockwise from north", ["anticlockwise from north", "from the south", "from the sun"], "Compass bearings run 0-360 from north.", "clockwise from north"],
      ["North on a compass points towards", "the magnetic north pole", ["the equator", "the sun", "true south"], "Compass needles seek magnetic north.", "the magnetic north pole"],
      ["A relief model shows", "height in three dimensions", ["rain patterns", "population density", "soil types"], "It models the terrain.", "height in three dimensions"],
      ["A choropleth map shades areas", "to show a statistical variable", ["to show relief", "to show wind", "to show the equator"], "Shading encodes data ranges.", "to show a statistical variable"],
      ["An atlas is a", "collection of maps", ["single map", "textbook only", "satellite image"], "It gathers maps in bound form.", "collection of maps"],
      ["GIS stands for", "geographic information system", ["geological index survey", "global imagery service", "gradient integration system"], "It stores and analyses spatial data.", "geographic information system"],
      ["Remote sensing gathers data", "from satellites and aircraft", ["from soil pits", "from interviews", "from market surveys"], "Sensors image the earth from above.", "from satellites and aircraft"],
      ["A cross-section shows", "the shape of the ground along a line", ["the whole map area", "rain totals", "population"], "It slices the relief vertically.", "the shape of the ground along a line"],
      ["A sketch map is", "a simple approximate drawing", ["an accurate survey", "a satellite photo", "a statistical table"], "It captures essentials only.", "a simple approximate drawing"],
      ["Scale bar on a map gives", "a visual measuring aid", ["wind direction", "height of hills", "soil colour"], "It lets distances be read off.", "a visual measuring aid"],
      ["Vertical interval on a map is", "the height between contours", ["the width between rivers", "the length of roads", "the colour of the map"], "It sets the contour spacing.", "the height between contours"],
      ["A spot height marks", "the height of one point", ["a line of equal height", "a river crossing", "a road"], "It is a point height.", "the height of one point"],
      ["A trig point is", "a survey marker at a known position", ["a contour corner", "a river bend", "a footpath"], "Survey stations anchor the mapping.", "a survey marker at a known position"],
      ["Geographical coordinates are", "latitude and longitude", ["height and depth", "area and volume", "colour and size"], "They give an absolute position.", "latitude and longitude"],
      ["A map key explains", "symbols used on the map", ["the history", "the prices", "the climate"], "The key decodes the signs.", "symbols used on the map"],
    ],
  }),
  recallFamily({
    id: "rocks-landforms",
    topicSlug: "geography",
    label: "Rocks and landforms",
    hint: "Rock origin: igneous, sedimentary or metamorphic.",
    rows: [
      ["Igneous rocks form from", "cooling magma or lava", ["compressed sediments", "altered rocks", "plant remains"], "They crystallise from molten rock.", "cooling magma or lava"],
      ["Granite is an example of", "igneous rock", ["sedimentary rock", "metamorphic rock", "organic rock"], "It is intrusive and coarse-grained.", "igneous rock"],
      ["Sedimentary rocks form from", "deposited and compacted layers", ["molten rock", "heat and pressure", "volcanic ash only"], "Layering is their signature.", "deposited and compacted layers"],
      ["Limestone is which kind of rock?", "sedimentary", ["igneous", "metamorphic", "plutonic"], "It precipitates or builds from shells.", "sedimentary"],
      ["Marble forms when limestone is", "metamorphosed by heat and pressure", ["melted and cooled", "eroded", "deposited"], "Marble is limestone recrystallised.", "metamorphosed by heat and pressure"],
      ["Metamorphic rocks are changed by", "heat and pressure", ["erosion only", "melting only", "weathering only"], "Existing rocks are transformed in place.", "heat and pressure"],
      ["The rock cycle describes", "the transformation of rocks among the three families", ["rock erosion only", "rock colour changes", "rock painting"], "Rocks convert continuously.", "the transformation of rocks among the three families"],
      ["A mountain formed by folding is called", "a fold mountain", ["a block mountain", "a residual mountain", "a volcanic mountain"], "Compression folds the crust.", "a fold mountain"],
      ["A block mountain forms when", "the crust drops between faults", ["lava piles up", "rock dissolves", "sand drifts"], "Faulting creates the steep blocks.", "the crust drops between faults"],
      ["A volcanic mountain is built by", "erupted lava and ash", ["folded sediments", "eroded plateaus", "wind deposits"], "Eruptions build cones.", "erupted lava and ash"],
      ["Weathering that breaks rock by freezing water is", "freeze-thaw weathering", ["chemical weathering", "oxidation", "carbonation"], "Water expands in cracks as it freezes.", "freeze-thaw weathering"],
      ["Dissolving of limestone by rainwater is", "carbonation", ["freeze-thaw", "exfoliation", "granular disintegration"], "Weak acid dissolves carbonate rock.", "carbonation"],
      ["Peeling of rock layers in hot deserts is", "exfoliation", ["carbonation", "hydration", "solution"], "Day-night stresses shed shells.", "exfoliation"],
      ["Mass movement of saturated soil down a slope is", "a landslide or mudflow", ["a meander", "a fault", "a rift"], "Gravity plus water triggers flow.", "a landslide or mudflow"],
      ["A river'sDrainage pattern in dendritic form resembles", "tree branches", ["rings", "grid squares", "spokes"], "Dendritic means branching.", "tree branches"],
      ["A V-shaped valley is typical of a river's", "upper course", ["middle course", "lower course", "mouth"], "Downcutting dominates early.", "upper course"],
      ["Meanders are large bends found mainly in the", "middle and lower course", ["upper course", "source", "waterfall"], "Lateral erosion builds them.", "middle and lower course"],
      ["An ox-bow lake forms when a meander", "is cut off", ["deepens", "floods", "dries up"], "Erosion severs the neck.", "is cut off"],
      ["A waterfall develops where a", "hard rock overlies soft rock", ["plain is flat", "river is slow", "lake is deep"], "Differential erosion undercuts the cap.", "hard rock overlies soft rock"],
      ["A braided channel forms where", "the river is overloaded with sediment", ["water is scarce", "the bed is solid rock", "the valley is narrow"], "Deposits split the channel.", "the river is overloaded with sediment"],
      ["A delta forms where a river", "deposits sediment at its mouth", ["cuts a gorge", "meanders widely", "flows underground"], "Sediment builds lobes at the mouth.", "deposits sediment at its mouth"],
      ["The load carried by rolling along the bed is", "traction", ["suspension", "solution", "saltation"], "Traction rolls heavy particles.", "traction"],
      ["Particles bounced along the bed are moved by", "saltation", ["traction", "suspension", "solution"], "Saltation hops grains forward.", "saltation"],
      ["A levee is a natural", "embankment of deposited sediment", ["waterfall", "gorge", "ox-bow lake"], "Floods pile coarse sediment near banks.", "embankment of deposited sediment"],
      ["A flood plain is formed by", "repeated flooding depositing silt", ["glaciers", "volcanic ash", "sea level fall"], "Alluvium builds the plain.", "repeated flooding depositing silt"],
      ["A gorge is a", "steep narrow river valley", ["wide delta", "coastal beach", "sand dune"], "Rapid retreat steepens it.", "steep narrow river valley"],
      ["A pothole in a river bed is bored by", "swirling stones", ["fish", "wind", "tree roots"], "Stones drill the bed in eddies.", "swirling stones"],
      ["Glaciers erode by", "plucking and abrasion", ["oxidation", "solution", "carbonation"], "Ice freezes onto and scrapes rock.", "plucking and abrasion"],
    ],
  }),
  recallFamily({
    id: "climate-vegetation-soil",
    topicSlug: "geography",
    label: "Climate, vegetation and soil",
    hint: "Latitude, altitude and ocean currents drive climate belts.",
    rows: [
      ["Weather is the", "state of the atmosphere at a time", "average climate", "Weather is daily; climate is averaged over decades.", "state of the atmosphere at a time"],
      ["Climate is best described as", "the average weather over a long period", ["today's temperature", "a single storm", "the wind direction"], "It summarises averages.", "the average weather over a long period"],
      ["The instrument measuring temperature is a", "thermometer", ["barometer", "hygrometer", "anemometer"], "Thermometers read heat.", "thermometer"],
      ["Air pressure is measured with a", "barometer", ["thermometer", "rain gauge", "wind vane"], "Barometers read pressure.", "barometer"],
      ["Rainfall is measured with a", "rain gauge", ["barometer", "thermometer", "anemometer"], "The gauge collects precipitation.", "rain gauge"],
      ["Wind speed is measured by", "an anemometer", ["barometer", "hygrometer", "rain gauge"], "Cups spin with the wind.", "an anemometer"],
      ["Wind direction is shown by a", "wind vane", ["anemometer", "barometer", "thermometer"], "The arrow points to the source.", "wind vane"],
      ["Humidity is measured with a", "hygrometer", ["thermometer", "barometer", "anemometer"], "It gauges water vapour.", "hygrometer"],
      ["Tropical rainforest climates are", "hot and wet all year", ["hot and dry", "cold and wet", "mild and dry"], "They have no dry season.", "hot and wet all year"],
      ["Savanna climates have", "wet and dry seasons", ["no rain", "rain every day", "permanent snow"], "Wet summers alternate with dry winters.", "wet and dry seasons"],
      ["Deserts receive", "very little rainfall", ["heavy daily rain", "monsoon rain", "constant drizzle"], "They are arid by definition.", "very little rainfall"],
      ["The Mediterranean climate has", "winter rain and summer drought", ["summer rain", "rain all year", "no rain at all"], "Westerlies bring winter rain.", "winter rain and summer drought"],
      ["A monsoon is", "a seasonal wind that reverses", ["a steady sea breeze", "a desert dust storm", "a mountain mist"], "It brings summer rains to Asia.", "a seasonal wind that reverses"],
      ["Altitude affects climate because temperature", "falls with height", ["rises with height", "stays the same", "doubles"], "The lapse rate cools the air.", "falls with height"],
      ["Prevailing westerlies blow", "from the west towards the east", ["from pole to pole", "from east to west only", "from the equator to the poles"], "They steer temperate weather.", "from the west towards the east"],
      ["The harmattan is a", "dry dusty wind from the Sahara", ["wet monsoon", "cool sea breeze", "storm surge"], "It blows in West Africa's dry season.", "dry dusty wind from the Sahara"],
      ["Convectional rainfall forms when", "heated air rises and cools", ["air sinks", "winds blow over a lake", "snow melts"], "Rising air condenses into showers.", "heated air rises and cools"],
      ["Relief rainfall falls on", "the windward slope of a mountain", ["the leeward side", "the valley floor", "the plain"], "Orographic uplift causes it.", "the windward slope of a mountain"],
      ["A rain shadow describes the", "dry leeward slope", ["wet windward slope", "coastal plain", "delta"], "Descending dry air warms and dries.", "dry leeward slope"],
      ["Laterite soils develop in", "hot wet tropical climates", ["cold tundra", "deserts", "polar regions"], "Heavy leaching builds iron-rich layers.", "hot wet tropical climates"],
      ["Podzol soils are typical of", "cool coniferous forests", ["deserts", "savannas", "tropics"], "Acid litter leaches the profile.", "cool coniferous forests"],
      ["Desert soils are often", "dry and salty", ["waterlogged", "deeply leached", "acidic peat"], "Evaporation concentrates salts.", "dry and salty"],
      ["The vegetation belt of the Sahara is", "desert scrub", ["tropical rainforest", "temperate forest", "tundra"], "Scrub survives arid lands.", "desert scrub"],
      ["Tropical rainforest soils are often", "nutrient-poor despite the lush forest", ["the richest soils", "frozen", "salty"], "Nutrients sit in the biomass, not the soil.", "nutrient-poor despite the lush forest"],
      ["Soil is a mixture of", "mineral particles, organic matter, air and water", ["only sand", "only rock", "only clay"], "Four fractions make soil.", "mineral particles, organic matter, air and water"],
      ["Soil erosion by water is worst where", "vegetation is cleared on slopes", ["forests are dense", "the land is flat", "the soil is sandy"], "Bare slopes lose soil to runoff.", "vegetation is cleared on slopes"],
      ["Contour ploughing reduces erosion by", "following the shape of the slope", ["ploughing downhill", "burning stubble", "overgrazing"], "It slows runoff along contours.", "following the shape of the slope"],
      ["Terracing helps hill farming by", "creating flat steps", ["clearing forests", "digging wells", "planting grasses only"], "Steps cut slope and hold water.", "creating flat steps"],
    ],
  }),
  recallFamily({
    id: "settlement-population",
    topicSlug: "geography",
    label: "Settlement and population",
    hint: "Settlement size and function link to land and economics.",
    rows: [
      ["A settlement is a", "place where people live", ["a mining pit", "a forest", "a river"], "It is inhabited ground.", "place where people live"],
      ["The site of a settlement is", "the land it occupies", ["its trade", "its population", "its climate"], "Site is the physical ground.", "the land it occupies"],
      ["The situation of a settlement is", "its position relative to other places", ["its shape", "its soil", "its rainfall"], "Situation is relational.", "its position relative to other places"],
      ["A linear settlement pattern follows", "a road or river", ["a grid of fields", "a ring", "a star"], "Transport lines shape it.", "a road or river"],
      ["The largest settlement type in the hierarchy is a", "city", ["village", "hamlet", "farmstead"], "Cities head the hierarchy.", "city"],
      ["A hamlet is smaller than a", "village", ["city", "town", "conurbation"], "Hamlets are the smallest.", "village"],
      ["The function of a port settlement is", "trade by sea", ["mining", "tourism", "education"], "Ports handle shipping.", "trade by sea"],
      ["A dormitory settlement mainly provides", "housing for commuters", ["factories", "ports", "mines"], "Residents work elsewhere.", "housing for commuters"],
      ["Urbanisation is the", "growth of the urban population share", ["fall of city size", "rural clearance", "forest planting"], "Urban share keeps rising.", "growth of the urban population share"],
      ["Overpopulation occurs when", "resources cannot support the people", ["the land is empty", "births fall", "farms expand"], "Carrying capacity is exceeded.", "resources cannot support the people"],
      ["Underpopulation occurs when", "resources exceed the population using them", ["people crowd cities", "farms fail", "water runs out"], "Resources are under-used.", "resources exceed the population using them"],
      ["Optimum population exists when", "resources and people are in balance", ["people exceed land", "land exceeds people", "births cease"], "Production per head peaks.", "resources and people are in balance"],
      ["A population pyramid shows", "age and sex structure", ["income and jobs", "soil and crops", "roads and towns"], "It charts demographics.", "age and sex structure"],
      ["A youthful population means a country has", "a high proportion under 15", ["many retirees", "equal age groups", "few births"], "Youthful pyramids have wide bases.", "a high proportion under 15"],
      ["An ageing population has", "a high proportion over 65", ["many children", "equal age groups", "a young base"], "Top-heavy pyramids mark ageing.", "a high proportion over 65"],
      ["Migration into a country is called", "immigration", ["emigration", "deportation", "transit"], "Immigrants arrive.", "immigration"],
      ["Migration out of a country is called", "emigration", ["immigration", "importation", "settlement"], "Emigrants leave.", "emigration"],
      ["A push factor drives people", "away from a place", ["towards a job", "towards family", "towards schools"], "Push = negative at origin.", "away from a place"],
      ["A pull factor", "attracts migrants to a place", ["repels them", "raises taxes", "breaks families"], "Pull = positive at destination.", "attracts migrants to a place"],
      ["Rural-urban migration feeds", "city growth", ["village growth", "forest regrowth", "farm output"], "Cities absorb the migrants.", "city growth"],
      ["A refugee is a person who", "flees persecution across borders", ["commutes daily", "shops abroad", "retires abroad"], "Refugees seek protection.", "flees persecution across borders"],
      ["A census counts", "the population", ["the rainfall", "the houses only", "the crops"], "It is a full headcount.", "the population"],
      ["The dependency ratio compares", "dependents to the working-age population", ["cities to villages", "boys to girls", "farms to factories"], "It measures support burden.", "dependents to the working-age population"],
      ["A densely populated region in Nigeria is around", "Lagos", ["the Sahara margin", "the Jos plateau forests", "the Sahel"], "Urban and fertile lands attract people.", "Lagos"],
      ["Sparsely populated regions usually have", "harsh climates or poor soils", ["rich farmland", "ports", "mines"], "Hostility to life thins settlement.", "harsh climates or poor soils"],
      ["An urban slum is marked by", "overcrowded poor-quality housing", ["planned estates", "office towers", "green belts"], "Informal housing lacks services.", "overcrowded poor-quality housing"],
      ["The green belt around a city exists to", "limit urban sprawl", ["raise taxes", "cut water", "build roads"], "Protection stops expansion.", "limit urban sprawl"],
      ["Counter-urbanisation is the", "move from cities back to smaller settlements", ["move to cities", "move abroad only", "move to deserts"], "Some people leave the metropolis.", "move from cities back to smaller settlements"],
    ],
  }),
];
