/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
import Paper from '@mui/material/Paper';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

// Redux
import { fetchVendors } from '../../features/vendors/vendorSlice';

// Components & Hooks
import AppTable from '../../components/common/AppTable';
import StatusChip from '../../components/common/StatusChip';
import RiskChip from '../../components/common/RiskChip';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import ExportButton from '../../components/common/ExportButton';
import { useTableFilters } from '../../hooks/useTableFilters';
import { usePagination } from '../../hooks/usePagination';
import { formatDateOnly } from '../../utils/formatDate';
import { RISK_LEVELS, VENDOR_STATUSES, COMPLIANCE_STATUSES } from '../../utils/constants';

export function VendorListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { vendors, loading, error } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const {
    searchTerm,
    filters,
    sortConfig,
    handleSearchChange,
    handleFilterChange,
    handleRequestSort,
    filteredData,
    resetFilters
  } = useTableFilters(vendors, ['id', 'name', 'category', 'country']);

  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    sliceData
  } = usePagination(0, 10);

  const handleRefresh = () => {
    dispatch(fetchVendors());
  };

  if (loading) {
    return <AppLoader message="Scanning global vendor catalogs..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={handleRefresh} />;
  }

  // Define table columns
  const COLUMNS = [
    { id: 'id', label: 'Vendor ID', sortable: true },
    { id: 'name', label: 'Vendor Name', sortable: true },
    { id: 'category', label: 'Category', sortable: true },
    { id: 'country', label: 'Country', sortable: true },
    { id: 'riskLevel', label: 'Risk Rating', sortable: true },
    { id: 'complianceStatus', label: 'Compliance Status', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'lastReviewDate', label: 'Last Reviewed', sortable: true },
    { id: 'actions', label: 'Actions', align: 'center' }
  ];

  const paginatedRows = sliceData(filteredData);

  return (
    <Box>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h1" fontWeight={800} color="text.primary">
            Vendor Governance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Identify, assess, and monitor third-party supplier risk profiles, contracts, and certifications.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Refresh Catalog">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <ExportButton
            data={filteredData}
            headers={['Vendor ID', 'Vendor Name', 'Category', 'Country', 'Risk Rating', 'Compliance Status', 'Status', 'Last Reviewed']}
            keys={['id', 'name', 'category', 'country', 'riskLevel', 'complianceStatus', 'status', 'lastReviewDate']}
            fileName="Global_Vendor_Registry"
          />
        </Box>
      </Box>

      {/* Filter panel row */}
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
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by ID, name, category..."
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
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
            />
          </Grid>

          {/* Risk Level dropdown */}
          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="risk-filter-label">Filter Risk</InputLabel>
              <Select
                labelId="risk-filter-label"
                id="risk-filter"
                value={filters.riskLevel || 'All'}
                label="Filter Risk"
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                sx={{ bgcolor: 'background.paper' }}
              >
                <MenuItem value="All">All Risks</MenuItem>
                {RISK_LEVELS.map((level, idx) => (
                  <MenuItem key={idx} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Compliance dropdown */}
          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="compliance-filter-label">Filter Compliance</InputLabel>
              <Select
                labelId="compliance-filter-label"
                id="compliance-filter"
                value={filters.complianceStatus || 'All'}
                label="Filter Compliance"
                onChange={(e) => handleFilterChange('complianceStatus', e.target.value)}
                sx={{ bgcolor: 'background.paper' }}
              >
                <MenuItem value="All">All Compliance</MenuItem>
                {COMPLIANCE_STATUSES.map((status, idx) => (
                  <MenuItem key={idx} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status dropdown */}
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
                {VENDOR_STATUSES.map((status, idx) => (
                  <MenuItem key={idx} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Clear */}
          <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
            <Button fullWidth variant="outlined" size="small" onClick={resetFilters} sx={{ height: '40px' }}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Vendors Table */}
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
            <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.country}</TableCell>
            <TableCell>
              <RiskChip level={row.riskLevel} />
            </TableCell>
            <TableCell>
              <StatusChip status={row.complianceStatus} />
            </TableCell>
            <TableCell>
              <StatusChip status={row.status} />
            </TableCell>
            <TableCell>{formatDateOnly(row.lastReviewDate)}</TableCell>
            <TableCell align="center">
              <Tooltip title="View Complete Profile & Documents">
                <IconButton onClick={() => navigate(`/vendors/${row.id}`)} color="primary" size="small">
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

export default VendorListPage;
