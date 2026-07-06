/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Grid from '@mui/material/Grid';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BusinessIcon from '@mui/icons-material/Business';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PolicyIcon from '@mui/icons-material/Policy';
import KPICard from './KPICard';

export function KPISection({ kpis = {} }) {
  const {
    totalRequests = 0,
    pendingRequests = 0,
    approvedRequests = 0,
    rejectedRequests = 0,
    totalVendors = 0,
    highRiskVendors = 0,
    complianceIssues = 0,
    openAuditFindings = 0
  } = kpis || {};

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="Total Procurement Requests"
          value={totalRequests}
          change="+12%"
          type="positive"
          icon={<RequestQuoteIcon />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="Pending Approvals"
          value={pendingRequests}
          change="-4%"
          type="negative"
          icon={<HourglassEmptyIcon />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="High-Risk Vendors"
          value={highRiskVendors}
          change="+8%"
          type="negative" // In GRC, rising risks are bad, so color is red
          icon={<BusinessIcon />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="Open Compliance Issues"
          value={complianceIssues}
          change="0%"
          type="neutral"
          icon={<WarningAmberIcon />}
        />
      </Grid>
    </Grid>
  );
}

export default KPISection;
