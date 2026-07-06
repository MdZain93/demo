/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Reusable AppBreadcrumbs component.
 * 
 * Props:
 * - links: Array of objects { label: string, to: string }
 * - activeLabel: string (last element in the path)
 */
export function AppBreadcrumbs({ links = [], activeLabel = '' }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        component={RouterLink}
        underline="hover"
        color="inherit"
        to="/dashboard"
        variant="body2"
      >
        Home
      </Link>
      
      {links.map((link, index) => (
        <Link
          key={index}
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={link.to}
          variant="body2"
        >
          {link.label}
        </Link>
      ))}
      
      {activeLabel && (
        <Typography color="text.primary" variant="body2" fontWeight={500}>
          {activeLabel}
        </Typography>
      )}
    </Breadcrumbs>
  );
}

export default AppBreadcrumbs;
