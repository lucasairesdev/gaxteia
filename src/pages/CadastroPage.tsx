import React from 'react';
import { Box, Typography } from '@mui/material';
import { ExpenseForm } from '../components/ExpenseForm';
import { Expense } from '../types/Expense';

interface CadastroPageProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
}

export const CadastroPage: React.FC<CadastroPageProps> = ({ onSubmit }) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Nova Despesa
        </Typography>
      </Box>
      <ExpenseForm onSubmit={onSubmit} />
    </>
  );
}; 