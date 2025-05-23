import React from 'react';
import { Box } from '@mui/material';
import logo from '../assets/logo.png';

interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ width = 40, height = 40 }) => {
  return (
    <Box
      component="img"
      src={logo}
      alt="GaxteIA Logo"
      sx={{
        width,
        height,
        objectFit: 'contain'
      }}
    />
  );
}; 