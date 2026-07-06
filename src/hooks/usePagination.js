/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

export function usePagination(initialPage = 0, initialRowsPerPage = 5) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when page size changes
  };

  const sliceData = (data) => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    sliceData
  };
}

export default usePagination;
