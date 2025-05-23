import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Paper,
} from '@mui/material';
import { Expense } from '../types/Expense';

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
];

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
    });
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              select
              required
              fullWidth
              label="Categoria"
              name="category"
              value={formData.category}
              onChange={handleChange}
              sx={{ bgcolor: 'background.paper' }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              sx={{ bgcolor: 'background.paper' }}
            />

            <TextField
              required
              fullWidth
              type="number"
              label="Valor"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{ step: "0.01" }}
              sx={{ bgcolor: 'background.paper' }}
            />

            <TextField
              required
              fullWidth
              type="date"
              label="Data"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: 'background.paper' }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                mt: 2,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Cadastrar
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 