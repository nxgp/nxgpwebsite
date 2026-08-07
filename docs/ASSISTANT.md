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
