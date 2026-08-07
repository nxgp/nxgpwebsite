# Nx Assistant — website AI chat

A custom AI assistant on nxgp.io: answers visitor questions grounded in NxGP's
services / case studies / engagement models, captures leads mid-conversation,
notifies the team in Slack, stores every conversation in Supabase, and hands
visitors the Calendly booking link.

## Architecture

```
Visitor ⇄ ChatWidget (React, lazy-loaded panel, SSE streaming)
            ⇅
        /api/chat  (Vercel Edge Function)
            ⇅
        Claude (Haiku 4.5, prompt-cached system prompt from src/data/content.ts)
            ├─ tool capture_lead → Slack #website-leads + Supabase `leads`
            └─ every turn        → Supabase `conversations` + `messages`
```

- **Knowledge**: `api/_knowledge.ts` builds the system prompt from
  `src/data/content.ts` — the same objects that render the site and the
  JSON-LD. Edit site content and the bot learns it on next deploy.
- **Lead flow**: when a visitor shows intent, the model collects
  name/email/company/need and calls `capture_lead`. The function posts to the
  Slack webhook, inserts a `leads` row, then the model confirms and shares
  the Calendly link.
- **Abuse protection**: origin allow-list, 20 msgs/min/IP (in-memory) +
  300 msgs/day/IP (Supabase-backed), 2k-char messages, 30-turn history cap,
  700 max output tokens.

## Setup (one-time)

1. **Anthropic** — create an API key, make sure the account has credits
   (console.anthropic.com → Plans & Billing). Set `ANTHROPIC_API_KEY`.
2. **Supabase** — run `supabase/schema.sql` in the SQL Editor. Set
   `SUPABASE_URL` (Settings → API → Project URL) and `SUPABASE_SECRET_KEY`
   (the `sb_secret_…` key).
3. **Slack** — create the incoming webhook:
   1. api.slack.com/apps → **Create New App** → *From scratch* → name it
      "Nx Website Leads", pick the NxGP workspace.
   2. In the app: **Incoming Webhooks** → toggle **On** →
      **Add New Webhook to Workspace** → choose `#website-leads` → **Allow**.
   3. Copy the `https://hooks.slack.com/services/…` URL → set
      `SLACK_WEBHOOK_URL`.
4. **Vercel** — Project → Settings → Environment Variables → add the four
   vars above (Production + Preview), then redeploy.

Every integration degrades gracefully: without Slack the lead still lands in
Supabase; without Supabase the chat still answers; without the Anthropic key
the endpoint returns 503 and the widget shows a friendly fallback with
hello@nxgp.io.

## Useful queries

```sql
-- Recent conversations with message counts
select c.id, c.created_at, c.lead_captured, count(m.id) as messages
from conversations c left join messages m on m.conversation_id = c.id
group by c.id order by c.created_at desc limit 50;

-- Leads this week
select created_at, name, email, company, interest
from leads where created_at > now() - interval '7 days'
order by created_at desc;

-- Full transcript of one conversation
select role, content, created_at from messages
where conversation_id = 'PASTE-ID' order by created_at;
```

## Costs

Haiku 4.5 + prompt caching ≈ fractions of a cent per turn. A busy month of
marketing-site traffic lands in the $5–30 range. Set a spend limit in the
Anthropic console as a hard backstop.

---

# Learning layer — how the assistant gets smarter

The assistant improves from real conversations **without ever feeding raw
transcripts back into a live prompt**.

## Why not just replay past conversations

Injecting previous chats into the prompt would let one visitor's session
surface another visitor's company, contact details or project specifics —
unacceptable for a firm selling into healthcare, enterprise and government.
So the loop mines *anonymized patterns*, a human approves them, and only
approved rows ever reach a prompt.

```
conversations ──► /api/learn ──► conversation_insights (pending, anonymized)
                                        │
                                   human review
                                        ▼
                                 assistant_memory (active)
                                        │
                                        ▼
                                    /api/chat prompt
```

Three defences against leaking a visitor's identity:
1. Transcripts are stripped of emails/phones **before** the model sees them.
2. The extraction prompt forbids recording names, emails or company names.
3. Insights are stripped again on write, and `renderMemory()` scrubs once
   more before injection.

Learning is **fully automated**: after extraction, a second AI pass verifies
each insight against the assistant's actual knowledge base.

- **grounded + low-stakes** → auto-promoted into `assistant_memory`
  (`approved_by = 'auto-verifier'`), live within ~60s
- **not grounded, or high-stakes** (certifications, compliance, legal,
  pricing, named clients) → held as `pending`, never auto-promoted
- every run posts a Slack digest: what went live, what was held and why

Why the verifier exists: in testing the extractor invented *"we maintain
SOC 2 Type II certification"* — a fact nobody supplied. The verifier holds
exactly that class of claim while letting ordinary learnings flow through
automatically. Skim the Slack digest; if something held looks worth
teaching, approve it manually with the SQL below. To retire a bad
auto-learned memory: `update assistant_memory set active=false where id=N;`

## Running a learning pass

Set `LEARN_SECRET` in Vercel, then:

```bash
curl -X POST https://nxgp.io/api/learn -H "x-learn-secret: $LEARN_SECRET"
# → {"ok":true,"scanned":12,"insights":4}
```

Only messages newer than the last run are scanned (`learning_runs` tracks the
high-water mark), so it's cheap to run weekly. Add it to Vercel Cron if you
want it automatic.

Each run processes one batch (300 messages). After a traffic spike, repeat
with `?force=1` until it reports `scanned: 0`:

```bash
curl -X POST "https://nxgp.io/api/learn?force=1" -H "x-learn-secret: $LEARN_SECRET"
```

Concurrent runs are refused (429) for 60s after the previous one — that stops
an overlapping cron + manual run from mining the same window twice. Approvals
go live within ~60s (the chat endpoint caches memory per isolate).

## Manually approving held insights (optional)

```sql
-- what's waiting
select id, kind, observation, suggested_prompt, suggested_response
from conversation_insights where status = 'pending' order by created_at desc;

-- approve one into live memory (EDIT the text first if needed)
insert into assistant_memory (kind, prompt, response, priority, active, source_insight_id, approved_by)
values ('faq', 'Do you work with regulated healthcare data?',
        'Yes — for regulated work we run self-hosted so data stays in your boundary.',
        10, true, 42, 'ravi');

update conversation_insights set status = 'approved' where id = 42;

-- reject
update conversation_insights set status = 'rejected' where id = 43;

-- retire a memory entry without deleting it
update assistant_memory set active = false where id = 7;
```

Approved entries load newest-and-highest-priority first (40 entries / 6k char
cap) and sit in their own prompt-cache block, so adding memory never forces a
full cache rebuild of the base prompt.
