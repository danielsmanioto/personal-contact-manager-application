import React from 'react'
import { Button } from '@components/atoms'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex gap-12 items-center justify-center">
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </Button>

      <span className="text-sm text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </Button>
    </div>
  )
}

Pagination.displayName = 'Pagination'
