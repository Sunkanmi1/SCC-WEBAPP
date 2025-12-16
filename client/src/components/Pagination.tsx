import React from 'react';
import '../styles/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum visible page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-text">
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
          <strong>{totalItems}</strong> cases
        </span>
      </div>

      <nav className="pagination" aria-label="Pagination navigation">
        {/* Previous Button */}
        <button
          className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left"></i>
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-ellipsis">...</span>
              ) : (
                <button
                  className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageClick(page as number)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </nav>

      {/* Items per page selector */}
      <div className="pagination-per-page">
        <label htmlFor="items-per-page">Cases per page:</label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => onPageChange(1)} // Reset to page 1 when changing items per page
          className="per-page-select"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
