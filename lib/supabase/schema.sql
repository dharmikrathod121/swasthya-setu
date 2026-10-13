-- ============================================================
-- Swasthya Setu — Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- HOSPITALS
-- ============================================================
create table if not exists public.hospitals (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('Govt', 'Private')),
  location text not null,
  rating numeric(3,2) default 0,
  reviews_count integer default 0,
  specialties text[] default '{}',
  distance_km numeric(5,2) default 0,
  queue_status text default 'low' check (queue_status in ('low', 'medium', 'busy')),
  available boolean default true,
  open_now boolean default true,
  logo_color text default '#0D7377',
  address text,
  phone text,
  hours text,
  opd_timing text,
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_hospitals_type on public.hospitals (type);
create index idx_hospitals_rating on public.hospitals (rating desc);
create index idx_hospitals_distance on public.hospitals (distance_km);
create index idx_hospitals_available on public.hospitals (available, open_now);

-- ============================================================
-- DOCTORS
-- ============================================================
create table if not exists public.doctors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  specialty text not null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  rating numeric(3,2) default 0,
  experience text,
  languages text[] default '{}',
  fee integer default 0,
  next_available text,
  bio text,
  education text[] default '{}',
  specializations text[] default '{}',
  created_at timestamptz default now()
);

create index idx_doctors_specialty on public.doctors (specialty);
create index idx_doctors_hospital on public.doctors (hospital_id);
create index idx_doctors_rating on public.doctors (rating desc);
create index idx_doctors_fee on public.doctors (fee);

-- ============================================================
-- DOCTOR CLINIC TIMINGS
-- ============================================================
create table if not exists public.doctor_clinic_timings (
  id uuid primary key default uuid_generate_v4(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  day text not null,
  slots text[] default '{}',
  created_at timestamptz default now(),
  unique(doctor_id, day, slots)
);

create index idx_clinic_timings_doctor on public.doctor_clinic_timings (doctor_id);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete set null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  patient_name text not null,
  phone text not null,
  date text not null,
  time text not null,
  type text default 'In-Person Visit',
  reason text,
  notes text,
  status text default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_appointments_user on public.appointments (user_id, status, date);
create index idx_appointments_doctor on public.appointments (doctor_id, date);
create index idx_appointments_hospital on public.appointments (hospital_id);

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text not null,
  date text default 'Just now',
  created_at timestamptz default now()
);

create index idx_reviews_hospital on public.reviews (hospital_id, created_at desc);
create index idx_reviews_user on public.reviews (user_id);

-- ============================================================
-- QUEUE REPORTS (crowdsourced)
-- ============================================================
create table if not exists public.queue_reports (
  id uuid primary key default uuid_generate_v4(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  dept text not null,
  wait_time integer not null check (wait_time >= 0 and wait_time <= 180),
  created_at timestamptz default now()
);

create index idx_queue_reports_hospital on public.queue_reports (hospital_id, created_at desc);

-- ============================================================
-- MEDICINES
-- ============================================================
create table if not exists public.medicines (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  generic text,
  category text,
  uses text,
  dosage text,
  side_effects text,
  price_range text,
  created_at timestamptz default now()
);

create index idx_medicines_name on public.medicines (name);
create index idx_medicines_category on public.medicines (category);

-- ============================================================
-- CONVERSATIONS (chat history)
-- ============================================================
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_conversations_user on public.conversations (user_id, updated_at desc);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  is_doctor boolean default false,
  created_at timestamptz default now()
);

create index idx_chat_messages_conversation on public.chat_messages (conversation_id, created_at asc);

-- ============================================================
-- STORAGE BUCKETS (for file uploads)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('reports', 'reports', false, 10485760, '{image/png,image/jpeg,application/pdf}'),
  ('medicines', 'medicines', false, 5242880, '{image/png,image/jpeg,image/webp}')
on conflict (id) do nothing;

-- Storage RLS: users can upload their own files, read their own files
create policy "Users can upload own files"
  on storage.objects for insert
  with check ( bucket_id = 'reports' and auth.uid() = owner );

create policy "Users can read own files"
  on storage.objects for select
  using ( bucket_id = 'reports' and auth.uid() = owner );

create policy "Users can upload medicine images"
  on storage.objects for insert
  with check ( bucket_id = 'medicines' and auth.uid() = owner );

create policy "Users can read medicine images"
  on storage.objects for select
  using ( bucket_id = 'medicines' and auth.uid() = owner );
