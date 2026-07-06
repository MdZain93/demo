/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Redux
import { fetchRequests } from '../../features/procurement/procurementSlice';

// Components
import AppTable from '../../components/common/AppTable';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import StatusChip from '../../components/common/StatusChip';
import RiskChip from '../../components/common/RiskChip';
import formatCurrency from '../../utils/formatCurrency';
import { formatDateOnly } from '../../utils/formatDate';

export function ApprovalWorkbenchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { requests, loading, error } = useSelector((state) => state.procurement);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <AppLoader message="Retrieving supervisor approval queues..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchRequests())} />;
  }

  // Filter queues
  const pendingQueue = requests.filter((r) => r.status === 'Submitted' || r.status === 'Pending Approval');
  const approvedQueue = requests.filter((r) => r.status === 'Approved');
  const rejectedQueue = requests.filter((r) => r.status === 'Rejected');
  const escalatedQueue = requests.filter((r) => r.status === 'Escalated' || r.status === 'Send Back');

  let activeQueue = [];
  if (activeTab === 0) activeQueue = pendingQueue;
  else if (activeTab === 1) activeQueue = approvedQueue;
  else if (activeTab === 2) activeQueue = rejectedQueue;
  else if (activeTab === 3) activeQueue = escalatedQueue;

  const COLUMNS = [
    { id: 'id', label: 'Request ID' },
    { id: 'title', label: 'Request Title' },
    { id: 'department', label: 'Department' },
    { id: 'requestedBy', label: 'Submitted By' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'amount', label: 'Value ($ USD)', align: 'right' },
    { id: 'riskLevel', label: 'Risk' },
    { id: 'status', label: 'Status' },
    { id: 'createdDate', label: 'Submission Date' },
    { id: 'actions', label: 'Review', align: 'center' }
  ];

  return (
    <Box>
      {/* Page Title */}
      <Box mb={4}>
        <Typography variant="h1" fontWeight={800} color="text.primary">
          Governance Approval Workbench
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review pending spend requests, check compliance document verifications, evaluate third-party risks, and authorize budgets.
        </Typography>
      </Box>

      {/* Tabs Layout */}
      <Paper 
        sx={{ 
          borderRadius: '14px', 
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          bgcolor: 'background.paper'
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
          <Tab label={`Pending Review (${pendingQueue.length})`} sx={{ fontWeight: 700, py: 2 }} />
          <Tab label={`Authorized (${approvedQueue.length})`} sx={{ fontWeight: 700, py: 2 }} />
          <Tab label={`Rejected (${rejectedQueue.length})`} sx={{ fontWeight: 700, py: 2 }} />
          <Tab label={`Escalated / Info Requests (${escalatedQueue.length})`} sx={{ fontWeight: 700, py: 2 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <AppTable
            columns={COLUMNS}
            rows={activeQueue}
            renderRow={(row, idx) => (
              <TableRow key={row.id || idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{row.id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.requestedBy}</TableCell>
                <TableCell>{row.vendor}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(row.amount)}</TableCell>
                <TableCell>
                  <RiskChip level={row.riskLevel} />
                </TableCell>
                <TableCell>
                  <StatusChip status={row.status} />
                </TableCell>
                <TableCell>{formatDateOnly(row.createdDate)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Open Governance Review Room">
                    <IconButton onClick={() => navigate(`/procurement/${row.id}`)} color="primary" size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default ApprovalWorkbenchPage;
