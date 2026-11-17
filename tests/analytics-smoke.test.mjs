import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * Analytics/telemetry smoke tests for the analytics implementation.
 * Tests the event tracking, user identification, and data structure
 * without requiring a full analytics provider.
 */

// ─── Event Types ──────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "page_view",
  "button_click",
  "form_submit",
  "quiz_start",
  "quiz_complete",
  "lesson_start",
  "lesson_complete",
  "tutor_ask",
  "tutor_response",
  "search",
  "error",
  "signup",
  "login",
  "logout",
];

const EVENT_TYPE_SET = new Set(EVENT_TYPES);

function isEventType(type) {
  return EVENT_TYPE_SET.has(type);
}

/** @typedef {Object} AnalyticsEvent
 * @property {string} type - Event type
 * @property {number} timestamp - Unix timestamp in ms
 * @property {string} [userId] - Authenticated user ID
 * @property {string} sessionId - Session identifier
 * @property {Object} properties - Event properties
 * @property {Object} [context] - Contextual information
 */

// ─── Validation ────────────────────────────────────────────────────────────────

function validateEvent(event) {
  if (!event || typeof event !== "object") return false;
  const e = event;
  
  if (typeof e.type !== "string" || !EVENT_TYPES.includes(e.type)) return false;
  if (typeof e.timestamp !== "number" || e.timestamp <= 0) return false;
  if (e.userId !== undefined && typeof e.userId !== "string") return false;
  if (typeof e.sessionId !== "string" || e.sessionId.length === 0) return false;
  if (!e.properties || typeof e.properties !== "object") return false;
  if (e.context !== undefined && (typeof e.context !== "object" || e.context === null)) return false;
  
  return true;
}

function createEvent(type, sessionId, properties = {}, options = {}) {
  return {
    type,
    timestamp: Date.now(),
    sessionId,
    properties,
    ...(options.userId && { userId: options.userId }),
    ...(options.context && { context: options.context }),
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────────

test("EVENT_TYPES: contains all required event types", () => {
  const required = [
    "page_view",
    "button_click",
    "form_submit",
    "quiz_start",
    "quiz_complete",
    "lesson_start",
    "lesson_complete",
    "tutor_ask",
    "tutor_response",
    "search",
    "error",
    "signup",
    "login",
    "logout",
  ];
  for (const type of required) {
    assert.ok(EVENT_TYPES.includes(type), `Missing event type: ${type}`);
  }
});

test("createEvent: generates valid event with required fields", () => {
  const event = createEvent("page_view", "session-123", { path: "/study" });
  
  assert.equal(event.type, "page_view");
  assert.ok(typeof event.timestamp === "number");
  assert.ok(event.timestamp > 0);
  assert.equal(event.sessionId, "session-123");
  assert.deepEqual(event.properties, { path: "/study" });
  assert.ok(!event.userId);
});

test("createEvent: includes userId when provided", () => {
  const event = createEvent("quiz_start", "session-123", { topicId: "physics-1" }, {
    userId: "user-456",
  });
  
  assert.equal(event.userId, "user-456");
});

test("createEvent: includes context when provided", () => {
  const context = {
    page: "/study",
    referrer: "/",
    userAgent: "Mozilla/5.0",
    viewport: { width: 1920, height: 1080 },
  };
  const event = createEvent("button_click", "session-123", { buttonId: "cta" }, { context });
  
  assert.deepEqual(event.context, context);
});

test("validateEvent: accepts valid event", () => {
  const event = createEvent("quiz_complete", "session-123", { score: 85 });
  assert.ok(validateEvent(event));
});

test("validateEvent: rejects invalid type", () => {
  const event = createEvent("invalid_type", "session-123", {});
  assert.ok(!validateEvent(event));
});

test("validateEvent: rejects missing timestamp", () => {
  const event = { ...createEvent("page_view", "session-123"), timestamp: undefined };
  assert.ok(!validateEvent(event));
});

test("validateEvent: rejects negative timestamp", () => {
  const event = { ...createEvent("page_view", "session-123"), timestamp: -1 };
  assert.ok(!validateEvent(event));
});

test("validateEvent: rejects missing sessionId", () => {
  const event = { ...createEvent("page_view", "session-123"), sessionId: "" };
  assert.ok(!validateEvent(event));
});

test("validateEvent: rejects invalid properties", () => {
  const event = { ...createEvent("page_view", "session-123"), properties: "invalid" };
  assert.ok(!validateEvent(event));
});

test("validateEvent: rejects null properties", () => {
  const event = { ...createEvent("page_view", "session-123"), properties: null };
  assert.ok(!validateEvent(event));
});

test("validateEvent: accepts event with context", () => {
  const event = createEvent("search", "session-123", { query: "physics" }, {
    context: { page: "/highschool", viewport: { width: 1200, height: 800 } },
  });
  assert.ok(validateEvent(event));
  assert.ok(event.context?.viewport);
});

test("validateEvent: rejects invalid context", () => {
  const event = { ...createEvent("page_view", "session-123"), context: "invalid" };
  assert.ok(!validateEvent(event));
});

test("event properties: quiz events have required fields", () => {
  const quizStart = createEvent("quiz_start", "s-1", { topicId: "physics-1", questionCount: 10 });
  assert.ok("topicId" in quizStart.properties);
  assert.ok("questionCount" in quizStart.properties);
  
  const quizComplete = createEvent("quiz_complete", "s-1", { score: 85, correct: 9, total: 10 });
  assert.ok("score" in quizComplete.properties);
  assert.ok("correct" in quizComplete.properties);
  assert.ok("total" in quizComplete.properties);
});

test("event properties: tutor events have required fields", () => {
  const tutorAsk = createEvent("tutor_ask", "s-1", { domain: "highschool", messageLength: 150 });
  assert.ok("domain" in tutorAsk.properties);
  assert.ok("messageLength" in tutorAsk.properties);
  
  const tutorResponse = createEvent("tutor_response", "s-1", { responseLength: 500, model: "atria-dawn" });
  assert.ok("responseLength" in tutorResponse.properties);
  assert.ok("model" in tutorResponse.properties);
});

test("event properties: error events capture error details", () => {
  const errorEvent = createEvent("error", "s-1", {
    message: "Network request failed",
    code: "NETWORK_ERROR",
    stack: "Error: Network request failed\n    at fetch...",
    component: "QuizClient",
  });
  assert.ok("message" in errorEvent.properties);
  assert.ok("code" in errorEvent.properties);
  assert.ok("stack" in errorEvent.properties);
  assert.ok("component" in errorEvent.properties);
});

test("event properties: auth events track auth flow", () => {
  const signup = createEvent("signup", "s-1", { method: "email" });
  assert.equal(signup.properties.method, "email");
  
  const login = createEvent("login", "s-1", { method: "google", redirectFrom: "/study" });
  assert.equal(login.properties.method, "google");
  assert.equal(login.properties.redirectFrom, "/study");
});

test("sessionId: is consistently used across events", () => {
  const sessionId = "session-abc-123";
  const events = [
    createEvent("page_view", sessionId, { path: "/" }),
    createEvent("button_click", sessionId, { buttonId: "start-quiz" }),
    createEvent("quiz_start", sessionId, { topicId: "physics-1" }),
    createEvent("quiz_complete", sessionId, { score: 90 }),
  ];
  
  for (const event of events) {
    assert.equal(event.sessionId, sessionId);
  }
});

test("userId: tracks authenticated user across events", () => {
  const userId = "user-456";
  const events = [
    createEvent("page_view", "s-1", { path: "/study" }, { userId }),
    createEvent("lesson_start", "s-1", { lessonId: "lesson-1" }, { userId }),
    createEvent("lesson_complete", "s-1", { lessonId: "lesson-1" }, { userId }),
  ];
  
  for (const event of events) {
    assert.equal(event.userId, userId);
  }
});

test("timestamp: is monotonically increasing within session", () => {
  const events = [];
  for (let i = 0; i < 5; i++) {
    events.push(createEvent("button_click", "s-1", { index: i }));
  }
  
  for (let i = 1; i < events.length; i++) {
    assert.ok(events[i].timestamp >= events[i - 1].timestamp);
  }
});

test("context: captures page and viewport info", () => {
  const event = createEvent("page_view", "s-1", { path: "/highschool" }, {
    context: {
      page: "/highschool",
      referrer: "/",
      userAgent: "Mozilla/5.0 (iPhone)",
      viewport: { width: 390, height: 844 },
    },
  });
  
  assert.equal(event.context?.page, "/highschool");
  assert.equal(event.context?.referrer, "/");
  assert.ok(event.context?.userAgent?.includes("iPhone"));
  assert.equal(event.context?.viewport?.width, 390);
  assert.equal(event.context?.viewport?.height, 844);
});

test("privacy: no PII in event properties", () => {
  const event = createEvent("lesson_complete", "s-1", {
    lessonId: "lesson-1",
    score: 95,
    durationSeconds: 300,
  }, { userId: "user-456" });
  
  // No email, name, IP, or other PII in properties
  const piiFields = ["email", "name", "firstName", "lastName", "ip", "ipAddress", "address", "phone"];
  for (const field of piiFields) {
    assert.ok(!(field in event.properties), `PII field ${field} should not be in properties`);
  }
  // userId is in top-level, not properties
  assert.ok(!("userId" in event.properties));
});

test("batch: multiple events can be validated together", () => {
  const events = [
    createEvent("page_view", "s-1", { path: "/study" }),
    createEvent("quiz_start", "s-1", { topicId: "physics-1" }),
    createEvent("quiz_complete", "s-1", { score: 80 }),
    createEvent("tutor_ask", "s-1", { domain: "university" }),
  ];
  
  const allValid = events.every(validateEvent);
  assert.ok(allValid);
});

test("event schema: can be serialized and deserialized", () => {
  const event = createEvent("search", "s-1", { query: "physics", resultsCount: 25 }, {
    userId: "user-123",
    context: { page: "/highschool/search", viewport: { width: 1920, height: 1080 } },
  });
  
  const json = JSON.stringify(event);
  const parsed = JSON.parse(json);
  
  assert.equal(parsed.type, event.type);
  assert.equal(parsed.sessionId, event.sessionId);
  assert.equal(parsed.userId, event.userId);
  assert.deepEqual(parsed.properties, event.properties);
  assert.deepEqual(parsed.context, event.context);
  assert.ok(typeof parsed.timestamp === "number");
});