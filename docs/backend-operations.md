# Mindscape Backend Operations

## Required Production Bindings

Configure these in `wrangler.toml` and your Cloudflare environment:

```toml
[[d1_databases]]
binding = "DB"
database_name = "mindscape"
database_id = "your-real-d1-database-id"
```

Required secrets and vars:

```env
APP_ORIGIN=https://your-domain.example
SESSION_SECRET=use-a-long-random-secret
RESEND_API_KEY=...
RESEND_FROM=Mindscape <noreply@your-domain.example>
GROQ_API_KEY=...
```

## Production Readiness Rules

The backend is considered production-ready when all of these are true:

- D1 is bound and reachable
- `SESSION_SECRET` is set to a real secret
- `APP_ORIGIN` is HTTPS
- Resend credentials are configured

`GROQ_API_KEY` is optional. Without it, the assistant still works through deterministic local retrieval.

## Recommended Deployment Flow

1. Create the D1 database
2. Add the D1 binding to `wrangler.toml`
3. Set Worker secrets
4. Deploy the Worker
5. Hit `/api/health`
6. Confirm:
   - `mode = d1-configured`
   - `components.database.ready = true`
   - `productionReady = true`

## Suggested D1 Setup Commands

Create the database:

```bash
wrangler d1 create mindscape
```

Apply the tracked schema explicitly:

```bash
wrangler d1 execute mindscape --local --file=schema.sql
wrangler d1 execute mindscape --remote --file=schema.sql
```

The Worker also performs idempotent schema bootstrap at runtime, but explicit schema execution is still the safer operational pattern for production rollout.

## Smoke Test Checklist

After deploy, validate these routes:

1. `GET /api/health`
2. `GET /research`
3. `POST /partials/assistant/answer`
4. `POST /partials/check-in/demo-university`
5. `POST /partials/weekly-screen/demo-university`
6. `POST /partials/support-request/demo-university`
7. `POST /partials/admin/request-link`

Expected outcomes:

- health shows D1 ready
- research page loads grouped entries from D1
- assistant question appears in `assistant_questions`
- student submissions create persistent rows and corresponding `risk_events`
- admin login either sends mail or returns preview mode only if Resend is intentionally absent

## Data Safety Notes

- Student check-ins remain pseudonymous by default through `device_hash`
- Personally identifying data is stored only when a support request is submitted
- Research assistant history stores question, answer, mode, and source IDs only
- Raw reflective text is not stored in D1; only the limited excerpt used by the current product model is persisted

## Backup and Change Management

Recommended practice:

1. Keep `schema.sql` as the canonical schema contract
2. Apply schema changes through reviewed migration steps
3. Export D1 snapshots before structural changes
4. Treat bootstrap seeding as initialization, not as your long-term migration system

## Operational Failure Modes

### `/api/health` returns `productionReady: false`

Check:

- `DB` binding
- `SESSION_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM`

### Admin login works but no email is sent

Usually:

- Resend credentials are missing
- The backend is intentionally in preview mode

### Admin session does not persist locally

Check:

- `APP_ORIGIN`
- whether you are on HTTP in local dev
- cookie security mode in `/api/health`

### Assistant answers are local-only

Check:

- `GROQ_API_KEY`
- route output field `mode`

## Files to Audit During Backend Changes

- `src/lib/repository.ts`
- `src/lib/d1-bootstrap.ts`
- `src/lib/research-store.ts`
- `src/lib/research-assistant.ts`
- `src/lib/health.ts`
- `src/lib/session.ts`
- `schema.sql`
