import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const q = (p) => readFileSync(ROOT + p, "utf8");

const HOME = "src/app/page.tsx";
const TEASER = "src/components/landing/Landing.tsx";

test("the signed-in dashboard shows no study categories", () => {
  const home = q(HOME);
  assert.doesNotMatch(home, /StudyGrid|LibraryStrip|DashboardTeaser/, "study categories are off Home");
  assert.match(home, /LeagueStatusWidget/, "the league status widget is on Home");
  assert.match(home, /TutorShortcut/, "the tutor shortcut is on Home");
});

test("the dashboard keeps the greeting, hero and stats", () => {
  const home = q(HOME);
  for (const part of ["Greeting", "BattlePlanHero", "StatsRow"]) {
    assert.match(home, new RegExp(part), `${part} stays on Home`);
  }
});

test("the signed-out landing is numbers-first and category-free", () => {
  const band = q(TEASER);
  assert.match(band, /5,997/, "a real question count, not an adjective");
  assert.match(band, /Create your free account/, "one clear CTA");
  for (const banned of [/embark/i, /unlock/i, /journey/i, /seamless/i, /potential/i]) {
    assert.doesNotMatch(band, banned, "no AI-marketing copy");
  }
});

test("the study hub is a dedicated route with four cards", () => {
  const study = q("src/app/study/page.tsx");
  for (const href of ["/highschool", "/university", "/discovery", "/desk"]) {
    assert.match(study, new RegExp(href.replace(/\//g, "\\/")), `${href} is on /study`);
  }
  assert.match(study, /jambQuestions\.count|question\.count/, "counts come from the database");
  const grid = q("src/components/study/StudyGrid.tsx");
  assert.match(grid, /min-h-\[132px\]/, "cards keep generous touch targets");
});

test("the logo mark is an SVG that carries the refined gold and stays simple", () => {
  const logo = q("src/components/brand/Logo.tsx");
  assert.match(logo, /<svg/, "inline SVG, crisp at any size");
  assert.match(logo, /#C69A2E/, "the refined brass gold");
  assert.match(logo, /linearGradient/, "the mark carries the brand gradient");
  assert.ok((logo.match(/<path/g) ?? []).length <= 5, "no fine detail that dies at 16px");
});

test("the brand art is a lightweight animated SVG, not a video or bitmap", () => {
  const hero = q("src/components/brand/HeroVisual.tsx");
  assert.match(hero, /<svg/, "inline SVG art");
  assert.match(hero, /prefers-reduced-motion/, "the animation is silenced for reduced motion");
  assert.match(hero, /html\.reduce-motion/, "and by the in-app motion preference");
  assert.ok(!/\.(mp4|webm|png|jpg)/.test(hero), "no video or bitmap payload");
});

test("the signed-out landing is category-free with one CTA and a real hero", () => {
  const landing = q("src/components/landing/Landing.tsx");
  for (const banned of [/High School<\/a>/, /University<\/a>/, /Discovery<\/a>/]) {
    assert.ok(!banned.test(landing), "no category navigation on Home");
  }
  assert.match(landing, /HeroVisual/, "the brand art is on the landing");
  assert.match(landing, /bg-gradient-to-r from-gold-from to-gold-to/, "the primary CTA uses the brand gradient");
});

test("design tokens exist for both themes with a measured floor", () => {
  const css = q("src/app/globals.css");
  assert.match(css, /\[data-theme="light"\]/, "a light theme exists");
  assert.match(css, /--text-muted: 161 161 170/, "dark muted is zinc-400");
  assert.match(css, /--text-muted: 82 82 91/, "light muted is zinc-600");
  assert.match(css, /--gold-text: 122 94 20/, "light-mode gold text is darkened for contrast");
  assert.match(css, /:focus-visible/, "a global focus ring");
});

test("no backdrop blur survives anywhere", () => {
  const css = q("src/app/globals.css");
  assert.match(css, /backdrop-blur[^{]*\{[^}]*backdrop-filter: none/, "blur is neutralised globally");
});
