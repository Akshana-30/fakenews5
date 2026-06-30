# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session

**Date:** 2026-06-29
**Branch:** `main` (up to date with origin/main — all work merged via PR #129 and PR #130)

---

## What's been built (merged to main)

### Peter's work

- ✅ Newspaper landing page layout (hero + side column + Latest News + Most Popular + sidebar)
- ✅ Live weather widget — Open-Meteo, Linköping, refreshes every 10 min
- ✅ Live markets widget — OMX Stockholm 30 (Nasdaq), EUR/SEK + USD/SEK (Frankfurter),
  Electricity SE3 (Elprisetjustnu.se), all with % change vs previous period
- ✅ New components: HeroCard, NewsCard, SidebarCard, SectionHead, WeatherWidget, MarketsWidget, NewsSidebar
- ✅ API routes: `/(api)/weather`, `/(api)/markets`
- ✅ CLAUDE.md + STATUS.md added to repo
- ✅ Dark/light mode toggle with ripple (circle reveal) animation
- ✅ Anti-flash `<head>` script — prevents wrong theme on reload
- ✅ Header + navbar both sticky (z-50) — never scroll behind images
- ✅ Landing page aligned to shadcn design tokens
- ✅ **Buy & Sell page** (`/buy-and-sell`) — restored and renamed from `/marketplace`
  - Sell / Buy listing-type filter pill buttons (preserves category filter state)
  - Category filter updated to preserve listing-type state
  - Footer + sidebar links updated to "Buy & Sell" / `/buy-and-sell`
- ✅ **Classified ad form** — removed 99 kr Featured tier (Free + 49 kr only); also removed from `/advertise/private` rates page
- ✅ **Cookies page** — rebranded from "Fakenews5" to "The Daily Commit"
- ✅ **Hydration mismatch fix** — added `"use client"` to `dropdown-menus.tsx` (Radix UI DropdownMenu requires client context); merged as PR #130
- ✅ **S3 image upload** — `src/lib/upload-action.ts` + `src/lib/s3.ts` (RustFS/S3-compatible). Used by:
  - Article create form (`add-article-form.tsx`)
  - Article edit form (`edit-article-form.tsx`)
  - Classified ad form (`ad-form.tsx`)
  - Display Advertisements form (`create-ad-form.tsx`) ← added 2026-06-29

### Team's work (merged to main)

- ✅ Auth: register, sign-in, forgot-password, email verification
- ✅ Article CRUD: create, view, edit, reactions (like/dislike), bookmarks, views, comments + replies
- ✅ Admin dashboard: charts (line, bar, pie), user counts, top commenter, article stats
- ✅ User dashboard: account page
- ✅ Article table with editor's choice toggle
- ✅ User management table
- ✅ Nested comments + reply form
- ✅ Admin navbar moved into root layout
- ✅ Paywall infrastructure — `auth.api.userHasPermission` with `article: ["read"]`
- ✅ Subscription system with Stripe (`@better-auth/stripe`)
- ✅ Display Advertisements admin page (`/dashboard/admin/advertisements`)

---

## In progress

### Uncommitted local changes (not yet pushed)

- `src/app/dashboard/admin/advertisements/_components/create-ad-form.tsx` — replaced manual "Image URL" text field with S3 file upload (same pattern as article/ad forms). **Needs testing and PR.**

### Known schema issue (still not fixed in main)

- `UserInfo.role` field is still in `schema.prisma` but was dropped from the database by migration
- After every pull: check if `role Role @default(UNSUBSCRIBED)` is back in UserInfo — if so, remove it and run `pnpm prisma generate` + clear `.next`
- Fix is on branch `fix/remove-userinfo-role` — needs team to merge

---

## Next up

### Open PRs / work to push
- [ ] Push and PR the `create-ad-form.tsx` S3 upload change (test first with a real banner image)

### Open PRs waiting for merge
- [ ] `fix/remove-userinfo-role` — removes role from UserInfo schema

### Bugs to fix

- [ ] **`add-article` author field** — article created with no author if typed alias doesn't match exactly. Should show dropdown of existing authors.
- [ ] **"Pro plan" name mismatch** — plan named "pro plan" in DB but role is "pro" in `permissions.ts` — pre-existing team bug.
- [ ] **Migration history broken (GitHub issue #44)** — one team member needs to follow issue steps to recreate the baseline migration so `prisma migrate deploy` works again.

### Project requirements still to build

- [ ] **AI functionality** — generate article drafts or images (OpenAI/Anthropic key needed)
- [ ] **Category pages** — wire up nav links (Ekonomi, Inrikes, Väder, Utrikes, Sports subcategories)

### Nice to have

- [ ] Add `isMostPopular` badge on news cards
- [ ] Weather icon animations
- [ ] Markets widget: add OMX chart (sparkline)

---

## Known issues

| Issue | Status | Fix |
|---|---|---|
| `UserInfo.role` in schema crashes app | Recurring after each pull | Remove from schema, `pnpm prisma generate`, clear `.next` |
| `prisma migrate dev/deploy` wants to reset DB | Not fixed (issue #44) | Use `pnpm prisma db push` instead — preserves data |
| `MallocNanoZone` crash / `pnpm dev` hangs at "Ready" (M1) | Fixed via direnv | `.envrc` sets `MallocNanoZone=0`. Run `direnv allow .` then open new terminal. Verify: `echo $MallocNanoZone` should be `0`. |
| `pnpm dev` slow startup or progressively slower | Stale cache | Stop server → `rm -rf .next` → restart |
| Subscription dashboard blank | Plan names must be lowercase | `UPDATE plan SET name = LOWER(name);` in DB |
| Paid but role not updated | `stripe listen` not running | Run `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook` before testing payments |
| "Pro plan" → role "pro" mismatch | Pre-existing team bug | Plan named "pro plan" in DB; `permissions.ts` expects role "pro" |
| OMX data only live during market hours | By design | Shows `–` outside trading hours |
| `commentary-section.tsx` TS error (missing `Role` enum) | Not fixed | Tied to `fix/remove-userinfo-role` PR |

---

## Git state

```
main                       ← up to date with origin/main (includes PR #129, #130)
fix/remove-userinfo-role   ← pushed, PR open, not merged yet
feature/ad-photos-s3       ← merged into main ✅ (via PR #129)
feature/landing-page-cards ← merged into main ✅
feature/dark-mode-toggle   ← merged into main ✅ (PR #42)
```

## Local environment

- **Project path:** `/Users/petedw/Documents/GR18-Lexicon/Project 2 - News/fakenews5`
- **Docker container:** `postgres_sv` must be running (port 5434, password `Merkava`)
- **Run dev:** `pnpm dev` — direnv sets `MallocNanoZone=0` automatically on `cd`
- **Browser for dev:** Firefox (Safari has localhost cookie issues)
- **Stripe local testing:** run `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook` in a separate terminal before any payment test
