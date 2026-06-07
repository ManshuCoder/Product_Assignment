const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={!meta.hasPrevPage}
        onClick={() => onPageChange(meta.page - 1)}
      >
        ← Prev
      </button>

      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-page ${page === meta.page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next →
      </button>

      <span className="pagination-info">
        Page {meta.page} of {meta.totalPages} ({meta.total} products)
      </span>
    </div>
  );
};

export default Pagination;
