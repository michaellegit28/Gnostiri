-- The application connects to Postgres only from trusted server code. Firebase
-- identity is verified there; browser users never connect directly to Postgres.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TutorSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudyPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Certificate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CourseQuizAttempt" ENABLE ROW LEVEL SECURITY;

-- No browser-facing Postgres role is granted row access. The server uses the
-- private database connection and applies verified userId/domain predicates.
