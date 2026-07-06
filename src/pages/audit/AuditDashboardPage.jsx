/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';

// Redux
import { fetchAuditLogs } from '../../features/audit/auditSlice';

// Components
import AppTable from '../../components/common/AppTable';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import StatusChip from '../../components/common/StatusChip';
import ExportButton from '../../components/common/ExportButton';
import { useTableFilters } from '../../hooks/useTableFilters';
import { usePagination } from '../../hooks/usePagination';
import { formatDate } from '../../utils/formatDate';

export function AuditDashboardPage() {
  const dispatch = useDispatch();

  // Redux selectors
  const { logs, loading, error } = useSelector((state) => state.audit);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  // Use custom filter hook
  const {
    searchTerm,
    filters,
    sortConfig,
    handleSearchChange,
    handleFilterChange,
    handleRequestSort,
    filteredData,
    resetFilters
  } = useTableFilters(logs, ['action', 'description', 'user', 'role', 'ipAddress']);

  // Pagination hook
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    sliceData
  } = usePagination(0, 15);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <AppLoader message="Retrieving tamper-proof audit trails..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchAuditLogs())} />;
  }

  // Filter logs specifically based on Tab selections
  let finalFilteredLogs = [...filteredData];
  if (activeTab === 1) {
    // User Activities: Logins, logouts, etc.
    finalFilteredLogs = filteredData.filter((log) => {
      const action = String(log.action || '').toLowerCase();
      return action.includes('login') || action.includes('logout') || action.includes('session');
    });
  } else if (activeTab === 2) {
    // System Configs: Risk ratings, Settings changes
    finalFilteredLogs = filteredData.filter((log) => {
      const module = String(log.module || '').toLowerCase();
      const action = String(log.action || '').toLowerCase();
      return module === 'system' || action.includes('config') || action.includes('setting');
    });
  }

  const COLUMNS = [
    { id: 'timestamp', label: 'Timestamp', sortable: true },
    { id: 'user', label: 'User Operator', sortable: true },
    { id: 'role', label: 'Authorized Role', sortable: true },
    { id: 'module', label: 'Sector Module', sortable: true },
    { id: 'action', label: 'System Action', sortable: true },
    { id: 'description', label: 'Historical Description', sortable: true },
    { id: 'ipAddress', label: 'IP Location Address' }
  ];

  return (
    <Box>
      {/* Page Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h1" fontWeight={800} color="text.primary">
            Continuous Audit Trail
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tamper-evident, continuous log of user activities, data state mutations, and regulatory policy alterations.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ExportButton
            data={finalFilteredLogs}
            headers={['Timestamp', 'User Operator', 'Authorized Role', 'Sector Module', 'System Action', 'Historical Description', 'IP Address']}
            keys={['timestamp', 'user', 'role', 'module', 'action', 'description', 'ipAddress']}
            fileName="GRC_Audit_Trail_Dump"
          />
        </Box>
      </Box>

      {/* Tabs list */}
      <Paper 
        sx={{ 
          borderRadius: '14px', 
          mb: 4,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          bgcolor: 'background.paper',
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Full Audit Trail Log" />
          <Tab label="Operator Sessions Log" />
          <Tab label="Security Config Alterations" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Table Filters Row */}
          <Paper 
            sx={{ 
              p: 2.5, 
              mb: 4, 
              borderRadius: '12px',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.4)' : '#f9fafb',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none'
            }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              {/* Search input */}
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search audit descriptions, users, IP logs..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
              </Grid>

              {/* Module drop-down filter */}
              <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="mod-filter-label">Filter Module Sector</InputLabel>
                  <Select
                    labelId="mod-filter-label"
                    value={filters.module || 'All'}
                    label="Filter Module Sector"
                    onChange={(e) => handleFilterChange('module', e.target.value)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <MenuItem value="All">All Modules</MenuItem>
                    <MenuItem value="Auth">Authentication</MenuItem>
                    <MenuItem value="Procurement">Procurement</MenuItem>
                    <MenuItem value="Vendors">Vendors Governance</MenuItem>
                    <MenuItem value="Risk">Enterprise Risk</MenuItem>
                    <MenuItem value="Compliance">Compliance Integrity</MenuItem>
                    <MenuItem value="System">System Settings</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Clear filters Button */}
              <Grid size={{ xs: 12, sm: 6, md: 3.5 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" size="small" onClick={resetFilters} sx={{ height: '40px' }}>
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Audit trail Table */}
          <AppTable
            columns={COLUMNS}
            rows={sliceData(finalFilteredLogs)}
            count={finalFilteredLogs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onSort={handleRequestSort}
            sortKey={sortConfig.key}
            sortDirection={sortConfig.direction}
            renderRow={(row, idx) => (
              <TableRow key={row.id || idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: 'text.disabled', whiteSpace: 'nowrap' }}>{formatDate(row.timestamp)}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{row.user}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      display: 'inline-block',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                      color: 'text.secondary'
                    }}
                  >
                    {row.module}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{row.action}</TableCell>
                <TableCell sx={{ color: 'text.secondary', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {row.description}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.ipAddress}</TableCell>
              </TableRow>
            )}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default AuditDashboardPage;
