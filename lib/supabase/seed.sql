-- ============================================================
-- Swasthya Setu — Seed Data
-- ============================================================

-- HOSPITALS (10)
insert into public.hospitals (name, type, location, rating, reviews_count, specialties, distance_km, queue_status, available, open_now, logo_color, address, phone, hours, opd_timing) values
('Rajkot Civil Hospital', 'Govt', 'Rajkot, Gujarat', 4.2, 1280, ARRAY['Cardiology','Neurology','Orthopedics'], 2.3, 'medium', true, true, '#0D7377', 'Civil Hospital Campus, Jamnagar Road, Rajkot 360001', '+91 281 245 6789', 'Open 24/7', 'Mon–Sat · 9:00 AM – 1:00 PM'),
('Apollo Hospitals', 'Private', 'Rajkot, Gujarat', 4.7, 940, ARRAY['Cardiology','Oncology','Pediatrics'], 5.1, 'low', true, true, '#C2410C', 'Kalawad Road, Near Raiya Telephone Exc., Rajkot 360005', '+91 281 712 3456', 'Open 24/7', 'Mon–Sun · 8:00 AM – 8:00 PM'),
('Sterling Hospital', 'Private', 'Rajkot, Gujarat', 4.5, 610, ARRAY['General Surgery','ENT','Dermatology'], 3.8, 'busy', false, true, '#7C3AED', 'Sadhu Vaswani Road, Rajkot 360005', '+91 281 666 7000', 'Open 24/7', 'Mon–Sat · 9:00 AM – 6:00 PM'),
('GMERS Medical College', 'Govt', 'Rajkot, Gujarat', 3.9, 540, ARRAY['General Medicine','Obstetrics','Psychiatry'], 4.5, 'low', true, true, '#059669', 'Parsana Nagar, Rajkot 360001', '+91 281 222 3456', 'Open 24/7', 'Mon–Sat · 8:30 AM – 12:30 PM'),
('Saurashtra Hospital', 'Private', 'Rajkot, Gujarat', 4.3, 720, ARRAY['Orthopedics','Neurology','Urology'], 1.8, 'low', true, true, '#2563EB', 'Mahila College Road, Rajkot 360001', '+91 281 235 7890', 'Open 24/7', 'Mon–Sat · 10:00 AM – 8:00 PM'),
('Nirmal Hospital', 'Private', 'Rajkot, Gujarat', 4.1, 430, ARRAY['Pediatrics','General Medicine','Dermatology'], 6.2, 'medium', true, true, '#0891B2', 'Kotecha Road, Rajkot 360001', '+91 281 244 5678', 'Open 24/7', 'Mon–Sun · 9:00 AM – 9:00 PM'),
('Bhagwati Hospital', 'Private', 'Rajkot, Gujarat', 4.0, 380, ARRAY['Gynecology',' ENT','Ophthalmology'], 7.5, 'low', true, false, '#BE185D', 'University Road, Rajkot 360005', '+91 281 256 7890', 'Mon–Sat · 8:00 AM – 8:00 PM', 'Mon–Sat · 9:00 AM – 1:00 PM'),
('Rajkot Eye Hospital', 'Private', 'Rajkot, Gujarat', 4.6, 290, ARRAY['Ophthalmology','Optometry'], 3.2, 'low', true, true, '#D97706', 'Dr. Yagnik Road, Rajkot 360001', '+91 281 223 4567', 'Mon–Sat · 9:00 AM – 6:00 PM', 'Mon–Sat · 10:00 AM – 5:00 PM'),
('Netram Eye Clinic', 'Private', 'Rajkot, Gujarat', 4.4, 180, ARRAY['Ophthalmology'], 4.0, 'low', true, true, '#059669', 'Kalawad Road, Rajkot 360005', '+91 281 267 8901', 'Mon–Sat · 10:00 AM – 7:00 PM', 'Mon–Sat · 10:00 AM – 6:00 PM'),
('Rajkot Dental Care', 'Private', 'Rajkot, Gujarat', 4.2, 210, ARRAY['Dentistry','Oral Surgery'], 5.5, 'medium', true, true, '#7C3AED', 'Race Course Road, Rajkot 360001', '+91 281 239 4567', 'Mon–Sat · 9:00 AM – 8:00 PM', 'Mon–Sat · 10:00 AM – 7:00 PM');

-- DOCTORS (20)
insert into public.doctors (name, specialty, hospital_id, rating, experience, languages, fee, next_available, bio, education, specializations) values
('Dr. R. K. Sharma', 'Cardiologist', (select id from hospitals where name = 'Apollo Hospitals'), 4.9, '15+ years', ARRAY['Hindi','English','Marathi'], 800, 'Today, 2:00 PM', 'Senior consultant cardiologist with over 15 years of experience in interventional cardiology.', ARRAY['MD (General Medicine) — AIIMS, New Delhi','DM (Cardiology) — PGIMER, Chandigarh','MBBS — B. J. Medical College, Ahmedabad'], ARRAY['Coronary Angiography & Angioplasty','Echocardiography','Heart Failure Management']),
('Dr. Priya Mehta', 'Dermatologist', (select id from hospitals where name = 'Sterling Hospital'), 4.8, '10+ years', ARRAY['Hindi','English','Gujarati'], 600, 'Tomorrow, 10:00 AM', 'Board-certified dermatologist specialising in medical and cosmetic dermatology.', ARRAY['MD (Dermatology) — KEM Hospital, Mumbai','MBBS — SMS Medical College, Jaipur'], ARRAY['Acne & Scar Treatment','Laser Therapy','Cosmetic Dermatology']),
('Dr. Amit Patel', 'Orthopedic', (select id from hospitals where name = 'Rajkot Civil Hospital'), 4.6, '12+ years', ARRAY['Gujarati','Hindi','English'], 500, 'Today, 4:00 PM', 'Consultant orthopaedic surgeon with 12+ years of experience in joint replacement and sports injuries.', ARRAY['MS (Orthopaedics) — Baroda Medical College','MBBS — M. P. Shah Medical College, Jamnagar'], ARRAY['Knee & Hip Replacement','Sports Injury Rehabilitation','Arthroscopy']),
('Dr. Neha Joshi', 'Pediatrician', (select id from hospitals where name = 'Apollo Hospitals'), 4.9, '8+ years', ARRAY['English','Hindi'], 700, 'Tomorrow, 11:00 AM', 'Dedicated paediatrician with 8+ years caring for children from newborns to adolescents.', ARRAY['MD (Paediatrics) — JIPMER, Puducherry','MBBS — Grant Medical College, Mumbai'], ARRAY['Neonatal & Infant Care','Vaccination & Immunisation','Paediatric Nutrition']),
('Dr. Vikram Singh', 'Neurologist', (select id from hospitals where name = 'GMERS Medical College'), 4.5, '18+ years', ARRAY['Hindi','English'], 900, 'Today, 5:00 PM', 'Renowned neurologist with 18+ years treating neurological disorders including stroke and epilepsy.', ARRAY['DM (Neurology) — NIMHANS, Bangalore','MD (Medicine) — KGMC, Lucknow','MBBS — AMU, Aligarh'], ARRAY['Stroke Management','Epilepsy Treatment','Parkinson''s Disease']),
('Dr. Sneha Kapoor', 'Gynecologist', (select id from hospitals where name = 'Saurashtra Hospital'), 4.7, '14+ years', ARRAY['Hindi','English','Gujarati'], 750, 'Today, 3:00 PM', 'Senior gynecologist and obstetrician with 14+ years experience in high-risk pregnancies.', ARRAY['MD (Obstetrics & Gynecology) — KEM Hospital, Mumbai','MBBS — GS Medical College, Mumbai'], ARRAY['High-Risk Pregnancy','IVF & Infertility','Laparoscopic Surgery']),
('Dr. Rajesh Iyer', 'ENT Specialist', (select id from hospitals where name = 'Nirmal Hospital'), 4.4, '11+ years', ARRAY['English','Hindi','Gujarati'], 550, 'Tomorrow, 9:00 AM', 'ENT specialist with 11+ years experience in hearing restoration and sinus surgery.', ARRAY['MS (ENT) — AIIMS, New Delhi','MBBS — BJ Medical College, Ahmedabad'], ARRAY['Hearing Restoration','Sinus Surgery','Sleep Apnea Treatment']),
('Dr. Meera Shah', 'Psychiatrist', (select id from hospitals where name = 'GMERS Medical College'), 4.3, '9+ years', ARRAY['Hindi','English','Gujarati'], 650, 'Today, 6:00 PM', 'Compassionate psychiatrist specialising in anxiety, depression, and child psychiatry.', ARRAY['MD (Psychiatry) — NIMHANS, Bangalore','MBBS — BJ Medical College, Ahmedabad'], ARRAY['Anxiety & Depression','Child Psychiatry','Cognitive Behavioral Therapy']),
('Dr. Arjun Mehta', 'General Surgeon', (select id from hospitals where name = 'Sterling Hospital'), 4.5, '16+ years', ARRAY['Hindi','English'], 850, 'Tomorrow, 2:00 PM', 'Experienced general surgeon specialising in minimally invasive procedures.', ARRAY['MS (General Surgery) — PGI Chandigarh','MBBS — AIIMS, New Delhi'], ARRAY['Laparoscopic Surgery','Hernia Repair','Gallbladder Surgery']),
('Dr. Pooja Desai', 'Ophthalmologist', (select id from hospitals where name = 'Rajkot Eye Hospital'), 4.8, '13+ years', ARRAY['Hindi','English','Gujarati'], 700, 'Today, 11:00 AM', 'Eye surgeon with 13+ years in cataract, LASIK, and retinal procedures.', ARRAY['MS (Ophthalmology) — Sankara Eye Hospital, Coimbatore','MBBS — BJ Medical College, Ahmedabad'], ARRAY['Cataract Surgery','LASIK','Retinal Detachment']),
('Dr. Kiran Joshi', 'Urologist', (select id from hospitals where name = 'Saurashtra Hospital'), 4.4, '10+ years', ARRAY['English','Hindi','Gujarati'], 800, 'Tomorrow, 10:00 AM', 'Urologist with expertise in kidney stones, prostate, and urinary tract disorders.', ARRAY['MS (Urology) — KEM Hospital, Mumbai','MBBS — BJ Medical College, Ahmedabad'], ARRAY['Kidney Stone Treatment','Prostate Surgery','Laparoscopic Urology']),
('Dr. Nisha Vora', 'Dermatologist', (select id from hospitals where name = 'Rajkot Civil Hospital'), 4.5, '7+ years', ARRAY['Hindi','English','Gujarati'], 400, 'Today, 5:00 PM', 'Dermatologist focused on clinical and cosmetic dermatology with modern treatments.', ARRAY['MD (Dermatology) — GS Medical College, Mumbai','MBBS — MP Shah Medical College, Jamnagar'], ARRAY['Acne Treatment','Chemical Peels','Hair Fall Treatment']),
('Dr. Harsh Patel', 'General Surgeon', (select id from hospitals where name = 'Sterling Hospital'), 4.6, '14+ years', ARRAY['Gujarati','Hindi','English'], 600, 'Tomorrow, 4:00 PM', 'General surgeon with expertise in emergency and laparoscopic surgeries.', ARRAY['MS (General Surgery) — BJ Medical College, Ahmedabad','MBBS — MP Shah Medical College, Jamnagar'], ARRAY['Appendectomy','Hernia Repair','Laparoscopic Surgery']),
('Dr. Falguni B.', 'Obstetrician', (select id from hospitals where name = 'GMERS Medical College'), 4.4, '19+ years', ARRAY['Gujarati','English'], 450, 'Today, 9:00 AM', 'Senior obstetrician with 19+ years managing normal and high-risk pregnancies.', ARRAY['MS (Obstetrics) — BJ Medical College, Ahmedabad','MBBS — MP Shah Medical College, Jamnagar'], ARRAY['Normal & Caesarean Delivery','High-Risk Pregnancy','Infertility Treatment']),
('Dr. Jignesh R.', 'General Physician', (select id from hospitals where name = 'GMERS Medical College'), 4.3, '13+ years', ARRAY['Gujarati','Hindi'], 300, 'Tomorrow, 11:00 AM', 'General physician managing chronic diseases, diabetes, hypertension, and infections.', ARRAY['MD (General Medicine) — BJ Medical College, Ahmedabad','MBBS — MP Shah Medical College, Jamnagar'], ARRAY['Diabetes Management','Hypertension','Infectious Diseases']),
('Dr. Kavya Reddy', 'General Physician', (select id from hospitals where name = 'Apollo Hospitals'), 4.7, '9+ years', ARRAY['English','Hindi','Telugu'], 500, 'Today, 10:00 AM', 'Physician specialising in preventive care and lifestyle disease management.', ARRAY['MD (General Medicine) — AIIMS, New Delhi','MBBS — Gandhi Medical College, Hyderabad'], ARRAY['Preventive Health','Diabetes','Hypertension']),
('Dr. Ananya Sharma', 'Cardiologist', (select id from hospitals where name = 'Saurashtra Hospital'), 4.6, '11+ years', ARRAY['Hindi','English','Gujarati'], 700, 'Tomorrow, 3:00 PM', 'Cardiologist with expertise in heart failure and preventive cardiology.', ARRAY['DM (Cardiology) — PGIMER, Chandigarh','MD (Medicine) — AIIMS, New Delhi','MBBS — Maulana Azad Medical College, Delhi'], ARRAY['Heart Failure Management','Preventive Cardiology','ECG & Echocardiography']),
('Dr. Rohan Mehta', 'Pediatrician', (select id from hospitals where name = 'Nirmal Hospital'), 4.5, '6+ years', ARRAY['Hindi','English','Gujarati'], 450, 'Today, 4:00 PM', 'Young and energetic pediatrician with a focus on newborn care and vaccinations.', ARRAY['MD (Paediatrics) — KEM Hospital, Mumbai','MBBS — BJ Medical College, Ahmedabad'], ARRAY['Newborn Care','Vaccination','Growth Monitoring']),
('Dr. Sunita Rao', 'Gynecologist', (select id from hospitals where name = 'Bhagwati Hospital'), 4.5, '16+ years', ARRAY['Hindi','English','Kannada'], 650, 'Tomorrow, 9:00 AM', 'Experienced gynecologist and laparoscopic surgeon with 16+ years in women''s health.', ARRAY['MS (Obstetrics & Gynecology) — St. Johns Medical College, Bangalore','MBBS — Bangalore Medical College'], ARRAY['Laparoscopic Surgery','PCOS Treatment','Antenatal Care']);

-- DOCTOR CLINIC TIMINGS
insert into public.doctor_clinic_timings (doctor_id, day, slots)
select id, 'Monday – Friday', ARRAY['9:00 AM – 1:00 PM','4:00 PM – 7:00 PM'] from doctors where name = 'Dr. R. K. Sharma'
union all
select id, 'Saturday', ARRAY['9:00 AM – 1:00 PM'] from doctors where name = 'Dr. R. K. Sharma'
union all
select id, 'Monday – Thursday', ARRAY['10:00 AM – 2:00 PM','5:00 PM – 8:00 PM'] from doctors where name = 'Dr. Priya Mehta'
union all
select id, 'Saturday', ARRAY['10:00 AM – 2:00 PM'] from doctors where name = 'Dr. Priya Mehta'
union all
select id, 'Monday – Saturday', ARRAY['8:00 AM – 12:00 PM','4:00 PM – 6:30 PM'] from doctors where name = 'Dr. Amit Patel'
union all
select id, 'Monday – Friday', ARRAY['9:00 AM – 1:00 PM','3:00 PM – 6:00 PM'] from doctors where name = 'Dr. Neha Joshi'
union all
select id, 'Saturday', ARRAY['9:00 AM – 1:00 PM'] from doctors where name = 'Dr. Neha Joshi'
union all
select id, 'Monday – Thursday', ARRAY['10:00 AM – 2:00 PM','5:00 PM – 7:00 PM'] from doctors where name = 'Dr. Vikram Singh'
union all
select id, 'Friday', ARRAY['10:00 AM – 2:00 PM'] from doctors where name = 'Dr. Vikram Singh';

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
