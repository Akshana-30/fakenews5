"use client";
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
          <button
            className="text-sm disabled:opacity-40"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`text-sm w-7 h-7 rounded ${
                p === page
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="text-sm disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
