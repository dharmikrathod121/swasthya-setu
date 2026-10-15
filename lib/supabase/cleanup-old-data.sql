-- ============================================================
-- ONE-TIME cleanup: removes the previous demo dataset so the new
-- Rajkot Healthcare Directory (seed.sql) becomes the only data.
-- Run ONCE in the Supabase SQL editor BEFORE running seed.sql.
-- Reviews/queue rows cascade from their hospitals; the explicit
-- deletes below cover orphans. Auth users are NOT touched.
-- ============================================================
delete from public.doctor_clinic_timings;
delete from public.queue_reports;
delete from public.reviews;
delete from public.doctors;
delete from public.hospitals;
