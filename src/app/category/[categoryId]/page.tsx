export default async function CategoryPage({
    params,
}: {
    params: Promise<{ categoryId: string }>;
}) {
    const { categoryId } = await params;
    const articles = getArticlesByCategory(categoryId);
}
