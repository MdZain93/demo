/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/**
 * Reusable AppCard component that wraps Material UI's Card with consistent padding and styling.
 * 
 * Props:
 * - title: string/ReactNode (optional header text)
 * - action: ReactNode (optional top-right element like an export button or switcher)
 * - subheader: string (optional subheader text)
 * - children: ReactNode (body of card)
 * - noPadding: boolean (removes card content padding if true)
 */
export function AppCard({
  title = null,
  action = null,
  subheader = null,
  children,
  noPadding = false,
  noHover = false,
  ...props
}) {
  return (
    <Card 
      {...props}
      sx={{
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: noHover ? 'none' : 'translateY(-2px)',
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 12px 20px -10px rgba(0, 0, 0, 0.5)' 
            : '0 12px 20px -10px rgba(0, 0, 0, 0.1)',
        },
        position: 'relative',
        overflow: 'hidden',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #111827 0%, #0b0f19 100%)' 
          : '#ffffff',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        ...props.sx
      }}
    >
      {title || action || subheader ? (
        <>
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontFamily: '"Outfit", sans-serif',
                    letterSpacing: '-0.01em',
                    fontSize: '1rem'
                  }}
                >
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            subheader={
              typeof subheader === 'string' ? (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    mt: 0.5, 
                    opacity: 0.7,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  {subheader}
                </Typography>
              ) : (
                subheader
              )
            }
            action={action}
            sx={{ px: 3, pt: 2.5, pb: 1 }}
          />
        </>
      ) : null}
      <CardContent sx={noPadding ? { p: 0, '&:last-child': { pb: 0 } } : { p: 3, pt: (title || subheader) ? 0.5 : 3 }}>
        {children}
      </CardContent>
    </Card>
  );
}

export default AppCard;
