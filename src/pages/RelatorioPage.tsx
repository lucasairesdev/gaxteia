import React from 'react';
import { Box } from '@mui/material';
import { ExpenseReport } from '../components/ExpenseReport';
import { ExpenseCharts } from '../components/ExpenseCharts';
import { Expense } from '../types/Expense';

interface RelatorioPageProps {
  expenses: Expense[];
  onUpdateExpense: (updatedExpense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export const RelatorioPage: React.FC<RelatorioPageProps> = ({ 
  expenses, 
  onUpdateExpense,
  onDeleteExpense,
}) => {
  return (
    <Box>
      <ExpenseReport 
        expenses={expenses} 
        onUpdateExpense={onUpdateExpense}
        onDeleteExpense={onDeleteExpense}
      />
      <ExpenseCharts expenses={expenses} />
    </Box>
  );
}; 