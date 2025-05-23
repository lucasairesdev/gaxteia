import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Expense } from '../types/Expense';

interface ExpenseChartsProps {
  expenses: Expense[];
}

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
  // Função para agrupar despesas por dia
  const getDailyExpenses = () => {
    const dailyMap = new Map<string, number>();
    
    expenses.forEach((expense) => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      const currentAmount = dailyMap.get(date) || 0;
      dailyMap.set(date, currentAmount + expense.amount);
    });

    // Pegar os últimos 7 dias com despesas
    const sortedDates = Array.from(dailyMap.keys()).sort();
    const last7Days = sortedDates.slice(-7);

    return {
      dates: last7Days,
      values: last7Days.map(date => dailyMap.get(date) || 0)
    };
  };

  // Função para agrupar despesas por mês
  const getMonthlyExpenses = () => {
    const monthlyMap = new Map<string, number>();
    
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const currentAmount = monthlyMap.get(monthKey) || 0;
      monthlyMap.set(monthKey, currentAmount + expense.amount);
    });

    // Pegar os últimos 6 meses
    const sortedMonths = Array.from(monthlyMap.keys()).sort();
    const last6Months = sortedMonths.slice(-6);

    return {
      months: last6Months.map(month => {
        const [year, monthNum] = month.split('-');
        return `${monthNum}/${year}`;
      }),
      values: last6Months.map(month => monthlyMap.get(month) || 0)
    };
  };

  const dailyData = getDailyExpenses();
  const monthlyData = getMonthlyExpenses();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Análise de Gastos
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 300 }}>
          <Typography variant="subtitle1" gutterBottom>
            Gastos dos Últimos 7 Dias
          </Typography>
          <BarChart
            xAxis={[{ 
              data: dailyData.dates,
              scaleType: 'band',
              label: 'Data'
            }]}
            series={[{
              data: dailyData.values,
              label: 'Valor (R$)'
            }]}
            height={300}
          />
        </Paper>

        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 300 }}>
          <Typography variant="subtitle1" gutterBottom>
            Gastos dos Últimos 6 Meses
          </Typography>
          <LineChart
            xAxis={[{ 
              data: monthlyData.months,
              scaleType: 'band',
              label: 'Mês'
            }]}
            series={[{
              data: monthlyData.values,
              label: 'Valor (R$)',
              area: true
            }]}
            height={300}
          />
        </Paper>
      </Box>
    </Box>
  );
}; 