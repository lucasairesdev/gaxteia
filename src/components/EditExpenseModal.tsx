import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
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

interface EditExpenseModalProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (updatedExpense: Expense) => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  open,
  expense,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Expense | null>(null);

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'amount' ? Number(value) : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Despesa</DialogTitle>
        <DialogContent>
          <TextField
            select
            required
            fullWidth
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
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
            margin="normal"
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
            margin="normal"
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
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 