# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session

**Date:** 2026-07-20
**Branch:** `main` (up to date with origin/main, includes PR #156) — today's fixes are all **uncommitted, local-only**, not yet branched/PR'd/merged

---

## What's been built (merged to main)

### Peter's work

- ✅ Newspaper landing page layout, live weather/markets widgets, dark/light theme toggle, S3 image upload — see prior sessions
- ✅ Classified Ads / Buy & Sell / Marketplace removed (PR #136); Ad display fixes incl. placement control (PR #142) — see prior sessions
- ✅ **Dashboard sidebar theming** (uncommitted): sidebar text/icon color now matches the "Saved articles" badge red in light mode; sidebar collapse-toggle icon color fixed in light mode; hover "amplify" effect (scale + bold) added to sidebar nav items; "Change email"/"Password" labels fixed (were invisible black-on-black in dark mode); Subscription page Cancel button now amber-by-default/red-on-hover in dark mode; "Reset" button text visibility + working hover states added to Reset/Submit buttons (a shared `Button` component quirk meant `hover:` never worked on plain `<button>` elements before)
- ✅ **Article dark mode fix** (uncommitted): `dark:prose-invert` added to the article body wrapper — bold text was staying black in dark mode. Permanent fix since the article page is a shared template for every article, not per-article.
- ✅ **Article reactions fix** (uncommitted): thumbs up/down icons no longer render pre-filled — only fill after the user actually reacts (`likes.tsx`, `fill="none"` vs `fill="currentColor"`)
- ✅ **Image insertion in articles** (uncommitted): new 🖼 toolbar button in the shared Tiptap editor (`src/components/tiptap.tsx`) — uploads to S3 via the existing `uploadImage` action and inserts at the cursor. Required pinning `@tiptap/extension-image` to `3.27.1` to match the installed `@tiptap/core` exactly (mismatched peer versions silently broke `setImage` at runtime with no install-time warning)
- ✅ **`&` → `&amp;` markdown corruption bug fixed** (uncommitted): `@tiptap/markdown` was HTML-entity-encoding literal `&` on every save, anywhere in the content. Fixed via new `src/lib/markdown.ts` (`fixEditorMarkdownEscaping`), applied in both `tiptap.tsx` and `output-editor.tsx`. One already-corrupted article (`01KWKYVH6NZTQ16CJESXC1HWP0`, AI-generated) was manually repaired in the DB — `&amp;` restored and broken nested-bullet lists (which had degraded into literal text / code blocks) flattened into working top-level bullets.
- ✅ **Admin self-lockout safeguards** (uncommitted, `user-action.ts`): an admin can no longer demote their own account, and the last remaining admin can't be demoted at all. Also discovered and fixed a real pre-existing gap: this server action had **no session/role check whatsoever** — any signed-in user could previously call it to edit anyone's role, including self-promoting to admin. Both guards + the auth check verified live with throwaway test accounts (self-demotion blocked, last-admin blocked, normal non-self/non-last demotion still works).

### Team's work (merged to main)

- ✅ Auth, article CRUD, admin dashboard, subscriptions, cookie consent, newsletter system, analytics rework — see prior sessions
- ✅ AI content generation tool (`/dashboard/admin/ai`) — prompt → Gemini → Tiptap-based output editor with plain-text/markdown views (PR #148–#155 range)
- ✅ Styled transactional emails (React Email: reset-password, verify-email, subscription cancel/update/verify, weekly-newsletter)
- ✅ Article summary limit raised to 1000 characters
- ✅ Weather widget rework (`weather-app.tsx`)

---

## In progress

### Uncommitted local changes — not yet branched or PR'd
Everything in "Peter's work" above marked **(uncommitted)** is sitting directly on `main` as working-tree changes. Per project rules, nothing gets committed/pushed until the user has tested and explicitly asks to branch + PR. Modified/untracked files as of end of session:
```
CLAUDE.md, STATUS.md, package.json, pnpm-lock.yaml,
src/app/article/[articleID]/_components/likes.tsx,
src/app/article/[articleID]/page.tsx,
src/app/dashboard/(user)/profile/_components/edit-profile-form.tsx,
src/app/dashboard/(user)/profile/_components/sidebar.tsx,
src/app/dashboard/(user)/profile/layout.tsx,
src/app/dashboard/(user)/profile/security/_components/change-email-form.tsx,
src/app/dashboard/(user)/profile/security/_components/change-password-form.tsx,
src/app/dashboard/(user)/profile/sub/_components/cancel-button.tsx,
src/app/dashboard/admin/ai/_components/output-editor.tsx,
src/app/dashboard/admin/users/[userId]/edit/_actions/user-action.ts,
src/app/dashboard/admin/users/[userId]/edit/_components/edit-user-form.tsx,
src/components/sidebar-ad.tsx, src/components/theme-toggle.tsx, src/components/tiptap.tsx
?? src/app/linus-test/ (safe to delete, experimental)
?? src/lib/markdown.ts (new file, part of the & escaping fix)
```

### Known schema issue (still not fixed in main)
- `UserInfo.role` field has NOT reintroduced in recent pulls — team seems to have stopped doing this, but still worth checking after every pull as a habit.
- Fix is on branch `fix/remove-userinfo-role` — needs team to merge

### Environment quirks (see CLAUDE.md → Common problems & fixes for full detail)
- `git fetch`/`pull` can hang indefinitely (exit 143) even though the underlying git process often completes — retry as a backgrounded command.
- Local branch `HEAD` can silently end up on a stale already-merged branch instead of `main` — always check `git branch --show-current` before trusting `git status`.
- Tiptap extension peer-version mismatches break at runtime with zero install-time warning — always pin to the exact `@tiptap/core` version.

---

## Next up

### Before anything else
- [ ] **Branch + commit + PR today's uncommitted fixes** once the user has tested them in the browser — do NOT commit/push proactively.

### Open PRs waiting for merge
- [ ] `fix/remove-userinfo-role` — removes role from UserInfo schema

### Bugs to fix
- [ ] **`add-article` author field** — article created with no author if typed alias doesn't match exactly. Should show dropdown of existing authors.
- [ ] **Migration history broken (GitHub issue #44)** — one team member needs to follow issue steps to recreate the baseline migration so `prisma migrate deploy` works again.
- [ ] **Subscription price mismatch** — website-displayed price for Pro plan doesn't match Stripe checkout price. Not yet investigated.
- [ ] **Nested-list-as-code-block markdown parsing issue** — deeply indented AI-generated lists get misparsed by Tiptap/marked as code blocks. No fix yet; would need markdown indentation normalization before it reaches the editor.

### Project requirements still to build
- [ ] **Category pages** — wire up nav links (Ekonomi, Inrikes, Väder, Utrikes, Sports subcategories)

### Nice to have
- [ ] Add `isMostPopular` badge on news cards
- [ ] Weather icon animations
- [ ] `/dashboard/admin/advertisements` edit form's "Placement" dropdown only applies on click of "Save changes" — worth a visible hint
- [ ] Consider adding a badge/count indicator on the Tiptap image-insert button while uploading (currently just swaps to "…")

---

## Known issues

| Issue | Status | Fix |
|---|---|---|
| `UserInfo.role` in schema crashes app | Watch for recurrence | Remove from schema, `pnpm prisma generate`, clear `.next` |
| `prisma migrate dev/deploy` wants to reset DB | Not fixed (issue #44) | Use `pnpm prisma db push` instead |
| Regenerated Prisma Client not picked up by running dev server | Client is a process singleton | Stop `pnpm dev`, `rm -rf .next`, restart |
| Paid but role not updated | `stripe listen` not running | Run `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook` before testing payments |
| `commentary-section.tsx` TS error (missing `Role` enum) | Not fixed | Tied to `fix/remove-userinfo-role` PR |
| `git fetch`/`pull` appears to hang (exit 143) | Environment quirk | Retry in background, check result after a few seconds |
| Tiptap extension runtime error (`X is not a function`) | Fixed once, can recur | Pin extension version to match `@tiptap/core` exactly |
| Article markdown `&` corruption | Fixed going forward | `fixEditorMarkdownEscaping()` in `src/lib/markdown.ts`; old corrupted content needs manual repair |
| Deeply nested markdown lists render as code blocks | Not fixed | AI-generated content with 4+ space indents; needs indentation normalization |
| Admin could accidentally lock themselves out / any user could edit any role | ✅ Fixed | Self-demotion + last-admin guards, plus a missing admin-only auth check, added to `user-action.ts` |

---

## Git state

```
main   ← up to date with origin/main (includes PR #156, weather widget rework)
```

All local changes today are uncommitted working-tree modifications on `main` — no new branches created this session.

## Local environment

- **Project path:** `/Users/petedw/Documents/GR18-Lexicon/Project 2 - News/fakenews5`
- **Docker container:** `postgres_sv` must be running (port 5434, password `Merkava`) — requires Docker Desktop to be started first
- **Run dev:** `pnpm dev` — direnv sets `MallocNanoZone=0` automatically on `cd`. Note: leftover `next-server` processes from prior sessions have repeatedly held port 3000 — check `lsof -ti :3000` / `ps -p <pid>` before assuming a fresh start is needed.
- **Browser for dev:** Firefox (Safari has localhost cookie issues)
- **Stripe local testing:** run `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook` in a separate terminal before any payment test
- **Experimental/untracked:** `src/app/linus-test/` — standalone SVG animation demo, not linked from nav, safe to delete anytime
- **Throwaway test accounts:** when testing auth-gated features, create disposable accounts via `auth.api.createUser` + `prisma.user.update({ emailVerified: true, role: ... })` in a `tsx --env-file=.env` script, sign in through the real browser form (session cookies are httpOnly, can't be set via JS), then clean up via direct SQL delete (`session`, `account`, `author`, `user_info`, then `user`, in that FK order) when done.
