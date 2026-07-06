/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AppCard from '../common/AppCard';

export function KPICard({
  title,
  value,
  change = null,
  icon = null,
  type = 'positive' // positive | negative | neutral
}) {
  const isUp = type === 'positive';
  const isDown = type === 'negative';
  
  const getChangeColor = () => {
    if (isUp) return 'success.main';
    if (isDown) return 'error.main';
    return 'text.secondary';
  };

  return (
    <AppCard
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            fontWeight={600} 
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5, fontSize: '0.7rem' }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            color="text.primary" 
            fontWeight={700}
            sx={{ fontFamily: '"Outfit", sans-serif' }}
          >
            {value.toLocaleString()}
          </Typography>
          
          {change ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 0.5 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: isUp ? 'success.dark' : isDown ? 'error.dark' : 'rgba(148, 163, 184, 0.1)',
                  color: '#ffffff',
                  px: 0.8,
                  py: 0.2,
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {isUp ? (
                  <ArrowUpwardIcon sx={{ fontSize: 12, mr: 0.2 }} />
                ) : isDown ? (
                  <ArrowDownwardIcon sx={{ fontSize: 12, mr: 0.2 }} />
                ) : null}
                {change}
              </Box>
              <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                vs last month
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 1, height: '20px' }} />
          )}
        </Box>
        
        {icon ? (
          <Box
            sx={{
              p: 1.2,
              borderRadius: '10px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 1)',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 20 } })}
          </Box>
        ) : null}
      </Box>
    </AppCard>
  );
}

export default KPICard;
