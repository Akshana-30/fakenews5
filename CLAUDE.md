# Fakenews5 — Claude Code Reference

## Project
Swedish news website built with Next.js 16, React 19, TypeScript, Tailwind CSS v4.
School project at Lexicon GR18. Team repo: https://github.com/hemligt-mfer/fakenews5

## Key rules
- **Never push directly to `main`** — always work on a branch, push the branch, open a PR
- **Always run `pnpm prisma migrate deploy && pnpm prisma generate` after pulling** if migrations changed
- **Clear `.next` only when the dev server is stopped** — never while it is running
- `package.json` dev script has a local-only fix (`env -u MallocNanoZone next dev`) — do not commit it
- `prisma/schema.prisma` must NOT have `role` in the `UserInfo` model — the migration dropped it but the team forgot to update the schema. Re-remove it after every pull if it reappears.

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
- **Migrations:** `prisma/migrations/` — 17 migrations applied
- **Known issue:** `UserInfo.role` was dropped by migration but team keeps adding it back to schema — always remove it and regenerate
- **Regenerate client:** `pnpm prisma generate`
- **Apply migrations:** `pnpm prisma migrate deploy`
- **Set user as admin:** `docker exec postgres_sv psql -U postgres -d fakenews5 -c "UPDATE \"user\" SET role = 'admin' WHERE email = 'your@email.com';"`

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
    dashboard/admin/                ← Admin dashboard
    dashboard/user/                 ← User dashboard
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
| `feature/landing-page-cards` | Newspaper layout, live APIs, new components |
| `fix/remove-userinfo-role` | Removes role from UserInfo schema |

## Common problems & fixes

| Problem | Fix |
|---|---|
| `column "role" does not exist` | Remove `role` from `UserInfo` in schema.prisma, run `pnpm prisma generate`, clear `.next` |
| Blank article page | Run `pnpm prisma migrate deploy && pnpm prisma generate` — missing migrations |
| Turbopack workspace root warning | `next.config.ts` must have `turbopack: { root: __dirname }` |
| `MallocStackLogging` spam | `~/.zshrc` has `export MallocNanoZone=1` — open a new terminal |
| Computer slow / out of RAM | Quit Teams + DeepL; only run `postgres_sv` Docker container |
| `pnpm dev` won't start | Stop dev server first, then `rm -rf .next`, then restart |
