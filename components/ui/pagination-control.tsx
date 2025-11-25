"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
  totalPages: number;
  pageSize?: number; // optional, not used for pagination math here but provided for API parity
  currentPage?: number; // 1-based
  onPageChange: (page: number) => void;
  className?: string;
};

function range(start: number, end: number) {
  const r: number[] = [];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
}

export default function PaginationControl({
  totalPages,
  currentPage = 1,
  onPageChange,
  className,
}: Props) {
  if (totalPages <= 1) return null;

  // Decide window: show first, last, and up to 5 pages around current
  const visible = 5;
  let start = Math.max(1, currentPage - Math.floor(visible / 2));
  let end = start + visible - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visible + 1);
  }

  const pages = range(start, end);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                isActive={1 === currentPage}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {start > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              onClick={() => onPageChange(p)}
              isActive={p === currentPage}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                isActive={totalPages === currentPage}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
