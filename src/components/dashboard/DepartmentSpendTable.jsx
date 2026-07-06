/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import formatCurrency from '../../utils/formatCurrency';

export function DepartmentSpendTable({ spendData = [] }) {
  // Find max spend to calculate percentages for visual progress bars
  const maxSpend = spendData.reduce((max, d) => (d.spend > max ? d.spend : max), 0) || 1;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'text.disabled', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>Department</TableCell>
            <TableCell align="right" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>Expenditure</TableCell>
            <TableCell align="right" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>Allocation Weight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spendData.map((row, idx) => {
            const percentage = Math.round((row.spend / maxSpend) * 100);
            return (
              <TableRow 
                key={idx}
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {row.department}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight={700} sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
                    {formatCurrency(row.spend)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ width: '40%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                    <Box sx={{ width: '100%', maxWidth: '120px' }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: row.color || '#3b82f6'
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ width: '35px', fontWeight: 600, fontSize: '0.75rem' }}>
                      {percentage}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DepartmentSpendTable;
