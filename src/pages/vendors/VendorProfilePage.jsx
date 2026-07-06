/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';

// Redux
import { fetchVendorById, clearSelectedVendor } from '../../features/vendors/vendorSlice';

// Components
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import AppCard from '../../components/common/AppCard';
import AppLoader from '../../components/common/AppLoader';
import AppError from '../../components/common/AppError';
import StatusChip from '../../components/common/StatusChip';
import RiskChip from '../../components/common/RiskChip';
import formatCurrency from '../../utils/formatCurrency';
import { formatDateOnly } from '../../utils/formatDate';

export function VendorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedVendor, loading, error } = useSelector((state) => state.vendors);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchVendorById(id));
    return () => {
      dispatch(clearSelectedVendor());
    };
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading || !selectedVendor) {
    return <AppLoader message="Acquiring vendor risk metrics..." />;
  }

  if (error) {
    return <AppError message={error} retryAction={() => dispatch(fetchVendorById(id))} />;
  }

  return (
    <Box>
      {/* Navigation Breadcrumbs */}
      <AppBreadcrumbs links={[{ label: 'Vendors', to: '/vendors' }]} activeLabel={id} />

      {/* Header Profile Title row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/vendors" color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1" fontWeight={800}>
              {selectedVendor.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ID: <strong>{selectedVendor.id}</strong> &bull; {selectedVendor.category} Industry Category
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <StatusChip status={selectedVendor.status} />
          <RiskChip level={selectedVendor.riskLevel} />
        </Box>
      </Box>

      {/* Layout Grid */}
      <Grid container spacing={3}>
        
        {/* Left Side Tab Panels */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper 
            sx={{ 
              borderRadius: '14px', 
              overflow: 'hidden', 
              mb: 3,
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
              <Tab label="Overview Details" sx={{ fontWeight: 700, py: 2 }} />
              <Tab label={`Regulatory Certifications (${selectedVendor.certifications?.length || 0})`} sx={{ fontWeight: 700, py: 2 }} />
              <Tab label="Procurement History" sx={{ fontWeight: 700, py: 2 }} />
              <Tab label="Vendor Risk Audits" sx={{ fontWeight: 700, py: 2 }} />
            </Tabs>

            {/* Tab 1: Overview */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" gutterBottom>Third-Party Capabilities & Background</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2 }}>
                  {selectedVendor.description || 'This vendor is a certified corporate supplier offering specialized services in their field.'}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.disabled" fontWeight={600}>Corporate Registration Address</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {selectedVendor.address || 'Not Provided'}, {selectedVendor.country}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.disabled" fontWeight={600}>Primary Contact Person</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {selectedVendor.contactName || 'Corporate Representative'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.disabled" fontWeight={600}>Registered Phone / Email</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {selectedVendor.phone || 'N/A'} &bull; {selectedVendor.email || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.disabled" fontWeight={600}>Registration Date</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {formatDateOnly(selectedVendor.onboardingDate || '2025-01-10')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 2: Certifications */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" gutterBottom>Compliance Document Verification</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Certified regulatory document audits are checked continuously against expiry dates.
                </Typography>

                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: '12px',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Certification Code/Name</TableCell>
                        <TableCell>Authority</TableCell>
                        <TableCell>Issue Date</TableCell>
                        <TableCell>Expiration Date</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedVendor.certifications?.length > 0 ? (
                        selectedVendor.certifications.map((cert, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontWeight: 600 }}>{cert.name}</TableCell>
                            <TableCell>{cert.authority}</TableCell>
                            <TableCell>{formatDateOnly(cert.issueDate)}</TableCell>
                            <TableCell>{formatDateOnly(cert.expiryDate)}</TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                {cert.status === 'Valid' ? (
                                  <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                                ) : (
                                  <ErrorOutlineIcon color="error" sx={{ fontSize: 16 }} />
                                )}
                                <Typography variant="body2" fontWeight={600} color={cert.status === 'Valid' ? 'success.main' : 'error.main'}>
                                  {cert.status}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            No regulatory documents found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 3: Procurement History */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" gutterBottom>Purchasing & Procurement History</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Active and archival transactions associated with {selectedVendor.name}.
                </Typography>

                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: '12px',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedVendor.procurements?.length > 0 ? (
                        selectedVendor.procurements.map((proc, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{proc.id}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{proc.title}</TableCell>
                            <TableCell>{proc.department}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(proc.amount)}</TableCell>
                            <TableCell align="center">
                              <StatusChip status={proc.status} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            No transaction logs registered for this vendor.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 4: Risk Audits */}
            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" gutterBottom>Vendor Risk Assessment Audits</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Historical record of continuous threat assessments and cyber compliance scoring.
                </Typography>

                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: '12px',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Review Date</TableCell>
                        <TableCell>Assessor User</TableCell>
                        <TableCell>Risk Rating Score</TableCell>
                        <TableCell>Decision / Status</TableCell>
                        <TableCell>Details / Comments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedVendor.riskAudits?.length > 0 ? (
                        selectedVendor.riskAudits.map((audit, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{formatDateOnly(audit.date)}</TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{audit.assessor}</TableCell>
                            <TableCell>
                              <RiskChip level={audit.riskRating} />
                            </TableCell>
                            <TableCell>
                              <StatusChip status={audit.status} />
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {audit.notes}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            No risk assessment milestone audit entries recorded.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side Risk Score Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Risk Scoring Metric Display */}
          <AppCard title="Risk Analysis Profiling" sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                py: 2.5, 
                textAlign: 'center', 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)', 
                borderRadius: '12px', 
                mb: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>THREAT PROFILE INDEX</Typography>
              <Typography variant="h2" fontWeight={800} color={selectedVendor.riskLevel === 'Critical' || selectedVendor.riskLevel === 'High' ? 'error.main' : 'warning.main'} sx={{ fontFamily: '"Outfit", sans-serif' }}>
                {selectedVendor.riskLevel?.toUpperCase() || 'LOW'}
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.disabled" fontWeight={600}>Primary Category</Typography>
                <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>{selectedVendor.category}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.disabled" fontWeight={600}>Operational Compliance</Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>{selectedVendor.complianceStatus}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.disabled" fontWeight={600}>Last Risk Assessment review</Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>{formatDateOnly(selectedVendor.lastReviewDate)}</Typography>
              </Grid>
            </Grid>
          </AppCard>

          {/* Supplier Certification Checklist summary */}
          <AppCard title="Certifications Checklist">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedVendor.certifications?.map((c, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>{c.name}</Typography>
                    <Typography variant="body2" color="text.disabled">{c.authority}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {c.status === 'Valid' ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                    ) : (
                      <ErrorOutlineIcon color="error" sx={{ fontSize: 18 }} />
                    )}
                    <Typography variant="body2" fontWeight={600} color={c.status === 'Valid' ? 'success.main' : 'error.main'}>
                      {c.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </AppCard>
        </Grid>

      </Grid>
    </Box>
  );
}

export default VendorProfilePage;
