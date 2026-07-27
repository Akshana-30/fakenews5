# Fakenews5 — Claude Code Reference

## Project
Swedish news website built with Next.js 16, React 19, TypeScript, Tailwind CSS v4.
School project at Lexicon GR18. Team repo: https://github.com/hemligt-mfer/fakenews5

## Key rules
- **Never push directly to `main`** — always work on a branch, push the branch, open a PR
- **After pulling, always run `pnpm prisma db push && pnpm prisma generate`, then restart `pnpm dev`** — ⚠️ `prisma migrate deploy` does NOT work (migration history is broken, see Database section below). A running dev server does NOT pick up a regenerated Prisma Client on its own — restart is required, not just a hot reload
- **No commit or push until the user has tested the change** — this applies even after a fix looks correct in code
- **`.env` is never committed** — contains live secrets
- **Clear `.next` only when the dev server is stopped** — never while it is running
- `package.json` dev script has a local-only fix (`MallocNanoZone=0 next dev --no-turbopack`) — do not commit it
- `prisma/schema.prisma` must NOT have `role` in the `UserInfo` model — the migration dropped it but the team forgot to update the schema. Re-remove it after every pull if it reappears.
- **Classified ads / Buy & Sell / Marketplace removed** (team decision) — do not reintroduce; corporate display advertising (`/advertise`, `/dashboard/admin/advertisements`) is a separate, kept feature

## Local dev setup
- **Database:** PostgreSQL 17 in Docker, container `postgres_sv`, port `5434`, password `Merkava`
- **Start DB:** Docker Desktop must be running; only `postgres_sv` needs to be running
- **Run:** `cd /Users/petedw/Documents/GR18-Lexicon/Project_2_News/fakenews5 && pnpm dev`
- **URL:** http://localhost:3000
- **.env location:** `fakenews5/.env` (gitignored, never commit)

## .env contents (local)
```
DATABASE_URL=postgresql://postgres:Merkava@localhost:5434/fakenews5
BETTER_AUTH_SECRET=He4vgL7QHDYaOJbAvqRWEGnW8lmtLLfg
BETTER_AUTH_URL=http://localhost:3000
ALPHAVANTAGE_API_KEY=MMAU1SBG9AA15UFB
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_USER="charlie.oconner42@ethereal.email"
SMTP_PASS="weT4wHztKm2nYrBVTy"
```

## Tech stack
| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.6, App Router, Turbopack |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 17 (Docker) |
| ORM | Prisma v7 with `@prisma/adapter-pg` |
| Auth | Better Auth v1 (email/password, admin plugin) |
| UI components | shadcn/ui + Radix UI |
| Forms | TanStack Form + Zod v4 |
| Email (dev) | Nodemailer → Ethereal (fake inbox) |
| Package manager | pnpm |

## Database
- **Schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/` — ⚠️ **history is broken** (the `init` migration was deleted in a merge). `prisma migrate deploy` and `prisma migrate dev` will fail with a drift error. Use `prisma db push` instead (see below).
- **Sync schema to DB:** `pnpm prisma db push` — safe, preserves data, works despite broken migration history
- **Regenerate client:** `pnpm prisma generate`
- **DO NOT use:** `pnpm prisma migrate deploy` or `pnpm prisma migrate dev` — these will report massive drift and offer to reset (wipe) the database
- **Known issue:** `UserInfo.role` was dropped by migration but team keeps adding it back to schema — always remove it and regenerate
- **Set user as admin:** `docker exec postgres_sv psql -U postgres -d fakenews5 -c "UPDATE \"user\" SET role = 'admin' WHERE email = 'your@email.com';"`
- **Fix needed (GitHub issue #44):** Migration history needs a baseline recreation so `migrate deploy` can work again — see the issue for instructions

## Folder structure
```
src/
  app/
    page.tsx                        ← Landing page (newspaper layout)
    layout.tsx                      ← Root layout (header, navbar, sidebar)
    (api)/(auth)/                   ← Auth routes (register, sign-in, verify, forgot-password)
    api/weather/route.ts            ← Live weather API (Open-Meteo, Linköping)
    api/markets/route.ts            ← Live markets API (OMX, EUR/SEK, USD/SEK, Electricity SE3)
    article/[articleID]/            ← Single article page
    article/[articleID]/edit/       ← Edit article page
    article/add-article/            ← Create article page
    dashboard/admin/                ← Admin dashboard (charts: line, bar, pie, user counts)
    dashboard/admin/_actions/       ← chart-actions.ts (data for charts)
    dashboard/admin/_components/charts/ ← bar-chart, line-chart, pie-chart, user-counts
    dashboard/user/                 ← User dashboard / account page
  components/
    hero-card.tsx                   ← Large featured article (Editor's Choice)
    news-card.tsx                   ← Multi-size card (hero/medium/small/text)
    sidebar-card.tsx                ← Stacked sidebar article card
    section-head.tsx                ← Gold-ruled section divider
    weather-widget.tsx              ← Live weather widget (client component)
    markets-widget.tsx              ← Live markets widget (client component)
    news-sidebar.tsx                ← Sidebar (weather + markets + most read + newsletter)
    header.tsx                      ← Site masthead
    navbar/                         ← Desktop navbar + mobile sidebar
  _actions/
    article-actions.ts              ← getArticles, getArticle, getEditorsChoiceArticles,
                                       getMostPopularArticles, reactions, bookmarks, views
    user-actions.ts                 ← getUserId, setUserInfo, isEmailAddressUsed
  lib/
    auth.ts                         ← Better Auth config (email/password, admin plugin)
    prisma.ts                       ← Prisma singleton client
    permissions.ts                  ← Role-based access control (admin/editor/user)
```

## Key patterns

### Permission check (protected pages)
```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (!session) return redirect("/");
const hasPermission = await auth.api.userHasPermission({
    body: { userId: session.user.id, permissions: { article: ["create"] } },
});
if (!hasPermission.success) redirect("/");
```

### Server action pattern
```typescript
"use server";
export async function myAction(): Promise<Result<string>> {
    try {
        // ...
        return { success: true, data: "..." };
    } catch (err) {
        console.error("[myAction error]", err);
        return { success: false, error: `${err}` };
    }
}
```

### getUserId
Returns the `UserInfo.id` (NOT `User.id`) — used for all article/comment/bookmark queries.
Returns `false` if not logged in, `undefined` if logged in but no UserInfo record.

## Roles & permissions
| Role | Can do |
|---|---|
| UNSUBSCRIBED | Read articles only |
| SUBSCRIBER | Read + comment + like |
| AUTHOR | Create articles |
| EDITOR | Create + update + delete + editor's choice |
| ADMIN | Everything + user management |

Roles live on the `User.role` (Better Auth) field, NOT on `UserInfo` (that column was dropped).

## Active branches
| Branch | Purpose |
|---|---|
| `main` | Team's main branch — never push directly |
| `fix/remove-userinfo-role` | Removes role from UserInfo schema — local branch only, no open PR on GitHub (checked 2026-07-24), likely stale; re-evaluate before reviving |

⚠️ Stale local branches can silently become `HEAD` again (happened once — `git branch --show-current` showed `feature/remove-classifieds`, an old already-merged branch, instead of `main`). Before trusting `git status`, always check `git branch --show-current` first. If it's not `main`, verify the old branch is an ancestor of `main` (`git merge-base --is-ancestor <old> main`) before `git switch main` — safe to switch if true, since uncommitted changes carry over.

## Shared rich-text editor (Tiptap)
- **Component:** `src/components/tiptap.tsx` — used by article create/edit forms and `src/app/dashboard/admin/ai/_components/output-editor.tsx` (AI tool). One shared toolbar/extension config for both.
- **Image insertion:** toolbar has an 🖼 button — uploads via `uploadImage` (`@/lib/upload-action`, same S3/RustFS path as hero images) and inserts at the cursor via `editor.chain().focus().setImage(...)`. Requires `@tiptap/extension-image`.
- **⚠️ Tiptap package versions must match `@tiptap/core` exactly** — `@tiptap/extension-image` declares a strict peer dependency (e.g. `3.28.0` requires `@tiptap/core@3.28.0` exactly). pnpm will silently install a mismatched pair without erroring, and the symptom only shows at runtime (`editor.chain().focus().setImage is not a function`) with no install-time warning. When adding any `@tiptap/*` extension, pin it to the exact version already resolved for `@tiptap/core` (check `pnpm-lock.yaml` or `node_modules/.pnpm`), not just `^latest`.
- **`&` → `&amp;` corruption bug (fixed):** `@tiptap/markdown` (backed by `marked`) HTML-entity-encodes literal `&` on every `getMarkdown()` call, even outside lists/HTML context — e.g. a heading like "Visuals & Layout" becomes "Visuals &amp; Layout" on save. Fixed via `src/lib/markdown.ts` → `fixEditorMarkdownEscaping()`, applied in both `tiptap.tsx` and `output-editor.tsx` wherever markdown is read out of the editor. Any new caller of `editor.getMarkdown()` must also wrap it, or the corruption comes back for that path.
- **Known unfixed issue:** deeply-indented (4+ space) nested list items from AI-generated markdown get parsed as CommonMark *indented code blocks* instead of nested list items — a structural parsing issue, not something the entity-escaping fix touches. No general fix yet; one corrupted article (`01KWKYVH6NZTQ16CJESXC1HWP0`) was manually repaired in the DB.

## Ads system
- **Model:** `Advertisement` in schema.prisma — `format` (`banner` \| `sidebar` \| `newsletter` \| `sponsored`), `active`, `startsAt`/`endsAt`, `placement` (`top` \| `bottom` \| `both`, banner-only, default `both`)
- **"in-article" format removed from the UI (team decision):** dropped from the shared `AD_FORMATS` list in `src/lib/ad-formats.ts`, so it no longer appears in the Formats & Rates table on `/advertise` or the Format dropdown on the admin "Add new advertisement" form. The `in-article-ad.tsx` display component and its label in `ad-list.tsx`'s formatLabels map were deliberately left in place (dormant/unused, and needed if any legacy `Advertisement` row in the DB still has `format = "in-article"`) — don't reintroduce the format as a *creatable* option without team sign-off
- **Query:** `src/lib/ad-queries.ts` — `getActiveAd(format, slot?)` filters by placement when a slot is passed and dedupes per `(format, slot)` within a single page render (React `cache()`), so top/bottom banner or multiple sidebar slots don't draw the same ad when more than one is active
- **Admin UI:** `/dashboard/admin/advertisements` — create/edit forms show a Placement dropdown only when format is "banner". **Selecting a value in the dropdown does nothing until "Save changes" is clicked** — this has tripped us up before
- **Display components:** `ad-banner.tsx` (`slot` prop), `sidebar-ad.tsx`, `in-article-ad.tsx` — deliberately no `dark:` classes so creatives render identically in both themes
- **Visibility rules:** `ROLE_SHOWS_ADS` in `permissions.ts` hides ads for `admin`/`editor`; `InArticleAd` is commented out in the article page (team decision, left alone)

## Common problems & fixes

| Problem | Fix |
|---|---|
| `column "role" does not exist` | Remove `role` from `UserInfo` in schema.prisma, run `pnpm prisma generate`, clear `.next` |
| Blank article page / "Couldn't find article" | Schema out of sync — run `pnpm prisma db push && pnpm prisma generate`, clear `.next` |
| `prisma migrate dev` wants to reset the database | ⚠️ Do NOT reset — migration history is broken. Use `pnpm prisma db push` instead |
| `prisma migrate deploy` reports drift | Same cause — use `pnpm prisma db push` until the migration history is fixed (see issue #44) |
| Turbopack workspace root warning | `next.config.ts` must have `turbopack: { root: __dirname }` |
| `MallocStackLogging` spam | `~/.zshrc` has `export MallocNanoZone=1` — open a new terminal |
| `malloc: pointer being freed was not allocated` crash (M1) | Turbopack native module heap corruption. Fix: `"dev": "MallocNanoZone=0 next dev --no-turbopack"` in `package.json` (local only, do not commit) |
| Computer slow / out of RAM | Quit Teams + DeepL; only run `postgres_sv` Docker container |
| `pnpm dev` won't start | Stop dev server first, then `rm -rf .next`, then restart |
| Hydration mismatch from ProtonPass / password manager | Add `suppressHydrationWarning` to the div wrapping the email input |
| New `Advertisement.placement`/other field added but app still errors "column does not exist" | Prisma Client is a per-process singleton — regenerating it does NOT hot-reload into an already-running `pnpm dev`. Stop the server, `rm -rf .next`, restart |
| `git fetch`/`pull` hangs indefinitely (exit 143 on timeout) | Known flaky behavior in this environment: the credential-helper chain (`osxkeychain` → `gh auth git-credential store`) can block waiting on macOS Keychain access that never resolves headlessly, or the tool's timeout kills the wrapping shell while the underlying git process keeps running and actually completes. Retry by running the fetch in the background (`(git fetch origin main &) ; sleep 8; ...`) and checking again — it usually succeeds within a few seconds despite the parent call reporting a timeout |
| Stripe subscription paid but role not updated | `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook` not running locally — `onSubscriptionComplete` never fires without it. Fix stuck users manually: `UPDATE "user" SET role = '<plan>' WHERE email = '...'` |
| Tiptap extension command missing at runtime (e.g. `setImage is not a function`) | Peer version mismatch between the extension and `@tiptap/core` — pnpm doesn't error on this. Pin the extension to the exact `@tiptap/core` version, `pnpm install`, then fully restart `pnpm dev` (not just `.next` clear — node_modules changed) |
| Article body has literal `&amp;` or stray `\*`/code-block-looking bullet lists | The `&` bug is fixed going forward (see Tiptap section above); existing corrupted content needs manual DB repair. The nested-list-as-code-block issue is still open |

## Contact form
- **Component:** `src/app/contact/ContactForm.tsx` — Name/Email/Subject are plain `<input>` elements styled by a shared `inputStyle` string; Message uses the shadcn `Textarea` component with the same string passed as `className`.
- **⚠️ Dark-mode background gotcha:** a plain `<input>` gets no default background classes, so whatever `inputStyle` sets applies as-is in both themes. The shadcn `Textarea` component ships its own `dark:bg-input/30` default, which `tailwind-merge` keeps unless `inputStyle` also declares a `dark:` variant for the same utility — so a bg class with only a light-mode value (no `dark:` counterpart) will visibly diverge between the native inputs and the `Textarea` in dark mode even though both receive the identical class string. `inputStyle` now explicitly sets `dark:bg-input/30 dark:border-input` so all four fields match.

## Admin user management
- **Self-lockout guards** (`src/app/dashboard/admin/users/[userId]/edit/_actions/user-action.ts`): an admin cannot demote their own account, and the last remaining admin cannot be demoted by anyone. Both return a `Result<string>` error surfaced as a toast in `edit-user-form.tsx` — check `result.success` there, don't assume the action always succeeds.
- **This action also enforces `session.user.role === "admin"`** — added because it previously had *no* auth check at all (any signed-in user could call it to edit anyone's role, including self-promoting to admin). If you're touching this action, keep the auth check first, before the self/last-admin checks.
