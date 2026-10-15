-- ============================================================
-- Swasthya Setu — Seed Data (Rajkot Healthcare Directory, public baseline)
-- Generated 2026-10-14 from lib/data/rajkot-healthcare-directory.json
-- 111 facilities + 11 doctors (public listings,
-- NOT phone-verified). Idempotent via WHERE NOT EXISTS.
-- NOTE: run lib/supabase/cleanup-old-data.sql ONCE first if this DB already
-- holds the previous demo dataset.
-- ============================================================

-- HOSPITALS + CLINICS (clinics stored with " (Clinic)" marker — the API
-- detects them by that marker because the DB type check allows Govt/Private)
insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Civil Hospital / Pandit Deendayal Upadhyay Hospital', 'Govt', 'Hospital Chowk / Sadar, Rajkot', 3.9, 558, ARRAY['General Medicine','General Surgery','Emergency Medicine'], 0, 'low', true, true, '#0D7377', 'Hospital Chowk, Jamnagar Road, opposite SBI, Rajkot, Gujarat 360001', '0281-2471118', 'Emergency 24/7 (verify with hospital)', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Civil Hospital / Pandit Deendayal Upadhyay Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'ESIC Hospital Rajkot', 'Govt', 'Bhavnagar Road, Rajkot', 0, 0, ARRAY['General Medicine'], 0, 'low', true, false, '#0D7377', 'Dudh Sagar Main Road, near Gopal Dairy, opposite H J Steel, Bhavnagar Road, Rajkot, Gujarat 360003', '0281-2703654', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'ESIC Hospital Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'G. T. Sheth Government Eye Hospital', 'Govt', 'Jamnagar Road, Rajkot', 0, 0, ARRAY['Ophthalmology'], 0, 'low', true, false, '#0D7377', 'C/o PDU Medical College, Jamnagar Road, near Jam Tower, Rajkot, Gujarat 360001', '0281-2447485', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'G. T. Sheth Government Eye Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'K T Children Government Hospital', 'Govt', 'Civil Hospital Campus, Rajkot', 0, 0, ARRAY['Pediatrics'], 0, 'low', true, false, '#0D7377', 'Civil Hospital Campus, Jamnagar Road, Rajkot, Gujarat 360001', '0281-2476402', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'K T Children Government Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Janana / Rasulkhanji Zanana Hospital', 'Govt', 'Hospital Chowk / Lohana Para, Rajkot', 2.7, 88, ARRAY['Gynecology','Obstetrics'], 0, 'low', true, false, '#0D7377', 'Hospital Chowk / Lohana Para, Rajkot, Gujarat 360001', '0281-2228026', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Janana / Rasulkhanji Zanana Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'PadmaKunvarba Hospital', 'Govt', 'Jayraj Plot, Rajkot', 0, 0, ARRAY['General Medicine','General Surgery'], 0, 'low', true, false, '#0D7377', 'Palace Road, near Gundavadi Police Chowki, Jayraj Plot, Rajkot, Gujarat 360001', '0281-2227136', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'PadmaKunvarba Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Saurashtra Cancer Care & Research Institute', 'Private', 'Munjka / University Road, Rajkot', 0, 0, ARRAY['Oncology'], 0, 'low', true, false, '#2563EB', 'University Road, near B T Savani Kidney Hospital, Saurashtra University Campus, Munjka, Rajkot, Gujarat 360005', '0281-2471218', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Saurashtra Cancer Care & Research Institute');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'AIIMS Rajkot', 'Govt', 'Khanderi / Para Pipaliya, Rajkot', 0, 0, ARRAY['General Medicine','General Surgery'], 0, 'low', true, false, '#0D7377', 'AIIMS campus, Khanderi / Para Pipaliya area, Rajkot district, Gujarat', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'AIIMS Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Rajkot G. T. Sheth Cancer Hospital', 'Private', 'Tirupati Nagar, Rajkot', 4, 73, ARRAY['Oncology'], 0, 'low', true, false, '#2563EB', 'Tirupati Nagar, Rajkot, Gujarat', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Rajkot G. T. Sheth Cancer Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Aambedkarnagar Urban Health Centre (Clinic)', 'Private', 'Aambedkarnagar, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Gokuldham Main Road, Samrat Industrial Area, Rajkot, Gujarat', '+91 63599 33831', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Aambedkarnagar Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'AHMP Urban Health Centre (Clinic)', 'Private', 'AHMP, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Laxmiwadi Main Road, Gatral Chowk, Rajkot, Gujarat', '+91 63599 33815', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'AHMP Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Bhagvatipara Urban Health Centre (Clinic)', 'Private', 'Bhagvatipara, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Bhagvatipara Street No. 5, Rajkot, Gujarat', '+91 63599 33818', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Bhagvatipara Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Champakbhai Vora Urban Health Centre (Clinic)', 'Private', 'Champakbhai Vora, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Near Rajmoti Oil Mill, Bhavnagar Road, Rajkot, Gujarat', '+91 63599 33823', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Champakbhai Vora Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Hudko Urban Health Centre (Clinic)', 'Private', 'Hudko, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Kothariya Main Road, Haridhava Road, opposite Police Chowki, Rajkot, Gujarat', '+91 63599 33817', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Hudko Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'IMA Urban Health Centre (Clinic)', 'Private', 'IMA, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Pedak Road, near Saint Gyaneshwar School, Rajkot, Gujarat', '+91 63599 33820', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'IMA Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Kabirvan Urban Health Centre (Clinic)', 'Private', 'Kabirvan, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Kabirvan Society Street No. 1, Sant Kabir Road, Rajkot, Gujarat', '+91 63599 33821', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Kabirvan Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Kothariya Urban Health Centre (Clinic)', 'Private', 'Kothariya, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Murari Nagar, Rajkot 360022, Rajkot, Gujarat', '+91 63599 33825', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Kothariya Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Mavdi Urban Health Centre (Clinic)', 'Private', 'Mavdi, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Mavdi Main Road, Dada Mekran Chowk, Rajkot, Gujarat', '+91 63599 33830', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Mavdi Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Morbi Road Urban Health Centre (Clinic)', 'Private', 'Morbi Road, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Morbi Road, Jakat Naka, Rajkot, Gujarat', '+91 63599 33819', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Morbi Road Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Nana Mauva Urban Health Centre (Clinic)', 'Private', 'Nana Mauva, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Nana Mauva Chowk, Rajkot, Gujarat', '+91 63599 33828', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Nana Mauva Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Nandanvan Urban Health Centre (Clinic)', 'Private', 'Nandanvan, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Nandanvan Society, opposite Gandhigram Police Chowki, Rajkot, Gujarat', '+91 63599 33829', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Nandanvan Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Narayannagar Urban Health Centre (Clinic)', 'Private', 'Narayannagar, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Narayan Nagar Main Road, near Dhebar Road railway track, Rajkot, Gujarat', '+91 63599 33814', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Narayannagar Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'New Raghuvir Urban Health Centre (Clinic)', 'Private', 'New Raghuvir, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Babariya Main Road, Raghuvir Society, Rajkot, Gujarat', '+91 63599 33816', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'New Raghuvir Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Pranami Chowk Urban Health Centre (Clinic)', 'Private', 'Pranami Chowk, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Pranami Chowk, Siyani Main Road, Rajkot, Gujarat', '+91 63599 33824', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Pranami Chowk Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Railnagar Urban Health Centre (Clinic)', 'Private', 'Railnagar, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Opposite Railway Junction, near ward office, Rajkot, Gujarat', '+91 63599 33812', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Railnagar Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Ram Park Urban Health Centre (Clinic)', 'Private', 'Ram Park, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Ram Park common plot, Bhavnagar Road, Rajkot, Gujarat', '+91 63599 33822', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Ram Park Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Redcross Sadar Urban Health Centre (Clinic)', 'Private', 'Redcross Sadar, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Near Kundaliya College, near Shastri Maidan, Rajkot, Gujarat', '+91 63599 33811', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Redcross Sadar Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Redcross Ramnathpara Urban Health Centre (Clinic)', 'Private', 'Redcross Ramnathpara, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Ramnathpara Street No. 24, Rajkot, Gujarat', '+91 63599 33813', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Redcross Ramnathpara Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shyamnagar Urban Health Centre (Clinic)', 'Private', 'Shyamnagar, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Near Bileshwar Temple, Shyamnagar 4/5 corner, Rajkot, Gujarat', '+91 63599 33826', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shyamnagar Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vijayplot Urban Health Centre (Clinic)', 'Private', 'Vijayplot, Rajkot (Clinic)', 0, 0, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Vijayplot Main Road, opposite Bhalodiya College, Rajkot, Gujarat', '+91 63599 33827', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Vijayplot Urban Health Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Aarogyam Hospital', 'Private', 'Chandreshnagar, Rajkot', 5, 2507, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', '3rd Floor, Miracle Doctor House, Mahapujadham Chowk, 150 Feet Ring Road, opposite Balaji Hall, Rajkot, Gujarat 360004', '+91 91043 74743', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Aarogyam Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Gastrosurg Hospital-Gastrosurgeon', 'Private', 'Mavdi, Rajkot', 5, 274, ARRAY['Gastroenterology'], 0, 'low', true, true, '#2563EB', '4th Floor, Bizz Center, Balaji Hall, 150 Feet Ring Road, opposite Miracle Doctor, Padmi Society, Mavdi, Rajkot, Gujarat 360005', '+91 90810 81838', 'Mon-Sat 24 hours; Sunday closed', 'Mon-Sat 24 hours; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Gastrosurg Hospital-Gastrosurgeon');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Aradhana Hospital', 'Private', 'Karan Park, Rajkot', 5, 273, ARRAY['General Medicine','General Surgery'], 0, 'low', true, false, '#2563EB', 'Raj Complex, near ICICI Bank, Nana Mava Road, Rajnagar Chowk, Jay Park, Karan Park, Rajkot, Gujarat 360001', '+91 92273 85261', 'Mon-Sat; split OPD hours listed', 'Mon-Sat; split OPD hours listed'
where not exists (select 1 from public.hospitals where name = 'Aradhana Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Synergy Superspeciality Hospital', 'Private', 'Bajrang Wadi, Rajkot', 4.9, 16884, ARRAY['General Medicine','General Surgery','Critical Care'], 0, 'low', true, true, '#2563EB', 'Synergy Circle, near Gokulmathura Apartment / Ayodhya Chowk BRTS, 150 Feet Ring Road, Rajkot, Gujarat 360006', '0281-6195000', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Synergy Superspeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Star Synergy Hospital', 'Private', 'Uday Nagar, Rajkot', 4.9, 3077, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Mavdi Main Road, Vishweshwar Market, Uday Nagar, Rajkot, Gujarat 360004', '+91 95121 40088', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Star Synergy Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Plexus Cardiac Care', 'Private', 'Bajrang Wadi, Rajkot', 4.9, 1899, ARRAY['Cardiology'], 0, 'low', true, false, '#2563EB', 'Locality: Bajrang Wadi, Rajkot, Gujarat (full street address not verified)', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Plexus Cardiac Care');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Backbone Medicity Superspeciality Hospital', 'Private', 'North Block, Rajkot', 4.9, 1493, ARRAY['General Medicine','General Surgery','Neurology'], 0, 'low', true, true, '#2563EB', '11/1-5, Ram Vihar Society Circle, 150 Feet Ring Road, behind Twin Star Building, opposite Gopalak Girls Hostel, Rajkot, Gujarat 360004', null, 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Backbone Medicity Superspeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Crystal Hospital', 'Private', 'Shastri Nagar, Rajkot', 4.9, 933, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', 'Nana Mava Main Road, near SBI Bank, Maruti Nagar, Shastri Nagar, Rajkot, Gujarat 360005', '+91 70161 05766', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Crystal Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Urocare Hospital', 'Private', 'Vidya Nagar, Rajkot', 4.9, 843, ARRAY['Urology','Nephrology'], 0, 'low', true, true, '#2563EB', 'Vidya Nagar Main Road, Vidya Nagar, Rajkot, Gujarat 360002', '0281-2466990', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Urocare Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Nilkanth Diagnostics (Clinic)', 'Private', 'Om Nagar, Rajkot (Clinic)', 4.9, 666, ARRAY['Diagnostics'], 0, 'low', true, false, '#059669', 'Krishna Arcade, 150 Feet Ring Road, Dharam Nagar, Om Nagar, Rajkot, Gujarat 360004', '+91 72838 42020', 'Mon-Sat 09:00-20:30; Sun 09:00-12:30', 'Mon-Sat 09:00-20:30; Sun 09:00-12:30'
where not exists (select 1 from public.hospitals where name = 'Nilkanth Diagnostics (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Premier Hospital & ICU', 'Private', 'Mavdi, Rajkot', 4.9, 578, ARRAY['Critical Care'], 0, 'low', true, true, '#2563EB', 'First Floor, 101, RK Prime Plus, 150 Feet Ring Road, near Balaji Hall, Padmi Society, Mavdi, Rajkot, Gujarat 360005', '+91 99256 01601', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Premier Hospital & ICU');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Jay Multispeciality Hospital', 'Private', 'Mavdi, Rajkot', 4.9, 568, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', '5th Floor, Prime Plus, RK, Mahapoojadham Chowk, 150 Feet Ring Road, near Balaji Hall, Rajkot, Gujarat 360005', '+91 98242 90140', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Jay Multispeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Omega Hospital & ICU', 'Private', 'Mavdi, Rajkot', 4.9, 437, ARRAY['Critical Care'], 0, 'low', true, true, '#2563EB', 'Balaji Hall, 150 Feet Ring Road, beside HDFC Bank, opposite Zudio, Padmi Society, Mavdi, Rajkot, Gujarat 360005', '+91 90290 80680', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Omega Hospital & ICU');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Khushi Multispeciality Hospital & ICU', 'Private', 'Bajrang Wadi, Rajkot', 4.9, 403, ARRAY['General Medicine','General Surgery','Critical Care'], 0, 'low', true, false, '#2563EB', 'Locality: Bajrang Wadi, Rajkot, Gujarat (full street address not verified)', '+91 96622 36622', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Khushi Multispeciality Hospital & ICU');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Nephron Kidney Hospital', 'Private', 'Chandreshnagar, Rajkot', 4.9, 293, ARRAY['Nephrology'], 0, 'low', true, true, '#2563EB', 'Maha Puja Dham Chowk, 4th Floor, Miracle Doctor House, opposite Tata Parin, 150 Feet Ring Road, Rajkot, Gujarat 360004', '+91 79904 59186', 'Mon-Sat 24 hours; Sunday closed', 'Mon-Sat 24 hours; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Nephron Kidney Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sterling Hospitals - Rajkot', 'Private', 'Dharam Nagar, Rajkot', 4.8, 13252, ARRAY['General Medicine','General Surgery','Emergency Medicine'], 0, 'low', true, true, '#2563EB', 'Plot No. 251, near Gandhigram Police Station, 150 Feet Ring Road, opposite Gandhigram, Rajkot, Gujarat 360007', '+91 98989 87878', '24/7 emergency per official contact site', '24/7 emergency per official contact site'
where not exists (select 1 from public.hospitals where name = 'Sterling Hospitals - Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'HCG Hospitals, Rajkot', 'Private', 'Bajrang Wadi, Rajkot', 4.8, 8160, ARRAY['General Medicine','General Surgery','Oncology','Cardiology','Critical Care'], 0, 'low', true, true, '#2563EB', 'Ayodhya Chowk, HCG Hospital Road, near Astha Avenue, off 150 Feet Ring Road, Rajkot, Gujarat 360005', '+91 63588 88817', 'Emergency care 24/7', 'Emergency care 24/7'
where not exists (select 1 from public.hospitals where name = 'HCG Hospitals, Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Giriraj Hospital', 'Private', 'Jagannath Plot, Rajkot', 4.8, 4332, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', '27, Navjyot Park, 150 Feet Ring Road, Rajkot, Gujarat 360005', '+91 76000 75675', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Shree Giriraj Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'CIGIS Hospital', 'Private', 'Mavdi, Rajkot', 4.8, 1708, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Near Dholakia School, CIGIS Hospital Road, near Balaji Hall, Dharam Nagar, Mavdi, Rajkot, Gujarat 360004', '+91 81606 50099', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'CIGIS Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Wellplus Hospital', 'Private', 'Bhakti Nagar, Rajkot', 4.9, 156, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', '5, Street Number 1, Manhar Plot Corner, Vijay Plot, Bhakti Nagar, Rajkot, Gujarat 360002', '+91 99749 92007', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Wellplus Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Ashtavasu Ayurveda Panchkarma & Strirog Hospital', 'Private', 'Nana Mava, Rajkot', 5, 77, ARRAY['Ayurveda','Panchkarma','Gynecology'], 0, 'low', true, false, '#2563EB', '206-207, Nana Mava Road, near Edu Mall, Shastri Nagar Society, Maruti Nagar, Nana Mava, Rajkot, Gujarat 360005', '+91 93281 53362', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Ashtavasu Ayurveda Panchkarma & Strirog Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Trinity Hospital - Orthopaedic Surgeon', 'Private', 'Chandreshnagar, Rajkot', 4.8, 578, ARRAY['Orthopedics'], 0, 'low', true, true, '#2563EB', 'Opposite Marwadi Building, Nana Mava Main Road, near Nana Mava Circle, off 150 Feet Ring Road, Chandreshnagar, Rajkot, Gujarat 360004', '+91 93693 93493', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Trinity Hospital - Orthopaedic Surgeon');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sarthak Hospital & ICU', 'Private', 'Karan Park, Rajkot', 4.8, 345, ARRAY['Critical Care'], 0, 'low', true, true, '#2563EB', '3rd Floor, Ambition+, beside Flowrence Hospital, Rajnagar Chowk, Nana Mava Road, Rajkot, Gujarat 360001', '+91 94099 33332', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Sarthak Hospital & ICU');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Phoenix Hospital & ICU', 'Private', 'Chandreshnagar, Rajkot', 4.8, 196, ARRAY['Critical Care'], 0, 'low', true, true, '#2563EB', '2nd Floor, Doctor Miracle, 150 Feet Ring Road, near Twin Star, opposite Balaji Hall, Rajkot, Gujarat 360004', null, 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Phoenix Hospital & ICU');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Vasant Hospital', 'Private', 'Uday Nagar, Rajkot', 5, 54, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', 'Navalnagar Street 9, Mavdi Main Road, Rajkot, Gujarat 360004', '+91 81560 00907', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Shree Vasant Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Mind Plus Hospital', 'Private', 'Nana Mava, Rajkot', 5, 51, ARRAY['Psychiatry'], 0, 'low', true, false, '#2563EB', 'Pacific Plaza, 3rd Floor, Nana Mava Road, opposite Shastri Nagar, beside Edu Mall, Rajkot, Gujarat 360005', '+91 95125 12594', 'Mon-Sat 09:30-13:00 and 17:00-20:00; Sunday closed', 'Mon-Sat 09:30-13:00 and 17:00-20:00; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Mind Plus Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Gokul Hospital Rajkot', 'Private', 'Bhakti Nagar, Rajkot', 4.7, 1293, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', '12/14, Vidya Nagar Main Road, Manhar Plot, Bhakti Nagar, Rajkot, Gujarat 360002', '+91 99043 99043', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Gokul Hospital Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vedant Multispeciality Hospital', 'Private', 'Sadar, Rajkot', 4.7, 1192, ARRAY['General Medicine','General Surgery'], 0, 'low', true, false, '#2563EB', 'Locality: Sadar, Rajkot, Gujarat (full street address not verified)', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Vedant Multispeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Maruti Multispeciality Hospital', 'Private', 'Mavdi, Rajkot', 4.9, 59, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Padmi Society, Mavdi, Rajkot, Gujarat 360005', '+91 75673 15391', 'Mon-Sat 24 hours; Sunday closed', 'Mon-Sat 24 hours; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Maruti Multispeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Mothercare Hospital & Maternity Home', 'Private', 'Bajrang Wadi, Rajkot', 4.8, 105, ARRAY['Obstetrics','Gynecology'], 0, 'low', true, false, '#2563EB', 'Locality: Bajrang Wadi, Rajkot, Gujarat (full street address not verified)', '+91 82009 57656', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Mothercare Hospital & Maternity Home');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'MAAHI Newborn Care Center', 'Private', 'Madhur Nagar, Rajkot', 4.7, 501, ARRAY['Pediatrics'], 0, 'low', true, true, '#2563EB', 'Locality: Madhur Nagar, Rajkot, Gujarat (full street address not verified)', '0281-2585108', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'MAAHI Newborn Care Center');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Orient Hospital Nursing Home and Diabetic Care Center', 'Private', 'Chandreshnagar, Rajkot', 5, 30, ARRAY['Diabetes Care'], 0, 'low', true, false, '#2563EB', 'Locality: Chandreshnagar, Rajkot, Gujarat (full street address not verified)', null, 'Mon-Sat 10:00-22:00; Sunday closed', 'Mon-Sat 10:00-22:00; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Orient Hospital Nursing Home and Diabetic Care Center');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Saurashtra Multispeciality Hospital', 'Private', 'Bhakti Nagar, Rajkot', 4.8, 66, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Dhebar Road, above Anand Medicines, near Bhakti Nagar Circle, Udhyog Nagar Colony, Bhakti Nagar, Rajkot, Gujarat 360002', null, 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Saurashtra Multispeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Matrutva Maternity & Surgical Hospital', 'Private', 'Gandhigram, Rajkot', 4.9, 40, ARRAY['Obstetrics','General Surgery'], 0, 'low', true, false, '#2563EB', 'Locality: Gandhigram, Rajkot, Gujarat (full street address not verified)', '+91 70285 30811', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Matrutva Maternity & Surgical Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Maheshwari Eye Care Hospital', 'Private', 'Sadar, Rajkot', 4.7, 164, ARRAY['Ophthalmology'], 0, 'low', true, false, '#2563EB', 'Locality: Sadar, Rajkot, Gujarat (full street address not verified)', '+91 90818 77771', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Maheshwari Eye Care Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Saarthi Hospital', 'Private', 'Bhakti Nagar, Rajkot', 4.7, 120, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', 'Locality: Bhakti Nagar, Rajkot, Gujarat (full street address not verified)', '+91 77779 26688', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Saarthi Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Sanjivani Hospital - Rajkot', 'Private', 'Mavdi, Rajkot', 4.8, 53, ARRAY['General Medicine'], 0, 'low', true, false, '#2563EB', 'Locality: Mavdi, Rajkot, Gujarat (full street address not verified)', '+91 79906 35543', 'Mon-Sat 09:00-13:00 and 17:00-20:00; Sunday closed', 'Mon-Sat 09:00-13:00 and 17:00-20:00; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Shree Sanjivani Hospital - Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vraj Hospital', 'Private', 'Mavdi, Rajkot', 4.8, 53, ARRAY['General Medicine'], 0, 'low', true, false, '#2563EB', 'Locality: Mavdi, Rajkot, Gujarat (full street address not verified)', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Vraj Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Samarpan Hospital', 'Private', 'Gandhigram, Rajkot', 4.8, 46, ARRAY['General Medicine'], 0, 'low', true, false, '#2563EB', 'Locality: Gandhigram, Rajkot, Gujarat (full street address not verified)', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shree Samarpan Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Hitayu Piles Hospital', 'Private', 'Uday Nagar, Rajkot', 4.8, 44, ARRAY['Proctology'], 0, 'low', true, false, '#2563EB', 'Locality: Uday Nagar, Rajkot, Gujarat (full street address not verified)', '+91 95749 55998', 'Mon-Sat 09:00-13:30 and 17:00-20:00; Sunday closed', 'Mon-Sat 09:00-13:30 and 17:00-20:00; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Hitayu Piles Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Elegant Minds Hospital', 'Private', 'Chandreshnagar, Rajkot', 5, 21, ARRAY['Psychiatry'], 0, 'low', true, false, '#2563EB', 'Locality: Chandreshnagar, Rajkot, Gujarat (full street address not verified)', '+91 92270 99011', 'Mon-Sat 09:30-20:30; Sunday closed', 'Mon-Sat 09:30-20:30; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Elegant Minds Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vatsalya Clinical Hospital (Clinic)', 'Private', 'Yogi Nagar, Rajkot (Clinic)', 5, 21, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Locality: Yogi Nagar, Rajkot, Gujarat (full street address not verified)', '+91 98981 70407', 'Mon-Sat 09:00-13:30 and 17:00-21:00; Sunday 10:00-13:00 and 18:00-20:00', 'Mon-Sat 09:00-13:30 and 17:00-21:00; Sunday 10:00-13:00 and 18:00-20:00'
where not exists (select 1 from public.hospitals where name = 'Vatsalya Clinical Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Little Wings Kids Dental Hospital (Clinic)', 'Private', 'Arya Nagar, Rajkot (Clinic)', 4.9, 25, ARRAY['Dental'], 0, 'low', true, false, '#059669', 'Locality: Arya Nagar, Rajkot, Gujarat (full street address not verified)', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Little Wings Kids Dental Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Satvik Hospital', 'Private', 'Bhakti Nagar, Rajkot', 4.7, 59, ARRAY['General Medicine'], 0, 'low', true, false, '#2563EB', 'Locality: Bhakti Nagar, Rajkot, Gujarat (full street address not verified)', '+91 77780 24024', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Satvik Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Balaji Multispeciality Hospital Rajkot', 'Private', 'Karanpara, Rajkot', 4.6, 278, ARRAY['General Medicine','General Surgery'], 0, 'low', true, false, '#2563EB', 'Locality: Karanpara, Rajkot, Gujarat (full street address not verified)', '+91 80131 10110', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Balaji Multispeciality Hospital Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Saviour Hospital - Critical Care Unit', 'Private', 'Bhakti Nagar, Rajkot', 5, 15, ARRAY['Critical Care'], 0, 'low', true, true, '#2563EB', 'Locality: Bhakti Nagar, Rajkot, Gujarat (full street address not verified)', '+91 95120 49942', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Saviour Hospital - Critical Care Unit');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Miracle Doctor House (Clinic)', 'Private', 'Mavdi, Rajkot (Clinic)', 4.7, 40, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Locality: Mavdi, Rajkot, Gujarat (full street address not verified)', '+91 90909 02044', 'Mon-Sat 09:00-20:00; Sunday closed', 'Mon-Sat 09:00-20:00; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Miracle Doctor House (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shivam Clinic & Physio Fitness (Clinic)', 'Private', 'Arya Nagar, Rajkot (Clinic)', 5, 12, ARRAY['Primary Care','Physiotherapy'], 0, 'low', true, false, '#059669', 'Locality: Arya Nagar, Rajkot, Gujarat (full street address not verified)', '+91 97265 00142', 'Mon-Sat 09:00-21:30; Sunday 09:00-13:30', 'Mon-Sat 09:00-21:30; Sunday 09:00-13:30'
where not exists (select 1 from public.hospitals where name = 'Shivam Clinic & Physio Fitness (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Parin Hospital', 'Private', 'Mavdi, Rajkot', 4.8, 21, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', 'Locality: Mavdi, Rajkot, Gujarat (full street address not verified)', '+91 88492 27117', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Parin Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Mantra Hospital', 'Private', 'Rama Krishan Nagar, Rajkot', 4.9, 12, ARRAY['General Medicine'], 0, 'low', true, false, '#2563EB', 'Locality: Rama Krishan Nagar, Rajkot, Gujarat (full street address not verified)', '+91 95373 95364', 'Mon-Sat 09:00-21:00; Sunday 09:00-12:30', 'Mon-Sat 09:00-21:00; Sunday 09:00-12:30'
where not exists (select 1 from public.hospitals where name = 'Mantra Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sadbhavna Multispeciality Hospital', 'Private', 'Gandhigram, Rajkot', 4.5, 276, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', '150 Feet Ring Road, Gandhigram, Rajkot, Gujarat', '+91 95123 10108', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Sadbhavna Multispeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Aakar Hospital', 'Private', 'Rama Krishan Nagar, Rajkot', 4.4, 26, ARRAY['General Medicine'], 0, 'low', true, false, '#2563EB', 'Locality: Rama Krishan Nagar, Rajkot, Gujarat (full street address not verified)', '0281-2465333', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Aakar Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Saket Hospital', 'Private', 'Chandreshnagar, Rajkot', 4.4, 42, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', 'Locality: Chandreshnagar, Rajkot, Gujarat (full street address not verified)', null, 'Mon-Sat 24 hours; Sunday closed', 'Mon-Sat 24 hours; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Saket Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Samyak Lungs & Critical Care Hospital', 'Private', 'Chandreshnagar, Rajkot', 4.4, 101, ARRAY['Pulmonology','Critical Care'], 0, 'low', true, true, '#2563EB', 'Locality: Chandreshnagar, Rajkot, Gujarat (full street address not verified)', '+91 99137 55551', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Samyak Lungs & Critical Care Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Medicare Multispeciality Hospital', 'Private', 'Chandreshnagar, Rajkot', 4.4, 227, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Locality: Chandreshnagar, Rajkot, Gujarat (full street address not verified)', '+91 92001 08108', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Medicare Multispeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shreyas Multi Speciality Hospital and Digital Care Center', 'Private', 'Vidya Nagar, Rajkot', 4.3, 12, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Locality: Vidya Nagar, Rajkot, Gujarat (full street address not verified)', '0281-2464818', 'Mon-Sat 24 hours; Sunday closed', 'Mon-Sat 24 hours; Sunday closed'
where not exists (select 1 from public.hospitals where name = 'Shreyas Multi Speciality Hospital and Digital Care Center');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'H. J. Doshi Hospital', 'Private', 'Malaviya Nagar, Rajkot', 4, 503, ARRAY['General Medicine'], 0, 'low', true, true, '#2563EB', 'Locality: Malaviya Nagar, Rajkot, Gujarat (full street address not verified)', '+91 72111 40118', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'H. J. Doshi Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Saurashtra Children Hospital', 'Private', 'Karan Park, Rajkot', 3.8, 114, ARRAY['Pediatrics'], 0, 'low', true, true, '#2563EB', 'Locality: Karan Park, Rajkot, Gujarat (full street address not verified)', '+91 72111 48002', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Saurashtra Children Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Jalaram Raghukul Sarvajanik Hospital', 'Private', 'Kotecha Nagar, Rajkot', 3.8, 230, ARRAY['General Medicine','General Surgery'], 0, 'low', true, true, '#2563EB', 'Locality: Kotecha Nagar, Rajkot, Gujarat (full street address not verified)', '0281-2450553', 'Open 24 hours', 'Open 24 hours'
where not exists (select 1 from public.hospitals where name = 'Shree Jalaram Raghukul Sarvajanik Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Krushnam Child Care (Clinic)', 'Private', 'Dharam Nagar, Rajkot (Clinic)', 5, 130, ARRAY['Pediatrics'], 0, 'low', true, false, '#059669', 'Locality: Dharam Nagar, Rajkot, Gujarat (full street address not verified)', '+91 95583 33648', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Krushnam Child Care (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shiv Hospital - A Multispeciality Hospital (Clinic)', 'Private', 'Mavdi, Rajkot (Clinic)', 4.9, 2756, ARRAY['General Medicine','General Surgery','Orthopedics'], 0, 'low', true, false, '#059669', 'Mahapuja Dham Chowk, 150 Feet Ring Road, near Balaji Hall, Rajkot, Gujarat 360005', '+91 96389 01000', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shiv Hospital - A Multispeciality Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Nimavat Clinic (Clinic)', 'Private', 'Dharam Nagar, Rajkot (Clinic)', 5, 83, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Locality: Dharam Nagar, Rajkot, Gujarat (full street address not verified)', '+91 97255 52020', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Nimavat Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shreeji Homoeopathic Multispeciality Clinic (Clinic)', 'Private', 'Maruti Nagar, Rajkot (Clinic)', 4.9, 600, ARRAY['Homeopathy'], 0, 'low', true, false, '#059669', 'Locality: Maruti Nagar, Rajkot, Gujarat (full street address not verified)', '+91 88665 91024', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shreeji Homoeopathic Multispeciality Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Naari Women''s Hospital (Clinic)', 'Private', 'Mavdi, Rajkot (Clinic)', 4.9, 124, ARRAY['Obstetrics','Gynecology'], 0, 'low', true, false, '#059669', 'Mahapooja Dham Chowk, 202-203, RK Prime Plus, 150 Feet Ring Road, near Balaji Hall, Padmi Society, Mavdi, Rajkot, Gujarat 360005', '+91 78378 17878', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Naari Women''s Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Miracle Women''s Hospital (Clinic)', 'Private', 'Mavdi, Rajkot (Clinic)', 4.8, 294, ARRAY['Obstetrics','Gynecology'], 0, 'low', true, false, '#059669', '5th Floor, Miracle Doctor House, Balaji Hall, 150 Feet Ring Road, Aditya Park, Mavdi, Rajkot, Gujarat 360004', '+91 90909 02044', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Miracle Women''s Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Dr Denish Patel Spine Clinic (Clinic)', 'Private', 'Chandreshnagar, Rajkot (Clinic)', 4.8, 102, ARRAY['Orthopedics'], 0, 'low', true, false, '#059669', '4th Floor, Miracle Doctor House, 150 Feet Ring Road, near Mahapujadham Chowk, opposite Balaji Hall, Rajkot, Gujarat 360004', '+91 79906 62958', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Dr Denish Patel Spine Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Clinic, Samrat Industrial Area (Clinic)', 'Private', 'Samrat Industrial Area, Rajkot (Clinic)', 5, 12, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Behind / beside Ankur Vidhyalaya, Ankur Nagar Main Road, Gokuldham Society, Krishna Nagar, Rajkot, Gujarat 360004', '+91 81601 74409', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shree Clinic, Samrat Industrial Area (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shifa Dental Care (Dr Batul Vhora) (Clinic)', 'Private', 'Bhagvati Para, Rajkot (Clinic)', 4.9, 19, ARRAY['Dental'], 0, 'low', true, false, '#059669', 'Main Road, near Metro Medical Shop, Bhagvati Para, Rajkot, Gujarat 360003', '+91 63561 47000', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shifa Dental Care (Dr Batul Vhora) (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vitality Homeopathic Clinic - Rajkot (Clinic)', 'Private', 'Rohidaspra, Rajkot (Clinic)', 5, 9, ARRAY['Homeopathy'], 0, 'low', true, false, '#059669', 'Amrut Heights, near Samarpan Party Plot, 50 Feet Road, Rajkot, Gujarat 360003', '+91 70430 39075', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Vitality Homeopathic Clinic - Rajkot (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Giriraj Clinic (Clinic)', 'Private', 'Ranchhod Nagar, Rajkot (Clinic)', 5, 8, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', '16, Ranchod Nagar Society, Ranchhod Nagar, Rajkot, Gujarat 360003', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Giriraj Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shreenathji Clinic (Clinic)', 'Private', 'Mavdi, Rajkot (Clinic)', 5, 8, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Shop 3-4, Sagar, 50 Feet Road, near Balaji Hall, Rajkot, Gujarat 360005', '+91 90334 17350', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shreenathji Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Clinic Dr Nirali (Clinic)', 'Private', 'Marketing Yard, Rajkot (Clinic)', 4.9, 13, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'New Shakti Society, Street No. 4, Sant Kabir Main Road, opposite Old Marketing Yard, Rajkot, Gujarat 360003', '+91 79764 80905', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shree Clinic Dr Nirali (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Riddhi Clinic Mehulnagar Main Road No. 7 Corner (Clinic)', 'Private', 'Jangleshwar, Rajkot (Clinic)', 4.9, 9, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', '7RG7+RMM, Jangleshwar Road, Mehul Nagar, Jangleshwar, Rajkot, Gujarat 360002', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Riddhi Clinic Mehulnagar Main Road No. 7 Corner (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Sadbhavna Clinic (Clinic)', 'Private', 'GIDC, Rajkot (Clinic)', 5, 5, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Radhe Residency, Jain Derasar Main Road, Bharat Nagar, GIDC, Rajkot, Gujarat 360003', null, 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Shree Sadbhavna Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Umiya Medical Store / Clinic listing (Clinic)', 'Private', 'Chandreshnagar, Rajkot (Clinic)', 5, 5, ARRAY['General Medicine'], 0, 'low', true, false, '#059669', 'Kahijda Road, Chandreshnagar Main Road, opposite Jalaram Jambu, Rajkot, Gujarat 360004', '+91 98984 59498', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Umiya Medical Store / Clinic listing (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Ashirwad Clinic (Clinic)', 'Private', 'Jai Nandan Nagar, Rajkot (Clinic)', 4.9, 7, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Pramukh-Darshan Complex, 50 Feet Main Road, near old Morbi Road, behind Giriraj Party Plot, Rajkot, Gujarat 360003', '+91 70488 20683', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Ashirwad Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sapna Naturopathy & Panchkarma Clinic (Clinic)', 'Private', 'Rohidaspra, Rajkot (Clinic)', 4.8, 8, ARRAY['Naturopathy','Panchkarma'], 0, 'low', true, false, '#059669', 'Locality: Rohidaspra, Rajkot, Gujarat (full street address not verified)', '+91 96246 73107', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Sapna Naturopathy & Panchkarma Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Aarogyam Clinic (Clinic)', 'Private', 'Arya Nagar, Rajkot (Clinic)', 4.8, 5, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Locality: Arya Nagar, Rajkot, Gujarat (full street address not verified)', '+91 99047 99464', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Aarogyam Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Dr Heli''s Clinic of Skin (Clinic)', 'Private', 'Junction Plot, Rajkot (Clinic)', 4.6, 33, ARRAY['Dermatology'], 0, 'low', true, false, '#059669', 'Locality: Junction Plot, Rajkot, Gujarat (full street address not verified)', '+91 72111 05556', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Dr Heli''s Clinic of Skin (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Junction Plot Urban Health Center (Clinic)', 'Private', 'Junction Plot, Rajkot (Clinic)', 4.5, 15, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Locality: Junction Plot, Rajkot, Gujarat (full street address not verified)', '+91 97235 52016', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Junction Plot Urban Health Center (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Dr Kansagra''s Clinic (Clinic)', 'Private', 'Sadar, Rajkot (Clinic)', 2.5, 8, ARRAY['Primary Care'], 0, 'low', true, false, '#059669', 'Locality: Sadar, Rajkot, Gujarat (full street address not verified)', '0281-2388943', 'Contact hospital', 'Contact hospital'
where not exists (select 1 from public.hospitals where name = 'Dr Kansagra''s Clinic (Clinic)');

-- DOCTORS (11)
insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Milan Nathvani', 'General Medicine', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Milan Nathvani — General Medicine in Gandhigram, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['General Medicine']
where not exists (select 1 from public.doctors where name = 'Dr Milan Nathvani');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Kunjesh Rupapara', 'Pulmonology', (select id from hospitals where name = 'Omega Hospital & ICU'), 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Kunjesh Rupapara — Pulmonology in Mavdi, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Pulmonology']
where not exists (select 1 from public.doctors where name = 'Dr Kunjesh Rupapara');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Hemali Karia', 'Obstetrics', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Hemali Karia — Obstetrics, Gynecology in Gandhigram, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Obstetrics','Gynecology']
where not exists (select 1 from public.doctors where name = 'Dr Hemali Karia');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Monil Parsana', 'General Medicine', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Monil Parsana — General Medicine in Bajrang Wadi, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['General Medicine']
where not exists (select 1 from public.doctors where name = 'Dr Monil Parsana');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Kaushal Patel', 'Orthopedics', (select id from hospitals where name = 'Shiv Hospital - A Multispeciality Hospital (Clinic)'), 4.9, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr. Kaushal Patel — Orthopedics in Mavdi, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Orthopedics']
where not exists (select 1 from public.doctors where name = 'Dr. Kaushal Patel');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Aditya Kandoriya Liver', 'Gastroenterology', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Aditya Kandoriya Liver — Gastroenterology in Gandhigram, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Gastroenterology']
where not exists (select 1 from public.doctors where name = 'Dr Aditya Kandoriya Liver');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Ravi Bhojani', 'Cardiology', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Ravi Bhojani — Cardiology in Radhika Park, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Cardiology']
where not exists (select 1 from public.doctors where name = 'Dr Ravi Bhojani');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Gautam Makadia - Oncologist & Hematologist', 'Oncology', (select id from hospitals where name = 'CIGIS Hospital'), 4.8, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Gautam Makadia - Oncologist & Hematologist — Oncology, Hematology in Mavdi, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Oncology','Hematology']
where not exists (select 1 from public.doctors where name = 'Dr Gautam Makadia - Oncologist & Hematologist');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Saumya Sapariya Urologist Rajkot', 'Urology', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Saumya Sapariya Urologist Rajkot — Urology in Bajrang Wadi, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Urology']
where not exists (select 1 from public.doctors where name = 'Dr Saumya Sapariya Urologist Rajkot');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr Tushar Bhatti', 'Cardiology', null, 5, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr Tushar Bhatti — Cardiology in Radhika Park, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['Cardiology']
where not exists (select 1 from public.doctors where name = 'Dr Tushar Bhatti');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr R. U. Motwani', 'General Medicine', null, 4.6, 'Contact clinic', ARRAY['Gujarati','Hindi','English'], 0, 'Contact clinic', 'Dr R. U. Motwani — General Medicine in Shastri Nagar, Rajkot. Public listing; verify before visiting.', '{}', ARRAY['General Medicine']
where not exists (select 1 from public.doctors where name = 'Dr R. U. Motwani');

-- MEDICINES (12)
insert into public.medicines (name, generic, category, uses, dosage, side_effects, price_range) values
('Paracetamol', 'Acetaminophen', 'Pain Relief', 'Fever, mild to moderate pain, headache', '500-1000mg every 4-6 hours', 'Rare: liver damage with overdose', '₹10 - ₹50'),
('Amoxicillin', 'Amoxicillin', 'Antibiotic', 'Bacterial infections, pneumonia, bronchitis', '250-500mg every 8 hours', 'Nausea, diarrhea, rash', '₹50 - ₹200'),
('Metformin', 'Metformin HCl', 'Antidiabetic', 'Type 2 diabetes management', '500mg twice daily with meals', 'GI upset, metallic taste', '₹30 - ₹150'),
('Azithromycin', 'Azithromycin', 'Antibiotic', 'Respiratory infections, skin infections', '500mg once daily for 3-5 days', 'Nausea, abdominal pain', '₹80 - ₹300'),
('Cetirizine', 'Cetirizine HCl', 'Antihistamine', 'Allergies, hay fever, urticaria', '10mg once daily', 'Drowsiness, dry mouth', '₹15 - ₹60'),
('Salbutamol', 'Albuterol', 'Bronchodilator', 'Asthma, COPD, bronchospasm', '100mcg inhaler, 2 puffs as needed', 'Tremor, tachycardia, headache', '₹100 - ₹400'),
('Omeprazole', 'Omeprazole', 'Antacid', 'Gastric ulcers, GERD, acid reflux', '20-40mg once daily before meals', 'Headache, nausea, abdominal pain', '₹40 - ₹180'),
('Atorvastatin', 'Atorvastatin Calcium', 'Statin', 'High cholesterol, prevention of cardiovascular events', '10-20mg once daily', 'Muscle pain, liver enzyme elevation', '₹60 - ₹250'),
('Amlodipine', 'Amlodipine Besylate', 'Calcium Channel Blocker', 'Hypertension, angina', '5-10mg once daily', 'Ankle swelling, dizziness, flushing', '₹30 - ₹120'),
('Losartan', 'Losartan Potassium', 'ARB', 'Hypertension, diabetic nephropathy', '50mg once daily', 'Dizziness, hyperkalemia', '₹40 - ₹160'),
('Pantoprazole', 'Pantoprazole Sodium', 'Antacid', 'GERD, peptic ulcers, erosive esophagitis', '40mg once daily before meals', 'Headache, diarrhea, nausea', '₹50 - ₹200'),
('Clopidogrel', 'Clopidogrel Bisulfate', 'Antiplatelet', 'Prevent heart attack and stroke', '75mg once daily', 'Bleeding, bruising, GI upset', '₹80 - ₹300');
