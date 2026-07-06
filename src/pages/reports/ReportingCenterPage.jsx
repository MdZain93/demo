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
import Button from '@mui/material/Button';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DownloadIcon from '@mui/icons-material/Download';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Redux
import { fetchReports } from '../../features/reports/reportSlice';

// Components
import AppTable from '../../components/common/AppTable';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import { formatDateOnly } from '../../utils/formatDate';

export function ReportingCenterPage() {
  const dispatch = useDispatch();

  // Redux state selectors
  const { reports, loading, error } = useSelector((state) => state.reports);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <AppLoader message="Compiling executive analytics reports..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchReports())} />;
  }

  const handleDownload = (fileName) => {
    const blob = new Blob([`Authenticated GRC Report Content: ${fileName}\nGenerated on: ${new Date().toISOString()}\nStatus: Verified`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbarMessage(`Successfully established connection. ${fileName} has been transferred to your downloads.`);
    setSnackbarOpen(true);
  };

  const categories = ['All', 'Procurement', 'Vendors', 'Risk', 'Compliance', 'Audit'];
  const activeCategory = categories[activeTab];

  // Filter reports
  const filteredReports = activeCategory === 'All'
    ? reports
    : reports.filter((rep) => String(rep.category || '').toLowerCase() === activeCategory.toLowerCase());

  const COLUMNS = [
    { id: 'name', label: 'Report Name' },
    { id: 'category', label: 'Category' },
    { id: 'createdDate', label: 'Generation Date' },
    { id: 'format', label: 'Format' },
    { id: 'fileSize', label: 'File Size' },
    { id: 'actions', label: 'Actions', align: 'center' }
  ];

  return (
    <Box>
      {/* Page Title */}
      <Box mb={4}>
        <Typography variant="h1" fontWeight={800} color="text.primary">
          Reporting Center
          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'text.disabled', marginLeft: '12px' }}>Authorized Auditor Console</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse, filter, and extract signed regulatory compliance audits, transaction sheets, and risk reports.
        </Typography>
      </Box>

      {/* Tabs list */}
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
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Generated Reports" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Procurement Sheets" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Third-Party Catalog" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Risk Register Extracts" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Compliance Audit Checklists" sx={{ fontWeight: 700, py: 2 }} />
          <Tab label="Security Systems logs" sx={{ fontWeight: 700, py: 2 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <AppTable
            columns={COLUMNS}
            rows={filteredReports}
            renderRow={(row, idx) => (
              <TableRow key={row.id || idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                  <FilePresentIcon color="primary" />
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {row.name}
                  </Typography>
                </TableCell>
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
                    {row.category}
                  </Box>
                </TableCell>
                <TableCell>{formatDateOnly(row.createdDate)}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.format}</TableCell>
                <TableCell>{row.fileSize}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />} 
                    size="small" 
                    onClick={() => handleDownload(row.name)}
                  >
                    Export Document
                  </Button>
                </TableCell>
              </TableRow>
            )}
          />
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setSnackbarOpen(false)} sx={{ borderRadius: '8px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ReportingCenterPage;
