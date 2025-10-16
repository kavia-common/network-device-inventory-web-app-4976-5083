import React from 'react';

// PUBLIC_INTERFACE
export default function Pagination({ page, perPage, total, onPageChange }) {
  /** Basic pagination controls. */
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (perPage || 10)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const goto = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <div className="pagination">
      <button className="btn btn-secondary" onClick={() => goto(1)} disabled={!canPrev}>
        « First
      </button>
      <button className="btn btn-secondary" onClick={() => goto(page - 1)} disabled={!canPrev}>
        ‹ Prev
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button className="btn btn-secondary" onClick={() => goto(page + 1)} disabled={!canNext}>
        Next ›
      </button>
      <button className="btn btn-secondary" onClick={() => goto(totalPages)} disabled={!canNext}>
        Last »
      </button>
    </div>
  );
}
