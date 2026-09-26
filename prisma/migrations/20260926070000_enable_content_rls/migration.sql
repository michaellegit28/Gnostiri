-- Gnostiri accesses PostgreSQL only from trusted Next.js server code via Prisma.
-- Do not add anon/authenticated policies: curriculum answers and payment events
-- must not be readable directly through the Supabase Data API.
ALTER TABLE "public"."Domain" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Examination" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Topic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."CourseLesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."CourseQuestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PaymentEvent" ENABLE ROW LEVEL SECURITY;
