/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2.5,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.header',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} e-GRCP Platform. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" color="text.disabled" sx={{ cursor: 'pointer', '&:hover': { color: 'text.secondary' } }}>
              Privacy Statement
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ cursor: 'pointer', '&:hover': { color: 'text.secondary' } }}>
              Terms of Use
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ cursor: 'pointer', '&:hover': { color: 'text.secondary' } }}>
              Support Center
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
