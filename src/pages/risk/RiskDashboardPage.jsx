/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Redux
import { fetchRiskStatsAndRegister } from '../../features/risk/riskSlice';

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

export function RiskDashboardPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Redux state selectors
  const { register: riskRegister, summary, categories, loading, error } = useSelector((state) => state.risk);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchRiskStatsAndRegister());
  }, [dispatch]);

  // Table filters hook for risk register
  const {
    searchTerm,
    filters,
    sortConfig,
    handleSearchChange,
    handleFilterChange,
    handleRequestSort,
    filteredData,
    resetFilters
  } = useTableFilters(riskRegister, ['id', 'title', 'category', 'mitigationPlan', 'owner', 'probability']);

  // Table pagination hook
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    sliceData
  } = usePagination(0, 10);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchRiskStatsAndRegister())} />;
  }

  if (loading || !summary) {
    return <AppLoader message="Retrieving threat registers & vulnerability vectors..." />;
  }

  // Column definitions for Risk register
  const COLUMNS = [
    { id: 'id', label: 'Risk ID', sortable: true },
    { id: 'title', label: 'Risk Title / Threat', sortable: true },
    { id: 'category', label: 'Threat Category', sortable: true },
    { id: 'probability', label: 'Likelihood', sortable: true, align: 'center' },
    { id: 'impact', label: 'Impact', sortable: true, align: 'center' },
    { id: 'score', label: 'Severity Index', sortable: true, align: 'center' },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'owner', label: 'Owner', sortable: true },
    { id: 'mitigationPlan', label: 'Mitigation Plan' }
  ];

  const paginatedRisks = sliceData(filteredData);

  // Compute classical 5x5 Heat Map counts
  // Matrix counts (Likelihood 1-5, Impact 1-5)
  const matrixCells = Array(5).fill(0).map(() => Array(5).fill(0));
  riskRegister.forEach((r) => {
    const l = Math.min(Math.max(parseInt(r.probability || r.likelihood || 0) - 1, 0), 4);
    const i = Math.min(Math.max(parseInt(r.impact || 0) - 1, 0), 4);
    matrixCells[l][i] += 1;
  });

  // Helper to determine cell background color of Heat map based on Risk level matrix
  // (Standard ISO 31000 GRC heat grids)
  const getHeatMapBg = (l, i) => {
    const score = (l + 1) * (i + 1);
    if (score >= 15) return '#fee2e2'; // Light Red (Critical/High)
    if (score >= 8) return '#ffedd5';  // Light Orange (Medium)
    return '#f0fdf4';                 // Light Green (Low)
  };

  const getHeatMapBorder = (l, i) => {
    const score = (l + 1) * (i + 1);
    if (score >= 15) return '2px solid #ef4444';
    if (score >= 8) return '2px solid #f97316';
    return '2px solid #22c55e';
  };

  const getHeatMapTextColor = (l, i) => {
    const score = (l + 1) * (i + 1);
    if (score >= 15) return '#991b1b';
    if (score >= 8) return '#9a3412';
    return '#166534';
  };

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const categoryData = (categories || []).map(c => ({ category: c.name, count: c.value, avgScore: 12 }));

  return (
    <Box>
      {/* Page Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h1" fontWeight={800} color="text.primary" sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.04em' }}>
            Enterprise Risk Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Identify, prioritize, and mitigate critical threats and vulnerabilities in compliance with ISO 31000 rules.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ExportButton
            data={filteredData}
            headers={['Risk ID', 'Title', 'Category', 'Likelihood', 'Impact', 'Score', 'Status', 'Owner', 'Mitigation Plan']}
            keys={['id', 'title', 'category', 'likelihood', 'impact', 'score', 'status', 'owner', 'mitigationPlan']}
            fileName="GRC_Risk_Register_Log"
          />
        </Box>
      </Box>

      {/* Tabs Selector */}
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
          <Tab label="Threat Intelligence Dashboard" />
          <Tab label="ISO 31000 Risk Register" />
          <Tab label="5x5 Critical Risk Matrix" />
        </Tabs>

        {/* Tab 1: Dashboard */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* KPI statistics Summary cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>CRITICAL THREATS</Typography>
                  <Typography variant="h3" color="error.main" fontWeight={800} sx={{ mt: 1, fontFamily: '"Outfit", sans-serif' }}>{summary.criticalRisks || 0}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.04)', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>HIGH THREATS</Typography>
                  <Typography variant="h3" color="warning.main" fontWeight={800} sx={{ mt: 1, fontFamily: '"Outfit", sans-serif' }}>{summary.highRisks || 0}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.04)', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>MEDIUM THREATS</Typography>
                  <Typography variant="h3" color="primary.main" fontWeight={800} sx={{ mt: 1, fontFamily: '"Outfit", sans-serif' }}>{summary.mediumRisks || 0}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>MITIGATED THREATS</Typography>
                  <Typography variant="h3" color="success.main" fontWeight={800} sx={{ mt: 1, fontFamily: '"Outfit", sans-serif' }}>{summary.lowRisks || 0}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* Category pie chart */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AppCard title="Risk Distribution by GRC Category">
                  <Box sx={{ height: 280, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="category"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                        <Legend iconSize={10} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </AppCard>
              </Grid>

              {/* Score bar chart */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AppCard title="Aggregated Score per Category (Average)">
                  <Box height={280}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                        <XAxis dataKey="category" tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                        <YAxis domain={[0, 25]} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                        <ChartTooltip 
                          contentStyle={{ 
                            backgroundColor: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '12px'
                          }}
                          labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
                          itemStyle={{ color: theme.palette.text.primary }}
                        />
                        <Bar dataKey="avgScore" fill="#2563eb" radius={[4, 4, 0, 0]} name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </AppCard>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 2: ISO Risk Register */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Filtering tools */}
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
                    placeholder="Search risk registers..."
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

                <Grid size={{ xs: 12, sm: 4, md: 3.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-filter-label">Filter Category</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      value={filters.category || 'All'}
                      label="Filter Category"
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <MenuItem value="All">All Categories</MenuItem>
                      {categoryData.map((cat, idx) => (
                        <MenuItem key={idx} value={cat.category}>{cat.category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-filter-label">Filter Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={filters.status || 'All'}
                      label="Filter Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <MenuItem value="All">All Statuses</MenuItem>
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Monitoring">Monitoring</MenuItem>
                      <MenuItem value="Mitigated">Mitigated</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
                  <Button fullWidth variant="outlined" size="small" onClick={resetFilters} sx={{ height: '40px' }}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Risk register Table */}
            <AppTable
              columns={COLUMNS}
              rows={paginatedRisks}
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
                  <TableCell sx={{ fontWeight: 700, color: 'error.main' }}>{row.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>{row.probability || row.likelihood} / 5</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>{row.impact} / 5</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontWeight: 700,
                        backgroundColor: row.score >= 15 ? 'rgba(239, 68, 68, 0.08)' : row.score >= 8 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        color: row.score >= 15 ? 'error.main' : row.score >= 8 ? 'warning.main' : 'success.main',
                        fontSize: '0.875rem'
                      }}
                    >
                      Score: {row.score}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.mitigationPlan}
                  </TableCell>
                </TableRow>
              )}
            />
          </Box>
        )}

        {/* Tab 3: Classic 5x5 Heat grid */}
        {activeTab === 2 && (
          <Box sx={{ p: 4 }}>
            <Typography variant="h3" gutterBottom>
              ISO 31000 Analytical Heat Grid Mapping
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Grid boxes represent risk likelihood (Y-axis) vs impact severity levels (X-axis). Numbers indicate the quantity of active register items matching the sector.
            </Typography>

            <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              {/* Likelihood Y Labels & Matrix */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '40px repeat(5, 1fr)',
                    gap: 1.5,
                    width: '100%',
                    maxWidth: '650px',
                    margin: '0 auto'
                  }}
                >
                  {/* Empty top-left space */}
                  <Box />
                  {/* Impact Columns Headers */}
                  {['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe'].map((impLabel, idx) => (
                    <Box key={idx} sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Imp {idx + 1}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                        {impLabel}
                      </Typography>
                    </Box>
                  ))}

                  {/* 5 rows, from Likelihood 5 down to 1 */}
                  {[5, 4, 3, 2, 1].map((likelihoodVal, rIdx) => {
                    const realLIdx = likelihoodVal - 1; // 4 to 0
                    const labelsY = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
                    
                    return (
                      <React.Fragment key={rIdx}>
                        {/* Y-axis row labels */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', pr: 1 }}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            L{likelihoodVal}
                          </Typography>
                        </Box>

                        {/* 5 columns of cells */}
                        {[0, 1, 2, 3, 4].map((realIIdx) => {
                          const count = matrixCells[realLIdx][realIIdx];
                          return (
                            <Box
                              key={realIIdx}
                              sx={{
                                aspectRatio: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                p: 1.5,
                                bgcolor: getHeatMapBg(realLIdx, realIIdx),
                                border: getHeatMapBorder(realLIdx, realIIdx),
                                transition: 'transform 0.15s ease-in-out',
                                '&:hover': { transform: 'scale(1.05)' }
                              }}
                            >
                              <Typography
                                variant="h4"
                                fontWeight={800}
                                sx={{ color: getHeatMapTextColor(realLIdx, realIIdx), fontFamily: '"Outfit", sans-serif' }}
                              >
                                {count}
                              </Typography>
                              <Typography variant="body2" sx={{ color: getHeatMapTextColor(realLIdx, realIIdx), fontSize: '0.65rem', fontWeight: 600 }}>
                                {count === 1 ? 'risk' : 'risks'}
                              </Typography>
                            </Box>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </Box>
              </Grid>

               {/* Explanatory Key list on Right panel */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    bgcolor: 'background.paper'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Grid Classification Key</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: '#fee2e2', border: '2px solid #ef4444' }} />
                      <Typography variant="body2" fontWeight={700} color="#991b1b">
                        Critical & High Severity (Score 15-25)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: '#ffedd5', border: '2px solid #f97316' }} />
                      <Typography variant="body2" fontWeight={700} color="#9a3412">
                        Medium Severity (Score 8-12)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: '#f0fdf4', border: '2px solid #22c55e' }} />
                      <Typography variant="body2" fontWeight={700} color="#166534">
                        Low Severity (Score 1-6)
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.5, fontSize: '0.8rem' }}>
                    Scores are calculated by multiplying Likelihood rating (1-5) by Impact severity rating (1-5). Immediate remediation plan rules apply to items in the red critical zones.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default RiskDashboardPage;
