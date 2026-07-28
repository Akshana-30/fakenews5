# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session

**Date:** 2026-07-22 to 2026-07-24
**Branch:** `main` (up to date with origin/main at `922b82d`, includes PR #171, #174, and everything the team merged through #180) — contact form has one small **uncommitted, local-only** formatting-only diff (see below)

---

## What's been built (merged to main)

### Peter's work

- ✅ Newspaper landing page layout, live weather/markets widgets, dark/light theme toggle, S3 image upload — see prior sessions
- ✅ Classified Ads / Buy & Sell / Marketplace removed (PR #136); Ad display fixes incl. placement control (PR #142) — see prior sessions
- ✅ **PR #171 — dark mode reactions, Tiptap image insert, admin auth hardening** (merged):
  - Thumbs up/down icons no longer render pre-filled in either article or comment reactions — only fill after the user actually reacts (`likes.tsx` and `commentary-reactions.tsx`, `fill="none"` vs `fill="currentColor"`; the comment version was a second, separate occurrence of the same bug found after a regression report)
  - New 🖼 image-insert toolbar button in the shared Tiptap editor (`src/components/tiptap.tsx`) — uploads to S3 via the existing `uploadImage` action and inserts at the cursor. Required pinning `@tiptap/extension-image` to `3.27.1` to match the installed `@tiptap/core` exactly (mismatched peer versions silently broke `setImage` at runtime with no install-time warning)
  - `&` → `&amp;` markdown corruption bug fixed: `@tiptap/markdown` was HTML-entity-encoding literal `&` on every save, anywhere in the content. Fixed via new `src/lib/markdown.ts` (`fixEditorMarkdownEscaping`), applied in both `tiptap.tsx` and `output-editor.tsx`. One already-corrupted article (`01KWKYVH6NZTQ16CJESXC1HWP0`, AI-generated) was manually repaired in the DB
  - Admin self-lockout safeguards (`user-action.ts`): an admin can no longer demote their own account, and the last remaining admin can't be demoted at all. Also fixed a real pre-existing gap: this server action had **no session/role check whatsoever** — any signed-in user could previously call it to edit anyone's role, including self-promoting to admin
  - Assorted dark-mode styling fixes: profile sidebar colors/hover effect, edit-profile/change-email/change-password label contrast, subscription cancel button
  - Deleted the untracked, unrelated `src/app/linus-test/` experimental directory
- ✅ **PR #174 — contact form dark mode + in-article ad removal** (merged):
  - Contact form Name/Email/Subject inputs were showing a brown/orange background in dark mode instead of matching the Message textarea's dark gray — root cause was `bg-sidebar-accent/40` having no `dark:` counterpart to beat the Textarea component's own `dark:bg-input/30`, so native `<input>`s (no such default) kept the raw sidebar-accent color, which is brown-orange in dark mode. Fixed by adding explicit `dark:bg-input/30 dark:border-input` to the shared `inputStyle` class in `ContactForm.tsx`
  - Send Message button text + paper-plane icon now white in dark mode (`dark:text-white`)
  - Contact page subtitle and Email/Address/Support Hours card text darkened in light mode (`text-black/60 dark:text-muted-foreground`) — was using a fixed-lightness `--muted-foreground` gray that read too light against a white background
  - Removed the "in-article" ad format entirely: dropped from the Formats & Rates table on `/advertise` and from the Format dropdown on the admin "Add new advertisement" form, via the shared `AD_FORMATS` list in `src/lib/ad-formats.ts`. The `in-article-ad.tsx` component and its label in `ad-list.tsx` were deliberately left alone (dormant/unused per an earlier team decision, and any legacy DB rows with that format still need a readable label)

### Team's work (merged to main)

- ✅ Auth, article CRUD, admin dashboard, subscriptions, cookie consent, newsletter system, analytics rework — see prior sessions
- ✅ AI content generation tool (`/dashboard/admin/ai`) — prompt → Gemini → Tiptap-based output editor with plain-text/markdown views (PR #148–#155 range)
- ✅ Styled transactional emails (React Email: reset-password, verify-email, subscription cancel/update/verify, weekly-newsletter)
- ✅ Article summary limit raised to 1000 characters
- ✅ Weather widget rework (`weather-app.tsx`)
- ✅ Mobile-friendly comment section (PR #172); numerous small PRs #173–#180 covering navbar/chart fixes, cursor-pointer consistency, rounded-shadow styling, AI-helper dropdown in editor navbar, a new password-gate for profile settings, About page rewrite, article preview/width fixes

---

## In progress

### Uncommitted local changes
Only one small item left uncommitted, on `main`:
```
src/app/contact/ContactForm.tsx — formatting-only (multi-line JSX/line-break style),
                                  no functional change, safe to leave or commit anytime
```
Everything else from this session (PR #171, PR #174) is merged.

### Known schema issue (still not fixed in main)
- `UserInfo.role` field has NOT reintroduced in recent pulls — team seems to have stopped doing this, but still worth checking after every pull as a habit.
- A local branch `fix/remove-userinfo-role` exists but has no corresponding open PR on GitHub (checked 2026-07-24) and is not merged into `main` — likely stale/abandoned; re-evaluate whether it's still needed before reviving it.

### Environment quirks (see CLAUDE.md → Common problems & fixes for full detail)
- `git fetch`/`pull` can hang indefinitely (exit 143) even though the underlying git process often completes — retry as a backgrounded command.
- Local branch `HEAD` can silently end up on a stale already-merged branch instead of `main` — always check `git branch --show-current` before trusting `git status`.
- Tiptap extension peer-version mismatches break at runtime with zero install-time warning — always pin to the exact `@tiptap/core` version.

---

## Next up

### Open PRs waiting for merge
- None currently open (checked via `gh pr list --state open` on 2026-07-24)

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
| Contact form inputs showed brown/orange background in dark mode | ✅ Fixed | Added explicit `dark:bg-input/30 dark:border-input` to `ContactForm.tsx`'s shared `inputStyle` |
| Contact page muted text too low-contrast in light mode | ✅ Fixed | `text-black/60 dark:text-muted-foreground` override on the affected `<p>` elements |

---

## Git state

```
main   ← up to date with origin/main at 922b82d (includes PR #171, #174, #172–#180)
```

PR #171 and PR #174 (this session's work) are merged. One small formatting-only diff to `ContactForm.tsx` remains uncommitted on `main` (see "In progress" above). No new branches currently open.

## Local environment

- **Project path:** `/Users/petedw/Documents/GR18-Lexicon/Project 2 - News/fakenews5`
- **Docker container:** `postgres_sv` must be running (port 5434, password `Merkava`) — requires Docker Desktop to be started first
- **Run dev:** `pnpm dev` — direnv sets `MallocNanoZone=0` automatically on `cd`. Note: leftover `next-server` processes from prior sessions have repeatedly held port 3000 — check `lsof -ti :3000` / `ps -p <pid>` before assuming a fresh start is needed.
- **Browser for dev:** Firefox (Safari has localhost cookie issues)
- **Stripe local testing:** run `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook` in a separate terminal before any payment test
- **Experimental/untracked:** `src/app/linus-test/` — standalone SVG animation demo, not linked from nav, safe to delete anytime
- **Throwaway test accounts:** when testing auth-gated features, create disposable accounts via `auth.api.createUser` + `prisma.user.update({ emailVerified: true, role: ... })` in a `tsx --env-file=.env` script, sign in through the real browser form (session cookies are httpOnly, can't be set via JS), then clean up via direct SQL delete (`session`, `account`, `author`, `user_info`, then `user`, in that FK order) when done.
