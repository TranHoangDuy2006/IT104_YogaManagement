import { useState } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    setCurrentPage,
  };
}
