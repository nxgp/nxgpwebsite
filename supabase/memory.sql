-- Nx Assistant — learning layer.
-- Run in Supabase → SQL Editor (safe to re-run).
--
-- DESIGN NOTE ON PRIVACY: raw conversations are never fed back into the live
-- prompt. Doing so would let one visitor's session surface another visitor's
-- company, contact details or project specifics. Instead we mine anonymized
-- PATTERNS into `conversation_insights`, a human approves them, and only
-- approved rows in `assistant_memory` are injected into the prompt.

-- Curated knowledge the assistant is allowed to use. Only active rows load.
create table if not exists assistant_memory (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('faq', 'objection', 'positioning', 'fact')),
  -- the visitor-side trigger (a question or objection), anonymized
  prompt text not null,
  -- how the assistant should respond
  response text not null,
  priority int not null default 0,          -- higher loads first
  active boolean not null default false,    -- opt-in: approve before it goes live
  source_insight_id bigint,
  approved_by text,
  created_at timestamptz not null default now()
);

-- Auto-mined observations awaiting human review. Never injected directly.
create table if not exists conversation_insights (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('gap', 'faq', 'objection', 'positioning')),
  -- anonymized: no names, emails, company names
  observation text not null,
  suggested_prompt text,
  suggested_response text,
  occurrences int not null default 1,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Track which conversations have been mined so runs don't duplicate work.
create table if not exists learning_runs (
  id bigint generated always as identity primary key,
  ran_at timestamptz not null default now(),
  conversations_scanned int not null default 0,
  insights_created int not null default 0,
  through_message_id bigint
);

create index if not exists assistant_memory_active_idx on assistant_memory (active, priority desc);
create index if not exists conversation_insights_status_idx on conversation_insights (status, created_at desc);

alter table assistant_memory enable row level security;
alter table conversation_insights enable row level security;
alter table learning_runs enable row level security;

-- Global daily-cap query scans by time alone; keep it indexed.
create index if not exists messages_created_idx on messages (created_at);
