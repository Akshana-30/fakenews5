import prisma from "@/lib/prisma";
import RouteHeading from "@/components/route-heading";
import RegisterAuthorForm from "./_components/register-author-form";
import AuthorsTable from "./_components/authors-table";

export default async function AuthorsPage() {
    const [authors, usersWithoutAuthor] = await Promise.all([
        prisma.author.findMany({
            select: {
                id: true,
                alias: true,
                _count: { select: { articles: true } },
                user_info: { select: { name: true, email: true, role: true } },
            },
            orderBy: { alias: "asc" },
        }),
        prisma.user.findMany({
            where: { author: null },
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" },
        }),
    ]);

    const authorRows = authors.map((a) => ({
        id: a.id,
        alias: a.alias,
        articleCount: a._count.articles,
        user: {
            name: a.user_info.name,
            email: a.user_info.email,
            role: a.user_info.role,
        },
    }));

    return (
        <div className="w-full">
            <RouteHeading label="Authors" />
            <div className="px-6 pt-4 pb-10 space-y-8 max-w-5xl">
                <section>
                    <h2 className="text-base font-semibold mb-3">Register a new author</h2>
                    {usersWithoutAuthor.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            All users already have an author profile.
                        </p>
                    ) : (
                        <RegisterAuthorForm users={usersWithoutAuthor} />
                    )}
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">
                        Registered authors ({authorRows.length})
                    </h2>
                    <AuthorsTable authors={authorRows} />
                </section>
            </div>
        </div>
    );
}
