import { format, sub } from "date-fns";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/auth";

// The maximum numbers of articles per category, if it exists that many.
const NUMBER_OF_NEW_ARTICLES_PER_CATEGORY = 3;
const NUMBER_OF_NEW_ARTICLES_PER_AUTHOR = 2;
const NUMBER_OF_NEW_ARTICLES_MOST_VIEWS = 3;
const NUMBER_OF_NEW_ARTICLES_MOST_REACTIONS = 3;

async function generateNewsletter(userId: string) {
    const dateBack = sub(new Date(), { days: 7 }); // How far back in time we will select articles
    let text = "";

    const newsLetterSettings = await prisma.newsletterSettings.findUnique({
        where: { user_id: userId },
        include: { categories: true, authors: true },
    });
    if (!newsLetterSettings) {
        return;
    }

    // Get the latest articles from each category that the user is subscribed to.
    // Get a maximum of NUMBER_OF_NEW_ARTICLES_PER_CATEGORY articles.
    if (newsLetterSettings?.categories) {
        for (const c of newsLetterSettings.categories) {
            const res = await prisma.category.findUnique({
                where: { id: c.id },
                include: {
                    article: {
                        where: { createdAt: { gte: dateBack } },
                        orderBy: { createdAt: "desc" },
                        take: NUMBER_OF_NEW_ARTICLES_PER_CATEGORY,
                    },
                },
            });
            if (res?.article && res.article.length > 0) {
                text += `In the list below you will find the newest articles from each category you're subscribed to.\n`;
                text += `${c.name}: `;
                res.article.map((a, id) => {
                    text += `${a.title} (http://localhost:3000/article/${a.id})`;
                    if (id < res.article.length - 1) {
                        text += ", ";
                    } else {
                        text += ".";
                    }
                });
            }
            text += "\n\n";
        }

        if (newsLetterSettings.authors) {
            text += `In the list below you will find the ${NUMBER_OF_NEW_ARTICLES_PER_AUTHOR} newest articles from each author you're subscribed to.\n`;
            for (const a of newsLetterSettings.authors) {
                text += `${a.alias}: `;
                const res = await prisma.author.findUnique({
                    where: { id: a.id },
                    include: {
                        articles: {
                            where: { createdAt: { gte: dateBack } },
                            orderBy: { createdAt: "desc" },
                            take: NUMBER_OF_NEW_ARTICLES_PER_AUTHOR,
                        },
                    },
                });
                if (res?.articles && res.articles.length > 0) {
                    res.articles.map((a, id) => {
                        text += `${a.title} (http://localhost:3000/article/${a.id})`;
                        if (id < res.articles.length - 1) {
                            text += ", ";
                        } else {
                            text += ".";
                        }
                    });
                }
            }
        }

        // The most viewed articles, with a maximum of NUMBER_OF_NEW_ARTICLES_MOST_VIEWS
        const res = await prisma.article.findMany({
            where: { createdAt: { gte: dateBack } },
            orderBy: { views: "desc" },
            take: NUMBER_OF_NEW_ARTICLES_MOST_VIEWS,
        });
        if (res && res.length > 0) {
            text += `\n\nBelow you will find the most viewed articles for the latest week:`;
            res.map((a, id) => {
                text += `${a.title} (http://localhost:3000/article/${a.id})`;
                if (id < res.length - 1) {
                    text += ", ";
                } else {
                    text += ".";
                }
            });
        }
    }

    // The articles with the most reactions (upvotes and/or downvotes)
    text += "\n\n";
    const articles = await prisma.article.findMany({
        where: { createdAt: { gte: dateBack } },
        include: { reactions: true },
    });
    const articlesWithReactions = articles.filter((a) => a.reactions.length > 0);

    if (articlesWithReactions.length > 0) {
        const sorted = articlesWithReactions.sort(
            (a, b) => b.reactions.length - a.reactions.length,
        );

        text += `The articles that has had the most reactions (positive/negative): `;
        const slicedArticles = sorted.slice(0, NUMBER_OF_NEW_ARTICLES_MOST_REACTIONS);
        slicedArticles.map((a, i) => {
            text += `${a.title} (http://localhost:3000/article/${a.id})`;
            // Fixed: compare against slicedArticles.length, not the full sorted array
            if (i < slicedArticles.length - 1) {
                text += ", ";
            } else {
                text += ".";
            }
        });
    }

    return text;
}

async function runNewsletterJob() {
    const newsletters = await prisma.newsletterSettings.findMany();
    const results: { user_id: string; email: string; status: "sent" | "failed" | "skipped" }[] = [];

    for (const n of newsletters) {
        if (!n.active) {
            results.push({ user_id: n.user_id, email: n.email, status: "skipped" });
            continue;
        }

        const newsletter = await generateNewsletter(n.user_id);
        if (!newsletter) {
            results.push({ user_id: n.user_id, email: n.email, status: "skipped" });
            continue;
        }

        try {
            await transporter.sendMail({
                from: '"The Daily Commit" <noreply@thedailycommit.com>',
                to: n.email,
                subject: `The Daily Commit's newsletter (${format(new Date(), "dd/MM")})`,
                text: newsletter, // ← the actual content, previously missing
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
