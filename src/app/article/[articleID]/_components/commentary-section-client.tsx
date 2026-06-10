"use client";
import Button from "@/components/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, type ReactNode } from "react";

const PAGE_SIZE = 5;

export default function CommentarySectionClient({
    totalCount,
    children,
}: {
    totalCount: number;
    children: ReactNode[];
}) {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(children.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const visible = children.slice(start, start + PAGE_SIZE);

    return (
        <div>
            {visible}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationPrevious
                                className="cursor-pointer"
                                onClick={() => {
                                    if (page !== 1) {
                                        setPage((p) => p - 1);
                                    }
                                }}
                            />

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        className={
                                            page === p
                                                ? "underline font-semibold"
                                                : "cursor-pointer"
                                        }
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationNext
                                className="cursor-pointer"
                                onClick={() => {
                                    if (page !== totalPages) {
                                        setPage(page + 1);
                                    }
                                }}
                            />
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
