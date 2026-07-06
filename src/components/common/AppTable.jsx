/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import EmptyState from './EmptyState';

/**
 * Reusable AppTable component.
 * 
 * Props:
 * - columns: Array of objects { id: string, label: string, sortable: boolean, align: 'left'|'right'|'center' }
 * - rows: Array of objects
 * - count: total records
 * - page: current page
 * - rowsPerPage: records per page
 * - onPageChange: function
 * - onRowsPerPageChange: function
 * - onSort: function (takes columnId)
 * - sortKey: current active sorted column id
 * - sortDirection: 'asc' | 'desc'
 * - renderRow: function (takes row object and index, returns TableRow JSX)
 */
export function AppTable({
  columns = [],
  rows = [],
  count = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange = null,
  onRowsPerPageChange = null,
  onSort = null,
  sortKey = '',
  sortDirection = 'asc',
  renderRow
}) {
  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        borderRadius: '14px',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.01)'
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table" size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                   key={column.id}
                   align={column.align || 'left'}
                   sortDirection={sortKey === column.id ? sortDirection : false}
                   sx={{
                     bgcolor: (theme) => theme.palette.mode === 'dark' ? '#111827' : '#f9fafb',
                     color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : '#374151',
                     fontWeight: 600,
                     textTransform: 'uppercase',
                     fontSize: '0.7rem',
                     letterSpacing: '0.05em',
                     py: 1.8,
                     borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                   }}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={sortKey === column.id}
                      direction={sortKey === column.id ? sortDirection : 'asc'}
                      onClick={() => onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => renderRow(row, index))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Box py={4}>
                    <EmptyState />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {onPageChange && onRowsPerPageChange ? (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      ) : null}
    </Paper>
  );
}

export default AppTable;
