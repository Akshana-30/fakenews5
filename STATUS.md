# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session
**Date:** 2026-06-04
**Branch:** `feature/landing-page-cards`

---

## In progress

### Landing page — newspaper layout ✅ Done
- Hero section: Editor's Choice article + right column with 3 articles (always filled)
- Latest News 3-column grid with images, category labels, timestamps
- Most Popular 3-column text-only grid
- Right sidebar: weather widget, markets widget, most read list, newsletter signup

### Live APIs ✅ Done
- `/api/weather` — Open-Meteo, Linköping, free, no key, refreshes every 10 min
- `/api/markets` — OMX Stockholm 30 (Nasdaq), EUR/SEK + USD/SEK (Frankfurter/ECB),
  Electricity SE3 (Elprisetjustnu.se), all with % change vs previous period
- Alpha Vantage key in `.env` as `ALPHAVANTAGE_API_KEY` (not used yet — OMX works via Nasdaq)

### Schema fix — UserInfo.role ✅ Done (branch only)
- `fix/remove-userinfo-role` branch pushed to GitHub — needs team to merge
- Team's `schema.prisma` still has `role` in UserInfo — apply fix locally after every pull

---

## Next up

### For the team to review/merge
- `feature/landing-page-cards` — PR open at GitHub
- `fix/remove-userinfo-role` — fixes the `column "role" does not exist` crash

### Article reactions (like/dislike) — bug
- `ArticleReaction.userId` has `@unique` constraint — should be `@@unique([userId, article_id])`
- A user can only react to one article total — needs a migration fix
- Create branch: `fix/article-reaction-unique-constraint`

### Still to build (project requirements)
- [ ] Subscription system — "Subscribe Now" for unsubscribed users, credit card validation
- [ ] My page — edit profile, reset password, view subscriptions, newsletter preferences
- [ ] Admin pages — subscription statistics, employee management, assign roles
- [ ] Cookie consent / privacy page
- [ ] Weather API — already done ✅
- [ ] Second API (markets) — already done ✅
- [ ] AI functionality — generate article drafts or images (OpenAI/Anthropic key needed)
- [ ] Category pages — wire up nav links (Ekonomi, Inrikes, Väder, Utrikes, Sports)
- [ ] Front page sections — Latest, Editor's Choice, Most Popular — done ✅

---

## Known issues

| Issue | Status |
|---|---|
| `UserInfo.role` in schema causes crash | Fix on `fix/remove-userinfo-role` branch — re-apply locally after each pull |
| Article reactions `@unique` on userId | Not fixed yet — blocks liking more than one article |
| Permission check reverted by team | `add-article/page.tsx` has old broken `if (!hasPermission)` — anyone can create articles |
| Markets widget OMX data | Live via Nasdaq API — only shows during Swedish market hours |

---

## Git state
```
main                      ← in sync with origin/main (team's version)
feature/landing-page-cards ← pushed to GitHub, PR open
fix/remove-userinfo-role   ← pushed to GitHub, PR open
```

## Local environment
- Docker container `postgres_sv` must be running (port 5434)
- `.env` file present at project root
- `MallocNanoZone=1` in `~/.zshrc` — suppresses Node malloc spam
- Run dev: `pnpm dev` from `fakenews5/` folder
