-- Desk: processed notes artifact on StudyDocument.
--
-- The 20261029160000_desk_pipeline schema comment states that "extracted text
-- + AI notes + quiz items" persist, but the model shipped without a column to
-- hold the notes, making the Desk reader impossible to build on the given
-- schema. This adds the one missing nullable column — additive, no backfill
-- (rows written before this migration simply have no notes artifact).

ALTER TABLE "StudyDocument" ADD COLUMN "notes" JSONB;
