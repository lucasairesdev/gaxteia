import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Expense } from '../types/Expense';
import { EditExpenseModal } from './EditExpenseModal';

// Definindo os estilos do PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000080',
  },
  totalCard: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#000080',
  },
  totalTitle: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  totalValue: {
    color: '#ffffff',
    fontSize: 20,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    backgroundColor: '#000080',
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 40,
    textAlign: 'center',
  },
  tableHeaderCell: {
    color: '#ffffff',
    flex: 1,
    padding: 5,
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 30,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
});

// Componente do PDF
const ExpensePDF = ({ expenses }: { expenses: Expense[] }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Despesas - GaxteIA</Text>
        
        <View style={styles.totalCard}>
          <Text style={styles.totalTitle}>Total de Despesas</Text>
          <Text style={styles.totalValue}>
            {totalAmount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Data</Text>
            <Text style={styles.tableHeaderCell}>Categoria</Text>
            <Text style={styles.tableHeaderCell}>Descrição</Text>
            <Text style={styles.tableHeaderCell}>Valor</Text>
          </View>

          {expenses.map((expense) => (
            <View key={expense.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {format(new Date(expense.date), 'dd/MM/yyyy')}
              </Text>
              <Text style={styles.tableCell}>{expense.category}</Text>
              <Text style={styles.tableCell}>{expense.description}</Text>
              <Text style={styles.tableCell}>
                {expense.amount.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

interface ExpenseReportProps {
  expenses: Expense[];
  onUpdateExpense: (updatedExpense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseReport: React.FC<ExpenseReportProps> = ({ 
  expenses, 
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      onDeleteExpense(id);
    }
  };

  const fileName = `relatorio-despesas-${format(new Date(), 'dd-MM-yyyy')}.pdf`;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="GaxteIA Logo"
            sx={{
              width: 50,
              height: 50,
              objectFit: 'contain'
            }}
          />
          <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Relatório de Despesas
          </Typography>
        </Box>

        <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de Despesas
            </Typography>
            <Typography variant="h4">
              {totalAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 2 }}>
          {expenses.length > 0 ? (
            <PDFDownloadLink
              document={<ExpensePDF expenses={expenses} />}
              fileName={fileName}
              style={{ textDecoration: 'none' }}
            >
              {({ loading, error }) => 
                loading ? (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    startIcon={<span className="material-icons">hourglass_empty</span>}
                  >
                    Preparando PDF...
                  </Button>
                ) : error ? (
                  <Button
                    variant="contained"
                    color="error"
                    disabled
                    startIcon={<span className="material-icons">error</span>}
                  >
                    Erro ao gerar PDF
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<span className="material-icons">download</span>}
                    sx={{ 
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    Baixar Relatório PDF
                  </Button>
                )
              }
            </PDFDownloadLink>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              startIcon={<span className="material-icons">info</span>}
            >
              Nenhuma despesa cadastrada
            </Button>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>Data</TableCell>
                <TableCell sx={{ color: 'white' }}>Categoria</TableCell>
                <TableCell sx={{ color: 'white' }}>Descrição</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Valor</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell>
                    {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell align="right">
                    {expense.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(expense)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <ModeEditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(expense.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <EditExpenseModal
          open={isEditModalOpen}
          expense={selectedExpense}
          onClose={handleCloseModal}
          onSave={onUpdateExpense}
        />
      </Box>
    </Container>
  );
}; 