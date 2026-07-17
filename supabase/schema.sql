-- NEXUS workspace persistence
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists public.workspaces (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Users can read own workspace"
  on public.workspaces for select
  using (auth.uid() = user_id);

create policy "Users can insert own workspace"
  on public.workspaces for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workspace"
  on public.workspaces for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
