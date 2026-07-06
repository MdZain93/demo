/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

// Redux
import { fetchRequests } from '../../features/procurement/procurementSlice';

// Components & Hooks
import AppTable from '../../components/common/AppTable';
import StatusChip from '../../components/common/StatusChip';
import RiskChip from '../../components/common/RiskChip';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import ExportButton from '../../components/common/ExportButton';
import { useTableFilters } from '../../hooks/useTableFilters';
import { usePagination } from '../../hooks/usePagination';
import formatCurrency from '../../utils/formatCurrency';
import { formatDateOnly } from '../../utils/formatDate';
import { REQUEST_STATUSES, DEPARTMENTS } from '../../utils/constants';

export function ProcurementListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { requests, loading, error } = useSelector((state) => state.procurement);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  // Use custom hook for filters on raw requests array
  const {
    searchTerm,
    filters,
    sortConfig,
    handleSearchChange,
    handleFilterChange,
    handleRequestSort,
    filteredData,
    resetFilters
  } = useTableFilters(requests, ['id', 'title', 'vendor', 'requestedBy']);

  // Use custom pagination hook
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    sliceData
  } = usePagination(0, 10);

  const handleRefresh = () => {
    dispatch(fetchRequests());
  };

  if (loading) {
    return <AppLoader message="Retrieving procurement transactions registry..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={handleRefresh} />;
  }

  // Define table columns
  const COLUMNS = [
    { id: 'id', label: 'Request ID', sortable: true },
    { id: 'title', label: 'Title', sortable: true },
    { id: 'department', label: 'Department', sortable: true },
    { id: 'requestedBy', label: 'Requested By', sortable: true },
    { id: 'vendor', label: 'Vendor', sortable: true },
    { id: 'amount', label: 'Amount', sortable: true, align: 'right' },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'riskLevel', label: 'Risk', sortable: true },
    { id: 'createdDate', label: 'Created Date', sortable: true },
    { id: 'actions', label: 'Actions', align: 'center' }
  ];

  const paginatedRows = sliceData(filteredData);

  return (
    <Box>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography 
            variant="h1" 
            fontWeight={800} 
            color="text.primary"
            sx={{ letterSpacing: '-0.03em', mb: 0.5, fontFamily: '"Outfit", sans-serif' }}
          >
            Procurement Workspace
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.7 }}>
            Process, log, and filter capital expenditures, contracts, and invoices.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Refresh Registry">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <ExportButton
            data={filteredData}
            headers={['Request ID', 'Title', 'Department', 'Requested By', 'Vendor', 'Amount', 'Status', 'Risk Level', 'Created Date']}
            keys={['id', 'title', 'department', 'requestedBy', 'vendor', 'amount', 'status', 'riskLevel', 'createdDate']}
            fileName="Procurement_Requests_Registry"
          />

          {user?.role === 'Employee' || user?.role === 'Administrator' ? (
            <Button
              component={Link}
              to="/procurement/create"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Create Request
            </Button>
          ) : null}
        </Box>
      </Box>

      {/* Filter and search controls panel */}
      <Paper 
        sx={{ 
          p: 2.5, 
          mb: 4, 
          borderRadius: '14px',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.4)' : '#f9fafb',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 'none'
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        {/* Search */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by ID, title, vendor, requested by..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                bgcolor: 'background.paper'
              } 
            }}
          />
        </Grid>

        {/* Status Dropdown */}
        <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Filter Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filters.status || 'All'}
              label="Filter Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              {REQUEST_STATUSES.map((status, idx) => (
                <MenuItem key={idx} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Department Dropdown */}
        <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="dept-filter-label">Filter Department</InputLabel>
            <Select
              labelId="dept-filter-label"
              id="dept-filter"
              value={filters.department || 'All'}
              label="Filter Department"
              onChange={(e) => handleFilterChange('department', e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="All">All Departments</MenuItem>
              {DEPARTMENTS.map((dept, idx) => (
                <MenuItem key={idx} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Filter Button */}
        <Grid size={{ xs: 12, sm: 4, md: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="text" 
            size="small" 
            onClick={resetFilters} 
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Clear All Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>

      {/* Requests table */}
      <AppTable
        columns={COLUMNS}
        rows={paginatedRows}
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onSort={handleRequestSort}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        renderRow={(row, idx) => (
          <TableRow key={row.id || idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
              {row.id}
            </TableCell>
            <TableCell sx={{ fontWeight: 600, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {row.title}
            </TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.requestedBy}</TableCell>
            <TableCell>{row.vendor}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              {formatCurrency(row.amount)}
            </TableCell>
            <TableCell>
              <StatusChip status={row.status} />
            </TableCell>
            <TableCell>
              <RiskChip level={row.riskLevel} />
            </TableCell>
            <TableCell>{formatDateOnly(row.createdDate)}</TableCell>
            <TableCell align="center">
              <Tooltip title="View Complete Details">
                <IconButton onClick={() => navigate(`/procurement/${row.id}`)} color="primary" size="small">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )}
      />
    </Box>
  );
}

export default ProcurementListPage;
