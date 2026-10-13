-- ============================================================
-- Swasthya Setu — Real Rajkot Seed (from user PDF table)
-- 25 hospitals + 15 clinics (stored in hospitals) + 15 doctors
-- Run ONCE after schema.sql. Uses WHERE NOT EXISTS to stay idempotent.
-- ============================================================

-- ---------- HOSPITALS: Private (18) ----------
insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Wockhardt Hospitals', 'Private', 'Gondal Road, Rajkot', 4.6, 2100, ARRAY['Cardiology','Neurology','Orthopaedics','Urology','Gastroenterology','Oncology','IVF','Robotic Surgery'], 3.5, 'medium', true, true, '#0D7377', 'Gondal Road, Near Mahila College Chowkdi, Rajkot - 360002', '0281-669 4444', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Wockhardt Hospitals');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sterling Hospitals', 'Private', '150 Feet Ring Road, Rajkot', 4.5, 1800, ARRAY['Cardiology','Gastroenterology','Neurosciences','Orthopaedics','Trauma','Renal Sciences'], 4.0, 'medium', true, true, '#2563EB', '150 Feet Ring Road, Raiya Circle, Rajkot - 360007', '0281-669 3333', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Sterling Hospitals');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Giriraj Hospital (Main)', 'Private', '150 Ft Ring Road, Rajkot', 4.4, 1200, ARRAY['Cardiology','Neurology','Neuro & Spine Surgery','Gastroenterology','Urology','Nephrology','Orthopaedics','Oncology'], 4.2, 'low', true, true, '#059669', '27 Navjyot Park, 150 Ft Ring Road, Rajkot - 360005', '+91 9909971130', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Shree Giriraj Hospital (Main)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shree Giriraj Hospital (Kuvadva)', 'Private', 'Kuvadva, Rajkot', 4.3, 600, ARRAY['Cardiology','Neurology','Orthopaedics','Oncology','Critical Care'], 8.5, 'low', true, true, '#059669', 'Plot No. 28-30, Near Wankaner Chowkdi, Kuvadva, Rajkot - 360023', '+91 9909971130', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Shree Giriraj Hospital (Kuvadva)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'HCG Hospitals Rajkot', 'Private', 'Rajkot', 4.4, 1500, ARRAY['Internal Medicine','General Surgery','Orthopaedics','Cardiothoracic Surgery','GI & Laparoscopic Surgery'], 5.0, 'medium', true, true, '#C2410C', 'Rajkot, Gujarat', null, 'Open 24/7', 'Mon-Sat · 9:00 AM - 6:00 PM'
where not exists (select 1 from public.hospitals where name = 'HCG Hospitals Rajkot');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Krishna Hospital & ICU', 'Private', 'University Road, Rajkot', 4.2, 800, ARRAY['Cardiology','General Surgery','Orthopaedics','Pulmonology'], 2.5, 'low', true, true, '#7C3AED', 'University Road, Rajkot - 360005', '0281-244 3333', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Krishna Hospital & ICU');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Synergy Hospital', 'Private', '150 Feet Ring Road, Rajkot', 4.3, 700, ARRAY['Cardiology','Gastroenterology','Urology','Oncology'], 4.1, 'low', true, true, '#0891B2', '150 Feet Ring Road, Rajkot - 360007', '0281-662 2222', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Synergy Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Gokul Superspeciality Hospital', 'Private', 'Astron Chowk, Rajkot', 4.3, 900, ARRAY['Neurosurgery','Orthopedics','Cardiac Care','Pediatrics'], 2.0, 'medium', true, true, '#BE185D', 'Astron Chowk, Rajkot - 360001', '0281-222 6600', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Gokul Superspeciality Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Gokul Hospital (Gondal Road)', 'Private', 'Gondal Road, Rajkot', 4.1, 500, ARRAY['General Medicine','Orthopedics','Cardiac Care'], 3.0, 'low', true, true, '#BE185D', 'Gondal Road, Rajkot - 360004', '0281-236 3366', 'Open 24/7', 'Mon-Sat · 9:00 AM - 8:00 PM'
where not exists (select 1 from public.hospitals where name = 'Gokul Hospital (Gondal Road)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Aakar Hospital', 'Private', 'Virani Chowk, Rajkot', 4.0, 300, ARRAY['General Medicine','General Surgery'], 2.8, 'low', true, true, '#0D7377', 'Ramkrishna Nagar, Near Virani Chowk, Rajkot - 360002', '0281-2465444', 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Aakar Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Yash Hospital', 'Private', 'Vidhyanagar Main Road, Rajkot', 4.0, 250, ARRAY['General Medicine','General Surgery'], 3.2, 'low', true, true, '#0D7377', '#7,8, Manau Plot, Vidhyanagar Main Road, Rajkot - 360002', '9727583833', 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Yash Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Olympus Hospital', 'Private', 'Vidhyanagar Main Road, Rajkot', 4.0, 200, ARRAY['General Medicine'], 3.3, 'low', true, true, '#0D7377', 'Vidhyanagar Main Road, Rajkot', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Olympus Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sadbhavna Hospital & Med Research Centre', 'Private', 'Gandhigram, Rajkot', 4.1, 280, ARRAY['General Medicine','Research'], 4.5, 'low', true, true, '#0D7377', '150 ft Ring Road, Gandhigram, Opp. Police Station, Rajkot - 360007', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Sadbhavna Hospital & Med Research Centre');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Flowrence Hospital', 'Private', 'Nana Mava Main Road, Rajkot', 4.0, 220, ARRAY['General Medicine'], 5.0, 'low', true, true, '#0D7377', 'Near Rajnagar Circle, Nana Mava Main Road, Rajkot', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Flowrence Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vedant Hospital', 'Private', 'Rajkot', 4.0, 180, ARRAY['General Medicine'], 4.0, 'low', true, true, '#0D7377', 'Rajkot', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Vedant Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Satnam Hospital', 'Private', 'Rajkot', 4.0, 170, ARRAY['General Medicine'], 4.0, 'low', true, true, '#0D7377', 'Rajkot', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Satnam Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Pulse Plus Multispecialty Hospital', 'Private', 'Rajkot', 4.1, 190, ARRAY['General Medicine'], 4.5, 'low', true, true, '#0D7377', 'Rajkot', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Pulse Plus Multispecialty Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Advait Multispeciality Hospital', 'Private', 'Rajkot', 4.1, 160, ARRAY['General Medicine'], 4.5, 'low', true, true, '#0D7377', 'Rajkot', null, 'Mon-Sat · 8:00 AM - 8:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Advait Multispeciality Hospital');

-- ---------- HOSPITALS: Government (7) ----------
insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Rajkot Civil Hospital', 'Govt', 'Hospital Chowk, Rajkot', 4.2, 3000, ARRAY['General Medicine','Surgery','Orthopedics','Gynecology','Pediatrics','Cardiology','Emergency Medicine'], 1.5, 'busy', true, true, '#059669', 'Jamnagar Road, Hospital Chowk, Opp. SBI, Rajkot - 360001', '0281-2471118', 'Open 24/7', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Rajkot Civil Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Pandit Deendayal Upadhyay General Hospital', 'Govt', 'Rajkot', 4.0, 1200, ARRAY['General Medicine','Surgery','Obstetrics & Gynecology','Pediatrics','Emergency Care'], 1.8, 'medium', true, true, '#059669', 'Rajkot, Gujarat - 360001', '0281-2450300', 'Open 24/7', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Pandit Deendayal Upadhyay General Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Gujarat Cancer Society Hospital', 'Govt', 'Rajkot', 4.3, 700, ARRAY['Oncology','Radiation Therapy','Chemotherapy','Surgical Oncology'], 3.0, 'medium', true, true, '#059669', 'Rajkot, Gujarat - 360005', '0281-2572321', 'Mon-Sat · 8:00 AM - 6:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Gujarat Cancer Society Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'G.T. Sheth Govt. Eye Hospital', 'Govt', 'Jamnagar Road, Rajkot', 4.4, 650, ARRAY['Ophthalmology','Eye Surgery'], 1.6, 'low', true, true, '#059669', 'PDU Medical College, Jamnagar Road, Nr. Jam Tower, Rajkot - 360001', '0281-2447485', 'Mon-Sat · 8:00 AM - 6:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'G.T. Sheth Govt. Eye Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Janana Hospital', 'Govt', 'Hospital Chowk, Rajkot', 4.1, 500, ARRAY['Women Health','Gynecology'], 1.5, 'low', true, true, '#059669', 'Hospital Chowk, Rajkot', '0281-2228026', 'Open 24/7', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'Janana Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'K.T. Children Govt. Hospital', 'Govt', 'Civil Hospital Campus, Rajkot', 4.2, 550, ARRAY['Pediatrics','Child Health'], 1.5, 'medium', true, true, '#059669', 'Civil Hospital Campus, Jamnagar Road, Rajkot - 360001', '0281-2476402', 'Open 24/7', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'K.T. Children Govt. Hospital');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'ESIC Hospital', 'Govt', 'Bhavnagar Road, Rajkot', 3.9, 400, ARRAY['General Medicine'], 6.0, 'low', true, true, '#059669', 'Dudh Sagar Main Road, Near Gopal Dairy, Bhavnagar Road, Rajkot - 360003', '0281-2703654', 'Mon-Sat · 8:00 AM - 6:00 PM', 'Mon-Sat · 9:00 AM - 1:00 PM'
where not exists (select 1 from public.hospitals where name = 'ESIC Hospital');

-- ---------- CLINICS (stored in hospitals, location marks Clinic) ----------
insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Dr. Morjaria Advanced Dental Clinic (Clinic)', 'Private', 'Rajkot (Clinic)', 5.0, 186, ARRAY['Dental'], 3.0, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Dr. Morjaria Advanced Dental Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Adiva Centre For Skin & Hair (Clinic)', 'Private', 'Rajkot (Clinic)', 4.5, 83, ARRAY['Dermatology','Hair Treatment'], 3.0, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Adiva Centre For Skin & Hair (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Bavishi Eye Hospital & Phacoemulsification Center (Clinic)', 'Private', 'Vidhyanagar Main Rd, Rajkot (Clinic)', 4.4, 100, ARRAY['Ophthalmology','Cataract Surgery'], 3.1, 'low', true, true, '#0D7377', '1st Floor, Near Rastriya Shala, Vidhyanagar Main Rd, Rajkot - 360001', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Bavishi Eye Hospital & Phacoemulsification Center (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Dhruva Eye Hospital & Laser Centre (Clinic)', 'Private', 'Rajkot (Clinic)', 4.4, 90, ARRAY['Ophthalmology','Laser Treatment'], 3.1, 'low', true, true, '#0D7377', 'Dhruva House, Opp. Rashtriya Shala, Rajkot - 360002', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Dhruva Eye Hospital & Laser Centre (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'I Care Eye Hospital (Clinic)', 'Private', 'Rajkot (Clinic)', 4.3, 70, ARRAY['Ophthalmology'], 3.2, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'I Care Eye Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Darshan Eye Care Clinic (Clinic)', 'Private', 'Rajkot (Clinic)', 4.3, 60, ARRAY['Ophthalmology'], 3.2, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Darshan Eye Care Clinic (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Urocare Hospital (Clinic)', 'Private', 'Vidhyanagar Main Road, Rajkot (Clinic)', 4.4, 80, ARRAY['Urology','Nephrology'], 3.3, 'low', true, true, '#0D7377', 'Near Patel Boarding, Vidhyanagar Main Road, Rajkot - 360002', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Urocare Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Amruta Pediacare Pvt Ltd (Clinic)', 'Private', 'Rajkot (Clinic)', 4.4, 75, ARRAY['Pediatrics','Child Care'], 3.5, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Amruta Pediacare Pvt Ltd (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Plexus Medcare (Clinic)', 'Private', 'Rajkot (Clinic)', 4.2, 65, ARRAY['General Medicine'], 3.5, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Plexus Medcare (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Sakar Orthopaedic Hospital (Clinic)', 'Private', 'Rajkot (Clinic)', 4.3, 70, ARRAY['Orthopedics','Joint Replacement'], 3.6, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Sakar Orthopaedic Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shanti Multispeciality Hospital (Clinic)', 'Private', 'Rajkot (Clinic)', 4.2, 60, ARRAY['General Medicine'], 3.6, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Shanti Multispeciality Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Senses ENT Hospital (Clinic)', 'Private', 'Rajkot (Clinic)', 5.0, 50, ARRAY['ENT','Hearing','Sinus'], 3.7, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Senses ENT Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'B.T. Savani Kidney Hospital (Clinic)', 'Private', 'Rajkot (Clinic)', 4.4, 65, ARRAY['Nephrology','Dialysis'], 3.8, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'B.T. Savani Kidney Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Vasalya Clinical Hospital (Clinic)', 'Private', 'Rajkot (Clinic)', 4.2, 55, ARRAY['General Medicine','Pediatrics'], 3.8, 'low', true, true, '#0D7377', 'Rajkot', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Vasalya Clinical Hospital (Clinic)');

insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing)
select 'Shreeji Surgical Hospital (Clinic)', 'Private', 'Nirmala Convent Road, Rajkot (Clinic)', 4.3, 60, ARRAY['General Surgery','Laparoscopic Surgery'], 4.0, 'low', true, true, '#0D7377', 'Paras Soc 3 Corner, Nirmala Convent Road, Opp. Physiotherapy College, Rajkot - 360007', null, 'By Appointment', 'By Appointment'
where not exists (select 1 from public.hospitals where name = 'Shreeji Surgical Hospital (Clinic)');

-- ---------- DOCTORS (15) ----------
insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Dharmesh R. Solanki', 'Cardiologist', (select id from public.hospitals where name = 'Wockhardt Hospitals' limit 1), 4.7, 'Senior Consultant', ARRAY['English','Hindi','Gujarati'], 800, 'By Appointment', 'Senior Consultant Cardiologist at Wockhardt Hospitals, Gondal Road.', ARRAY['MBBS','MD','DM (Cardiology)'], ARRAY['Cardiology']
where not exists (select 1 from public.doctors where name = 'Dr. Dharmesh R. Solanki');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Bharat Parekh', 'Internal Medicine', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.4, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Internal Medicine Consultant at HCG Hospitals.', ARRAY['MBBS','MD'], ARRAY['Internal Medicine']
where not exists (select 1 from public.doctors where name = 'Dr. Bharat Parekh');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. N.G. Ladani', 'General Surgeon', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.5, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'General Surgery & Minimal Access Surgery Consultant at HCG Hospitals.', ARRAY['MBBS','MS'], ARRAY['General Surgery','Minimal Access Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. N.G. Ladani');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Rajendra Sagar', 'General Surgeon', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.4, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'General Surgery, GI & Laparoscopic Surgery Consultant at HCG Hospitals.', ARRAY['MBBS','MS'], ARRAY['General Surgery','GI Surgery','Laparoscopic Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. Rajendra Sagar');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Achal Saradava', 'Orthopedic', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.5, 'Orthopedic Surgeon', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Orthopaedic & Joint Replacement Surgeon at HCG Hospitals.', ARRAY['MBBS','MS (Ortho)'], ARRAY['Orthopaedic','Joint Replacement Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. Achal Saradava');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Mittal Dave', 'Orthopedic', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.4, 'Orthopedic Surgeon', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Orthopaedic & Joint Replacement Surgeon at HCG Hospitals.', ARRAY['MBBS','MS (Ortho)'], ARRAY['Orthopaedic','Joint Replacement Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. Mittal Dave');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Dishit Vaghasia', 'Orthopedic', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.5, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Orthopaedic, Joint Replacement & Arthroscopy Consultant at HCG Hospitals.', ARRAY['MBBS','MS (Ortho)'], ARRAY['Orthopaedic','Joint Replacement','Arthroscopy']
where not exists (select 1 from public.doctors where name = 'Dr. Dishit Vaghasia');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Ameya S. Gadkari', 'Cardiothoracic Surgeon', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.6, 'Consultant', ARRAY['English','Hindi'], 900, 'Mon-Sat', 'Cardiothoracic & Vascular Surgery Consultant at HCG Hospitals.', ARRAY['MBBS','MCh'], ARRAY['Cardiothoracic Surgery','Vascular Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. Ameya S. Gadkari');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Khushal Teraiya', 'General Physician', null, 4.3, 'Verified Practitioner', ARRAY['English','Hindi','Gujarati'], 300, 'By Appointment', 'Family Medicine practitioner near Bhaktinagar Circle, Rajkot - 360002.', ARRAY['MBBS'], ARRAY['Family Medicine']
where not exists (select 1 from public.doctors where name = 'Dr. Khushal Teraiya');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Hem', 'General Physician', null, 4.2, 'Verified Practitioner', ARRAY['English','Hindi','Gujarati'], 300, 'By Appointment', 'Family Medicine practitioner in Rajkot.', ARRAY['MBBS'], ARRAY['Family Medicine']
where not exists (select 1 from public.doctors where name = 'Dr. Hem');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Girish Patel', 'Internal Medicine', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.4, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Internal Medicine Consultant at HCG Hospitals.', ARRAY['MBBS','MD'], ARRAY['Internal Medicine']
where not exists (select 1 from public.doctors where name = 'Dr. Girish Patel');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Sanjay Bhatt', 'Internal Medicine', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.4, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Internal Medicine Consultant at HCG Hospitals.', ARRAY['MBBS','MD'], ARRAY['Internal Medicine']
where not exists (select 1 from public.doctors where name = 'Dr. Sanjay Bhatt');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Vinod Rakholia', 'Internal Medicine', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.3, 'Consultant', ARRAY['English','Hindi','Gujarati'], 600, 'Mon-Sat', 'Internal Medicine Consultant at HCG Hospitals.', ARRAY['MBBS','MD'], ARRAY['Internal Medicine']
where not exists (select 1 from public.doctors where name = 'Dr. Vinod Rakholia');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Yogesh Mehta', 'General Surgeon', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.5, 'Consultant', ARRAY['English','Hindi','Gujarati'], 650, 'Mon-Sat', 'General Surgery & Advanced Laparoscopic Surgery Consultant at HCG Hospitals.', ARRAY['MBBS','MS'], ARRAY['General Surgery','Advanced Laparoscopic Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. Yogesh Mehta');

insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations)
select 'Dr. Hemal Motani', 'General Surgeon', (select id from public.hospitals where name = 'HCG Hospitals Rajkot' limit 1), 4.4, 'Consultant', ARRAY['English','Hindi','Gujarati'], 650, 'Mon-Sat', 'General & GI Surgery Consultant at HCG Hospitals.', ARRAY['MBBS','MS'], ARRAY['General Surgery','GI Surgery']
where not exists (select 1 from public.doctors where name = 'Dr. Hemal Motani');
