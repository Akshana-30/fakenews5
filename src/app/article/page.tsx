import { redirect } from "next/navigation";

// Article listing lives on the home page — redirect there
export default function ArticleIndexPage() {
    redirect("/");
}
