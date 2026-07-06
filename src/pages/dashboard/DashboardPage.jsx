/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

// Recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Icons
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Redux
import { fetchDashboardStats } from '../../features/dashboard/dashboardSlice';
import { fetchAuditLogs } from '../../features/audit/auditSlice';

// Components
import KPISection from '../../components/dashboard/KPISection';
import ChartCard from '../../components/dashboard/ChartCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import DepartmentSpendTable from '../../components/dashboard/DepartmentSpendTable';
import AppCard from '../../components/common/AppCard';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import ExportButton from '../../components/common/ExportButton';

import { motion } from 'motion/react';

// ... other imports

export function DashboardPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Redux States
  const { kpis, procurementTrend, departmentSpending, riskTrend, complianceTrend, loading, error } =
    useSelector((state) => state.dashboard);
  const { logs } = useSelector((state) => state.audit);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAuditLogs());
  };

  if (error) {
    return <AppError message={error} retryAction={handleRetry} />;
  }

  if (loading || !kpis) {
    return <AppLoader message="Retrieving executive GRC telemetry..." />;
  }

  // Define colors for Pie Chart
  const COLORS = ['#3b82f6', '#818cf8', '#f59e0b', '#ef4444', '#10b981'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {/* Row 1: Page Title & Date filter actions */}
      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 5
        }}
      >
        <Box>
          <Typography 
            variant="h1" 
            fontWeight={800} 
            color="text.primary"
            sx={{ letterSpacing: '-0.04em', mb: 0.5, fontFamily: '"Outfit", sans-serif' }}
          >
            Executive Control Center
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
            Continuous Governance, Risk assessment, Compliance monitoring, and Procurement analytics.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.role === 'Employee' ? (
            <Button
              component={Link}
              to="/procurement/create"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: '12px',
                px: 3,
                fontWeight: 700,
                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
              }}
            >
              New Request
            </Button>
          ) : null}
          
          <ExportButton
            data={departmentSpending}
            headers={['Department', 'Total Spend ($ USD)']}
            keys={['department', 'spend']}
            fileName="GRC_Department_Spend_Report"
          />
        </Box>
      </Box>

      {/* Row 2: KPI Metrics Section */}
      <Box component={motion.div} variants={itemVariants}>
        <KPISection kpis={kpis} />
      </Box>

      {/* Row 3: Procurement Spend & Department spending charts */}
      <Grid container spacing={3} sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartCard
            title="Monthly Procurement Expenditure"
            subheader="Accumulated monthly procurement capital deployment in USD"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={procurementTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                <ChartTooltip
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper, 
                    border: `1px solid ${theme.palette.divider}`, 
                    borderRadius: '12px', 
                    boxShadow: theme.palette.mode === 'dark' ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.03)' 
                  }}
                  labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
                  itemStyle={{ color: theme.palette.text.primary }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Expenditure']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSpend)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard
            title="Departmental Allocation"
            subheader="Proportional spend weights across organizational branches"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentSpending}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="spend"
                  stroke="none"
                >
                  {departmentSpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Row 4: Risk metrics & Compliance trend charts */}
      <Grid container spacing={3} sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Enterprise Severity Risk Accumulation"
            subheader="Risk register tracking critical and high risk scores over time"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                <ChartTooltip
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper, 
                    border: `1px solid ${theme.palette.divider}`, 
                    borderRadius: '12px',
                    boxShadow: theme.palette.mode === 'dark' ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.03)' 
                  }}
                  labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />
                <Legend iconSize={10} wrapperStyle={{ paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="critical"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: theme.palette.background.paper }}
                  activeDot={{ r: 6 }}
                  name="Critical Risks"
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: theme.palette.background.paper }}
                  name="High Risks"
                />
                <Line
                  type="monotone"
                  dataKey="medium"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: theme.palette.background.paper }}
                  name="Medium Risks"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Audit Compliance Score Trend"
            subheader="Unified organizational score out of 100 on regulatory metrics"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrend}>
                <defs>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} dy={10} />
                <YAxis domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                <ChartTooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper, 
                    border: `1px solid ${theme.palette.divider}`, 
                    borderRadius: '12px',
                    boxShadow: theme.palette.mode === 'dark' ? '0 10px 15px -3px rgba(0,0,0,0.5)' : '0 10px 15px -3px rgba(0,0,0,0.03)' 
                  }}
                  labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
                  itemStyle={{ color: theme.palette.text.primary }}
                  formatter={(value) => [`${value}%`, 'Compliance Score']} 
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCompliance)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Row 5: Detailed panels */}
      <Grid container spacing={3} component={motion.div} variants={itemVariants}>
        {/* Recent Activity Timeline panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AppCard
            title="System Audit Stream"
            subheader="Unified timeline of role actions and control modifications"
            sx={{ height: '100%' }}
            action={
              <Button
                component={Link}
                to="/audit"
                size="small"
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ borderRadius: '8px' }}
              >
                Go to Audit Center
              </Button>
            }
          >
            <ActivityTimeline logs={logs} />
          </AppCard>
        </Grid>

        {/* Department Spending breakdown table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AppCard title="Budget Allocation weights" subheader="Active expenditures per sector" sx={{ height: '100%' }}>
            <DepartmentSpendTable spendData={departmentSpending} />
          </AppCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
