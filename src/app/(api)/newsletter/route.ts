import { format, sub } from "date-fns";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/auth";
import { render, toPlainText } from "react-email";
import WeeklyNewsletter, {
    type NewsletterArticle,
    type NewsletterCategorySection,
    type NewsletterAuthorSection,
} from "@/components/emails/weekly-newsletter";

// The maximum numbers of articles per category, if it exists that many.
const NUMBER_OF_NEW_ARTICLES_PER_CATEGORY = 3;
const NUMBER_OF_NEW_ARTICLES_PER_AUTHOR = 2;
const NUMBER_OF_NEW_ARTICLES_MOST_VIEWS = 3;
const NUMBER_OF_NEW_ARTICLES_MOST_REACTIONS = 3;

const ARTICLE_SELECT = { id: true, title: true, summary: true } as const;

function toArticle(a: { id: string; title: string; summary: string | null }): NewsletterArticle {
    return { id: a.id, title: a.title, summary: a.summary ?? "" };
}

interface NewsletterData {
    categories: NewsletterCategorySection[];
    authors: NewsletterAuthorSection[];
    mostViewed: NewsletterArticle[];
    mostReactions: NewsletterArticle[];
}

async function generateNewsletterData(
    userId: string,
    dateBack: Date,
): Promise<NewsletterData | null> {
    const newsLetterSettings = await prisma.newsletterSettings.findUnique({
        where: { user_id: userId },
        include: { categories: true, authors: true },
    });
    if (!newsLetterSettings) {
        return null;
    }

    // Latest articles from each subscribed category.
    const categories: NewsletterCategorySection[] = [];
    for (const c of newsLetterSettings.categories) {
        const res = await prisma.category.findUnique({
            where: { id: c.id },
            include: {
                article: {
                    where: { createdAt: { gte: dateBack } },
                    orderBy: { createdAt: "desc" },
                    take: NUMBER_OF_NEW_ARTICLES_PER_CATEGORY,
                    select: ARTICLE_SELECT,
                },
            },
        });
        if (res?.article && res.article.length > 0) {
            categories.push({ name: c.name, articles: res.article.map(toArticle) });
        }
    }

    // Latest articles from each subscribed author.
    const authors: NewsletterAuthorSection[] = [];
    for (const a of newsLetterSettings.authors) {
        const res = await prisma.author.findUnique({
            where: { id: a.id },
            include: {
                articles: {
                    where: { createdAt: { gte: dateBack } },
                    orderBy: { createdAt: "desc" },
                    take: NUMBER_OF_NEW_ARTICLES_PER_AUTHOR,
                    select: ARTICLE_SELECT,
                },
            },
        });
        if (res?.articles && res.articles.length > 0) {
            authors.push({ alias: a.alias, articles: res.articles.map(toArticle) });
        }
    }

    // Most viewed articles this week.
    const mostViewedRaw = await prisma.article.findMany({
        where: { createdAt: { gte: dateBack } },
        orderBy: { views: "desc" },
        take: NUMBER_OF_NEW_ARTICLES_MOST_VIEWS,
        select: ARTICLE_SELECT,
    });
    const mostViewed = mostViewedRaw.map(toArticle);

    // Articles with the most reactions (upvotes and/or downvotes) this week.
    const articlesWithReactions = await prisma.article.findMany({
        where: { createdAt: { gte: dateBack } },
        include: { reactions: true },
    });
    const sorted = articlesWithReactions
        .filter((a) => a.reactions.length > 0)
        .sort((a, b) => b.reactions.length - a.reactions.length)
        .slice(0, NUMBER_OF_NEW_ARTICLES_MOST_REACTIONS);
    const mostReactions = sorted.map(toArticle);

    return { categories, authors, mostViewed, mostReactions };
}

async function runNewsletterJob() {
    const now = new Date();
    const dateBack = sub(now, { days: 7 });
    const dateLabel = `${format(dateBack, "dd/MM")} - ${format(now, "dd/MM")}`;

    const newsletters = await prisma.newsletterSettings.findMany();
    const results: { user_id: string; email: string; status: "sent" | "failed" | "skipped" }[] = [];

    for (const n of newsletters) {
        if (!n.active) {
            results.push({ user_id: n.user_id, email: n.email, status: "skipped" });
            continue;
        }

        const data = await generateNewsletterData(n.user_id, dateBack);
        if (
            !data ||
            (data.categories.length === 0 &&
                data.authors.length === 0 &&
                data.mostViewed.length === 0 &&
                data.mostReactions.length === 0)
        ) {
            results.push({ user_id: n.user_id, email: n.email, status: "skipped" });
            continue;
        }

        try {
            const html = await render(
                WeeklyNewsletter({
                    dateLabel,
                    categories: data.categories,
                    authors: data.authors,
                    mostViewed: data.mostViewed,
                    mostReactions: data.mostReactions,
                }),
            );

            await transporter.sendMail({
                from: '"The Daily Commit" <noreply@thedailycommit.com>',
                to: n.email,
                subject: `The Daily Commit's newsletter (${format(now, "dd/MM")})`,
                html,
                text: toPlainText(html),
            });
            results.push({ user_id: n.user_id, email: n.email, status: "sent" });
        } catch (error) {
            console.error(`Unable to send email to ${n.email}.\n\n${error}`);
            results.push({ user_id: n.user_id, email: n.email, status: "failed" });
        }
    }

    return results;
}

function checkAuth(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    return Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;
}

// Vercel Cron triggers via GET — this is the entry point the schedule actually calls.
export async function GET(request: Request) {
    if (!checkAuth(request)) {
        return new Response("Unauthorized", { status: 401 });
    }
    const results = await runNewsletterJob();
    return Response.json(results);
}

// Kept for manual/local triggering with the same auth check.
export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return new Response("Unauthorized", { status: 401 });
    }
    const results = await runNewsletterJob();
    return Response.json(results);
}
