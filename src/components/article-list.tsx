"use client";

import { Article } from "@/lib/types";
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";
import Image from "next/image";
import { Clock, MapPin, Pencil } from "lucide-react";
import { compareAsc, formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function ArticleList({
    articles,
    articlesPerPage,
}: {
    articles: Article[];
    articlesPerPage: number;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * articlesPerPage;
    const startIndex = lastIndex - articlesPerPage;
    const numberOfPages = Math.ceil(articles.length / articlesPerPage);
    const pageNumbers = Array.from(Array(numberOfPages).keys());
    const articlesToShow = articles.slice(startIndex, lastIndex);

    return (
        <div className="mx-auto md:w-3xl">
            <ul>
                {articlesToShow.map((article, i) => {
                    return (
                        <li key={article.id}>
                            <ArticleItem article={article} />
                        </li>
                    );
                })}
            </ul>
            {numberOfPages > 1 ? (
                <div>
                    <Pagination className="flex">
                        <PaginationContent>
                            <PaginationPrevious className="cursor-pointer" onClick={prevPage} />
                            {pageNumbers.length <= 10 ? (
                                pageNumbers.map((p, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            className={
                                                currentPage === p + 1
                                                    ? "underline font-semibold"
                                                    : "cursor-pointer"
                                            }
                                            onClick={() => setCurrentPage(p + 1)}
                                        >
                                            {p + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))
                            ) : (
                                <PaginationItem>
                                    {currentPage} / {pageNumbers.length}
                                </PaginationItem>
                            )}
                            <PaginationNext className="cursor-pointer" onClick={nextPage} />
                        </PaginationContent>
                    </Pagination>
                </div>
            ) : (
                ""
            )}
        </div>
    );

    function prevPage() {
        if (currentPage !== 1) {
            setCurrentPage((prev) => prev - 1);
        }
    }

    function nextPage() {
        if (currentPage !== numberOfPages) {
            setCurrentPage((prev) => prev + 1);
        }
    }
}

function ArticleItem({ article }: { article: Article }) {
    let authors = "";
    if (article.author.length > 0) {
        article.author.map((a, i) => {
            if (i !== article.author.length - 1) authors += a.alias + ", ";
            else authors += a.alias;
        });
    }

    let articleDate = article.createdAt;
    if (compareAsc(article.updatedAt, article.createdAt) == 1) {
        articleDate = article.updatedAt;
    }

    return (
        <div className="flex my-4">
            <div className="w-40 h-40 border mr-4">
                {article.image ? (
                    <Image src={article.image} alt={article.title} />
                ) : (
                    <div className="flex w-full h-full items-center justify-center">
                        <span className="text-sm uppercase opacity-50">No image</span>
                    </div>
                )}
            </div>
            <div className="w-full border-b flex-row p-1">
                <div>
                    <h1 className="text-lg font-semibold">
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </h1>
                    <p>{article.summary ? article.summary : article.content.slice(0, 500)}</p>
                </div>

                <div className="flex text-sm justify-between mt-12">
                    <div className="mt-auto">
                        {authors.length > 0 ? (
                            <div className="">
                                <p className="flex">
                                    <Pencil size={17} className="ml-1" />
                                    {authors}
                                </p>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                    <div>
                        {article.location ? (
                            <p className="flex">
                                <MapPin size={17} className="mr-1" /> {article.location}
                            </p>
                        ) : (
                            ""
                        )}
                        <p className="flex">
                            <Clock size={17} className="mr-1" />
                            {formatDistanceToNow(articleDate, { addSuffix: true })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
