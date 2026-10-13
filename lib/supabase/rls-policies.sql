-- ============================================================
-- Swasthya Setu — Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
alter table public.hospitals enable row level security;
alter table public.doctors enable row level security;
alter table public.medicines enable row level security;
alter table public.appointments enable row level security;
alter table public.reviews enable row level security;
alter table public.queue_reports enable row level security;
alter table public.chat_messages enable row level security;
alter table public.conversations enable row level security;

-- HOSPITALS: public read
create policy "Public read hospitals" on public.hospitals for select using (true);

-- DOCTORS: public read
create policy "Public read doctors" on public.doctors for select using (true);

-- MEDICINES: public read
create policy "Public read medicines" on public.medicines for select using (true);

-- APPOINTMENTS: users can CRUD their own
create policy "Users can create own appointments" on public.appointments for insert with check (auth.uid() = user_id);
create policy "Users can read own appointments" on public.appointments for select using (auth.uid() = user_id);
create policy "Users can update own appointments" on public.appointments for update using (auth.uid() = user_id);
create policy "Users can delete own appointments" on public.appointments for delete using (auth.uid() = user_id);

-- REVIEWS: anyone can read, authenticated users can create
create policy "Public read reviews" on public.reviews for select using (true);
create policy "Auth users can create reviews" on public.reviews for insert with check (auth.uid() is not null);

-- QUEUE REPORTS: anyone can read, authenticated users can create
create policy "Public read queue reports" on public.queue_reports for select using (true);
create policy "Auth users can create queue reports" on public.queue_reports for insert with check (auth.uid() is not null);

-- CONVERSATIONS: users can CRUD their own
create policy "Users can create conversations" on public.conversations for insert with check (auth.uid() = user_id);
create policy "Users can read own conversations" on public.conversations for select using (auth.uid() = user_id);
create policy "Users can update own conversations" on public.conversations for update using (auth.uid() = user_id);
create policy "Users can delete own conversations" on public.conversations for delete using (auth.uid() = user_id);

-- CHAT MESSAGES: users can read/write their own conversation messages
create policy "Users can read own messages" on public.chat_messages for select using (
  exists (select 1 from public.conversations where conversations.id = chat_messages.conversation_id and conversations.user_id = auth.uid())
);
create policy "Users can create messages" on public.chat_messages for insert with check (
  exists (select 1 from public.conversations where conversations.id = chat_messages.conversation_id and conversations.user_id = auth.uid())
);
