import React from 'react';

const PaginationControl = ({ currentPage, totalPages, onPageChange, onNext, onPrev }) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-2 text-sm">
      <span>Halaman</span>
      <select
        value={currentPage}
        onChange={(e) => onPageChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <option key={page} value={page}>{page}</option>
        ))}
      </select>
      <span>dari {totalPages}</span>
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded text-white ${currentPage === 1 ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
      >
        &lt;
      </button>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded text-white ${currentPage === totalPages ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationControl;
