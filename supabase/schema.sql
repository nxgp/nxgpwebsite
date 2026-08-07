-- Nx Assistant — conversation + lead storage.
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run.
-- The API uses the secret key (service role), so RLS "deny all" keeps the
-- public/publishable key locked out entirely.

create table if not exists conversations (
  id text primary key,
  created_at timestamptz not null default now(),
  last_active timestamptz not null default now(),
  lead_captured boolean not null default false
);

create table if not exists messages (
  id bigint generated always as identity primary key,
  conversation_id text not null references conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  ip text,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id bigint generated always as identity primary key,
  conversation_id text references conversations (id),
  name text,
  email text not null,
  company text,
  interest text not null,
  summary text not null,
  slack_notified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on messages (conversation_id, created_at);
create index if not exists messages_ip_time_idx on messages (ip, created_at);
create index if not exists leads_created_idx on leads (created_at desc);

-- Lock the tables down: the service key bypasses RLS; no public policies exist.
alter table conversations enable row level security;
alter table messages enable row level security;
alter table leads enable row level security;
