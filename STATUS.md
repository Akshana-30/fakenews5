# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session

**Date:** 2026-06-08
**Branch:** merged `feature/dark-mode-toggle` → `main` (PR #42)

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
- ✅ Landing page aligned to shadcn design tokens — all hardcoded `#c8a84b` replaced with `text-primary`; raw `<input>`/`<button>` replaced with shadcn `Input`/`Button`; `<hr>` replaced with shadcn `Separator`

### Team's work (merged to main)

- ✅ Auth: register, sign-in, forgot-password, email verification
- ✅ Article CRUD: create, view, edit, reactions (like/dislike), bookmarks, views, comments + replies
- ✅ Admin dashboard: charts (line, bar, pie), user counts, top commenter, article stats (#36)
- ✅ User dashboard: account page (#35)
- ✅ Article table with editor's choice toggle
- ✅ User management table
- ✅ Nested comments + reply form (#37)
- ✅ Admin navbar moved into root layout (#41)
- ✅ Hydration fix (#40)
- ✅ Reactions bug fixed — users can now react to multiple articles

---

## In progress

### Known schema issue (still not fixed in main)

- `UserInfo.role` field is still in `schema.prisma` but was dropped from the database by migration
- After every pull: check if `role Role @default(UNSUBSCRIBED)` is back in UserInfo — if so, remove it and run `pnpm prisma generate` + clear `.next`
- Fix is on branch `fix/remove-userinfo-role` — needs team to merge

---

## Next up

### Bugs to fix

- [ ] **Article reactions `@unique` on `userId`** — a user can only react to ONE article total. Should be `@@unique([userId, article_id])`. Needs migration. Branch: `fix/article-reaction-unique-constraint`
- [ ] **Permission check on add-article** — team's version has broken `if (!hasPermission)` (never redirects). Should be `if (!hasPermission.success)` with `article: ["create"]` only.

### Project requirements still to build

- [ ] **Subscription system** — "Subscribe Now" for unsubscribed users, credit card validation (Zod), Stripe integration (`stripe` CLI is installed at `~/.local/bin/stripe`)
- [ ] **My page / user profile** — edit profile, reset password, view subscriptions, personalised newsletter signup
- [ ] **Cookie consent / privacy page**
- [ ] **AI functionality** — generate article drafts or images (OpenAI/Anthropic key needed)
- [ ] **Category pages** — wire up nav links (Ekonomi, Inrikes, Väder, Utrikes, Sports subcategories)
- [ ] **Image upload** — currently articles take a URL; could add Uploadthing or Cloudinary for direct upload

### Nice to have

- [ ] Add `isMostPopular` badge on news cards
- [ ] Weather icon animations
- [ ] Markets widget: add OMX chart (sparkline)

---

## Known issues

| Issue                                  | Status                    | Fix                                                       |
| -------------------------------------- | ------------------------- | --------------------------------------------------------- |
| `UserInfo.role` in schema crashes app  | Recurring after each pull | Remove from schema, `pnpm prisma generate`, clear `.next` |
| Article reactions `@unique` on userId  | Not fixed                 | New branch needed                                         |
| `add-article` permission check broken  | Not fixed                 | Team's version reverts our fix each time                  |
| OMX data only live during market hours | By design                 | Shows `–` outside trading hours                           |

---

## Git state

```
main                        ← fully up to date with origin/main
feature/landing-page-cards  ← merged into main ✅
feature/dark-mode-toggle    ← merged into main ✅ (PR #42, 2026-06-08)
fix/remove-userinfo-role    ← pushed, PR open, not merged yet
```

## Local environment

- **Project path:** '/Users/petedw/Documents/GR18-Lexicon/Project 2 - News'
- **Docker container:** `postgres_sv` must be running (port 5434, password `Merkava`)
- **Run dev:** `pnpm dev` (MallocNanoZone fix is in `~/.zshrc` — open a fresh terminal)
- **Browser for dev:** Firefox (Safari has localhost cookie issues)
- **Alpha Vantage key:** in `.env` as `ALPHAVANTAGE_API_KEY` (not currently used — OMX via Nasdaq instead)
