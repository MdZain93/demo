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
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';

// Redux
import { fetchComplianceData } from '../../features/compliance/complianceSlice';

// Components
import AppCard from '../../components/common/AppCard';
import AppTable from '../../components/common/AppTable';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import StatusChip from '../../components/common/StatusChip';
import RiskChip from '../../components/common/RiskChip';
import ExportButton from '../../components/common/ExportButton';
import { useTableFilters } from '../../hooks/useTableFilters';
import { usePagination } from '../../hooks/usePagination';
import { formatDateOnly } from '../../utils/formatDate';

export function ComplianceDashboardPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Redux selectors
  const { issues, missingDocuments, expiredCertificates, trend, summary, loading, error } = useSelector((state) => state.compliance);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchComplianceData());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNotifyRenewal = (vendorName, docName) => {
    setSnackbarMessage(`Renewal request dispatched to ${vendorName} for ${docName}.`);
    setSnackbarOpen(true);
  };

  const handleDispatchWarning = (vendorName, docType) => {
    setSnackbarMessage(`Regulatory warning dispatched to ${vendorName} regarding missing ${docType}.`);
    setSnackbarOpen(true);
  };

  // Filters hook for active issues log
  const {
    searchTerm: issueSearch,
    filters: issueFilters,
    sortConfig: issueSort,
    handleSearchChange: handleIssueSearch,
    handleFilterChange: handleIssueFilter,
    handleRequestSort: handleIssueSort,
    filteredData: filteredIssues,
    resetFilters: resetIssueFilters
  } = useTableFilters(issues, ['id', 'description', 'area', 'owner']);

  const {
    page: issuePage,
    rowsPerPage: issueRows,
    handleChangePage: handleIssuePage,
    handleChangeRowsPerPage: handleIssueRows,
    sliceData: sliceIssues
  } = usePagination(0, 10);

  // Filters hook for missing documents log
  const {
    searchTerm: docSearch,
    handleSearchChange: handleDocSearch,
    filteredData: filteredDocs
  } = useTableFilters(missingDocuments, ['vendorName', 'documentType']);

  const {
    page: docPage,
    rowsPerPage: docRows,
    handleChangePage: handleDocPage,
    handleChangeRowsPerPage: handleDocRows,
    sliceData: sliceDocs
  } = usePagination(0, 10);

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchComplianceData())} />;
  }

  if (loading || !summary) {
    return <AppLoader message="Acquiring compliance auditing registries..." />;
  }

  // Active Compliance issues columns
  const ISSUE_COLUMNS = [
    { id: 'id', label: 'Issue ID', sortable: true },
    { id: 'description', label: 'Description', sortable: true },
    { id: 'area', label: 'Regulatory Area', sortable: true },
    { id: 'priority', label: 'Priority', sortable: true },
    { id: 'dueDate', label: 'Remediation Due Date', sortable: true },
    { id: 'owner', label: 'Remediation Owner', sortable: true },
    { id: 'status', label: 'Status', sortable: true }
  ];

  // Missing Docs columns
  const DOC_COLUMNS = [
    { id: 'vendorName', label: 'Vendor Name', sortable: true },
    { id: 'documentType', label: 'Missing Declaration Document', sortable: true },
    { id: 'priority', label: 'Regulatory Priority', sortable: true },
    { id: 'status', label: 'Check Status' },
    { id: 'actions', label: 'Request / Actions', align: 'center' }
  ];

  // Expired Certs columns
  const EXPIRED_COLUMNS = [
    { id: 'vendorName', label: 'Vendor Name' },
    { id: 'documentName', label: 'Expired Certificate' },
    { id: 'expiryDate', label: 'Expired Date' },
    { id: 'status', label: 'Auditor Flag' },
    { id: 'actions', label: 'Notify Vendor', align: 'center' }
  ];

  const scoreTrendData = trend || [];

  return (
    <Box>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h1" fontWeight={800} color="text.primary" sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.04em' }}>
            Compliance & Audit Integrity
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continuous auditing of SOX, HIPAA, SOC2 controls, vendor filings, and corrective remediation actions.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ExportButton
            data={issues}
            headers={['Issue ID', 'Description', 'Regulatory Area', 'Priority', 'Due Date', 'Owner', 'Status']}
            keys={['id', 'description', 'area', 'priority', 'dueDate', 'owner', 'status']}
            fileName="GRC_Active_Compliance_Issues_Report"
          />
        </Box>
      </Box>

      {/* Tabs Layout */}
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
          <Tab label="Compliance Scorecard" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label={`Active Issues Log (${issues.length})`} sx={{ fontWeight: 700, py: 2 }} />
          <Tab label={`Missing Documents Checklist (${missingDocuments.length})`} sx={{ fontWeight: 700, py: 2 }} />
          <Tab label={`Expired Certifications (${expiredCertificates.length})`} sx={{ fontWeight: 700, py: 2 }} />
        </Tabs>

        {/* Tab 1: Dashboard Scorecard */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* KPI Dials Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    borderRadius: '12px', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.03)'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>ORGANIZATIONAL COMPLIANCE WEIGHT</Typography>
                  <Typography variant="h2" color="success.main" fontWeight={800} sx={{ mt: 1.5, mb: 1, fontSize: '3rem', letterSpacing: '-0.02em', fontFamily: '"Outfit", sans-serif' }}>
                    {summary.complianceScore || 0}%
                  </Typography>
                  <Box sx={{ width: '100%', maxWidth: '220px', mx: 'auto', mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={summary.complianceScore || 0}
                      sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(16, 185, 129, 0.08)', '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">SOC2, ISO 27001, SOX composite rating</Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>OPEN REMEDIATIONS</Typography>
                  <Typography variant="h3" color="error.main" fontWeight={800} sx={{ mt: 1, fontFamily: '"Outfit", sans-serif' }}>
                    {summary.openViolations || 0} issues
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Subject to active correction projects</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.04)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>PENDING DOCUMENT ACTIONS</Typography>
                  <Typography variant="h3" color="warning.main" fontWeight={800} sx={{ mt: 1, fontFamily: '"Outfit", sans-serif' }}>
                    {summary.missingDocuments + summary.expiredCertificates} items
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Requires supplier notifications</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Score History Graph */}
            <AppCard title="Historical Audit Compliance Score Trend">
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreTrendData}>
                    <defs>
                      <linearGradient id="scoreG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="month" tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                    <YAxis domain={[80, 100]} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                    <ChartTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper, 
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '12px'
                      }}
                      labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
                      itemStyle={{ color: theme.palette.text.primary }}
                      formatter={(value) => `${value}%`} 
                    />
                    <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} name="Compliance Index" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </AppCard>
          </Box>
        )}

        {/* Tab 2: Compliance Issues */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Table search filters */}
            {/* Table search filters */}
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
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search active issues registry..."
                    value={issueSearch}
                    onChange={(e) => handleIssueSearch(e.target.value)}
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

                <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="prio-issue-label">Filter Priority</InputLabel>
                    <Select
                      labelId="prio-issue-label"
                      value={issueFilters.priority || 'All'}
                      label="Filter Priority"
                      onChange={(e) => handleIssueFilter('priority', e.target.value)}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <MenuItem value="All">All Priorities</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-issue-label">Filter Status</InputLabel>
                    <Select
                      labelId="status-issue-label"
                      value={issueFilters.status || 'All'}
                      label="Filter Status"
                      onChange={(e) => handleIssueFilter('status', e.target.value)}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <MenuItem value="All">All Statuses</MenuItem>
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
                  <Button fullWidth variant="outlined" size="small" onClick={resetIssueFilters} sx={{ height: '40px' }}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <AppTable
              columns={ISSUE_COLUMNS}
              rows={sliceIssues(filteredIssues)}
              count={filteredIssues.length}
              page={issuePage}
              rowsPerPage={issueRows}
              onPageChange={handleIssuePage}
              onRowsPerPageChange={handleIssueRows}
              onSort={handleIssueSort}
              sortKey={issueSort.key}
              sortDirection={issueSort.direction}
              renderRow={(row, idx) => (
                <TableRow key={row.id || idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: 'error.main' }}>{row.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.description}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>
                    <RiskChip level={row.priority} />
                  </TableCell>
                  <TableCell>{formatDateOnly(row.dueDate)}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.owner}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                </TableRow>
              )}
            />
          </Box>
        )}

        {/* Tab 3: Missing documents */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
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
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search missing documents by vendor..."
                    value={docSearch}
                    onChange={(e) => handleDocSearch(e.target.value)}
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
              </Grid>
            </Paper>

            <AppTable
              columns={DOC_COLUMNS}
              rows={sliceDocs(filteredDocs)}
              count={filteredDocs.length}
              page={docPage}
              rowsPerPage={docRows}
              onPageChange={handleDocPage}
              onRowsPerPageChange={handleDocRows}
              renderRow={(row, idx) => (
                <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.vendorName}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{row.documentType}</TableCell>
                  <TableCell>
                    <RiskChip level={row.priority} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'error.main' }}>
                      <ErrorOutlineIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" fontWeight={600}>Pending File</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="error" 
                      sx={{ borderRadius: '4px' }}
                      onClick={() => handleDispatchWarning(row.vendorName, row.documentType)}
                    >
                      Dispatch Warning
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            />
          </Box>
        )}

        {/* Tab 4: Expired Certs */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <AppTable
              columns={EXPIRED_COLUMNS}
              rows={expiredCertificates}
              renderRow={(row, idx) => (
                <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.vendorName}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.documentName}</TableCell>
                  <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>{formatDateOnly(row.expiryDate)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'error.main' }}>
                      <ErrorOutlineIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" fontWeight={600}>EXPIRED</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="contained" 
                      size="small" 
                      color="warning" 
                      sx={{ borderRadius: '4px' }}
                      onClick={() => handleNotifyRenewal(row.vendorName, row.documentName)}
                    >
                      Notify Renewal
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            />
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)} sx={{ borderRadius: '8px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ComplianceDashboardPage;
