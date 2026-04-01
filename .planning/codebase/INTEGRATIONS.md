# External Integrations

**Analysis Date:** 2026-04-01

## APIs & External Services

**AI Providers (Optional):**
- Anthropic Claude - SDK not installed, keys optional via `ANTHROPIC_API_KEY`
- OpenAI - SDK not installed, keys optional via `OPENAI_API_KEY`
- Google Generative AI - SDK not installed, keys optional via `GOOGLE_GENERATIVE_AI_API_KEY`

**Current Status:** No active AI provider SDKs installed. Environment variables defined in `src/types/env.d.ts` for future integration.

## Data Storage

**Databases:**
- Type/Provider: Not yet configured
- Connection: `DATABASE_URL` environment variable defined
- Client/ORM: None installed (framework-agnostic placeholder)

**File Storage:**
- Local filesystem only (no S3, GCS, or cloud storage SDKs)

**Caching:**
- None configured (no Redis, Memcached, or caching middleware)

## Authentication & Identity

**Auth Provider:**
- Custom implementation placeholder
- Environment variable: `AUTH_SECRET` required in `.env.local`
- No third-party auth SDK installed (Firebase, Auth0, Clerk, etc.)

**Current Status:** Auth infrastructure designed but not implemented. Scaffold is API-ready via `AUTH_SECRET` pattern.

## Monitoring & Observability

**Error Tracking:**
- None configured (no Sentry, Rollbar, or error tracking SDK)

**Logs:**
- Console-based (no structured logging framework installed)

**Analytics:**
- Feature flag: `NEXT_PUBLIC_ENABLE_ANALYTICS` (disabled by default)
- No tracking SDK installed (no Segment, Mixpanel, or GA)

## CI/CD & Deployment

**Hosting:**
- Vercel (indicated by `vercel.json` configuration)
- Edge Runtime compatible (Vercel Edge Functions capable)

**Deployment Config:**
- File: `vercel.json`
- Build command: Not specified (uses Next.js defaults)
- Output directory: `public/`
- Framework: Null (Next.js auto-detected)
- Rewrites: API routes configured (`/api/:path*` → `/api/:path*`)

**CI Pipeline:**
- Not detected (no GitHub Actions, GitLab CI, or CI config files)

## Environment Configuration

**Required env vars (from `.env.example`):**

**Public (client-safe):**
- `NEXT_PUBLIC_APP_URL` - Application base URL (default: `http://localhost:3000`)
- `NEXT_PUBLIC_APP_NAME` - Application display name

**Server-only:**
- `DATABASE_URL` - Database connection string (required)
- `AUTH_SECRET` - Authentication secret (required, 32+ bytes recommended)

**Optional AI Provider Keys (server-only):**
- `ANTHROPIC_API_KEY` - Anthropic API key (if using Claude)
- `OPENAI_API_KEY` - OpenAI API key (if using GPT models)
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Generative AI key (if using Gemini)

**Optional Feature Flags:**
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable telemetry/analytics (default: false/unset)

**Telemetry:**
- `NEXT_TELEMETRY_DISABLED=1` (already set to disable Next.js telemetry)

**Secrets location:**
- `.env.local` for local development (git-ignored)
- Production: Vercel Environment Variables dashboard

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## API Response Types

**Defined in `src/types/api.d.ts`:**

```typescript
interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  details?: Record<string, unknown>
  code?: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}
```

Standard patterns for API responses and pagination support are scaffolded but no API routes currently exist.

## Component Library Integration

**shadcn/ui Integration:**
- Configuration: `components.json`
- UI components pre-built and available in `src/components/ui/`
- Forms via react-hook-form + Zod validation
- Icons via lucide-react

## Future Integration Points

Based on environment configuration, the following integrations are planned but not yet implemented:
1. **Database** - Set `DATABASE_URL` and add ORM (Prisma, Drizzle, etc.)
2. **Authentication** - Implement `AUTH_SECRET` based auth or integrate third-party provider
3. **AI/LLM** - Install and configure one or more AI provider SDKs
4. **Analytics** - Enable `NEXT_PUBLIC_ENABLE_ANALYTICS` and integrate tracking SDK
5. **API Routes** - Create `src/app/api/**/route.ts` files using defined response types

---

*Integration audit: 2026-04-01*
