// src/components/PaginationButtons.jsx

import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function PaginationButtons({ currentPage, totalPages, basePath = '/' }) {
  if (totalPages <= 1) {
    return null; // Don't show if there's only one page
  }

  // Helper to create the correct link, handling the base path for the homepage
  const createPageLink = (page) => {
    if (basePath === '/') {
        return `/?page=${page}`;
    }
    // For other paths like /rated or /search/term
    return `${basePath}?page=${page}`;
  };

  return (
    <div className='flex justify-between items-center text-lg p-4 max-w-6xl mx-auto'>
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link 
          href={createPageLink(currentPage - 1)}
          className='flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-amber-600 transition-colors'
        >
          <ChevronLeftIcon className='h-6 w-6' />
          <span>Previous</span>
        </Link>
      ) : (
        <div className='flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 text-gray-500 cursor-not-allowed'>
           <ChevronLeftIcon className='h-6 w-6' />
           <span>Previous</span>
        </div>
      )}
      
      {/* Page Indicator */}
      <span className='font-semibold'>
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageLink(currentPage + 1)}
          className='flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-amber-600 transition-colors'
        >
          <span>Next</span>
          <ChevronRightIcon className='h-6 w-6' />
        </Link>
      ) : (
        <div className='flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 text-gray-500 cursor-not-allowed'>
            <span>Next</span>
            <ChevronRightIcon className='h-6 w-6' />
        </div>
      )}
    </div>
  );
}