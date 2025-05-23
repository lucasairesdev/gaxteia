import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  Box,
} from '@mui/material';
import { CadastroPage } from './pages/CadastroPage';
import { RelatorioPage } from './pages/RelatorioPage';
import { AuthPage } from './pages/AuthPage';
import { Expense } from './types/Expense';
import { expenseService } from './services/expenseService';
import { authService } from './services/authService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000080', // Azul marinho
    },
    secondary: {
      main: '#000000', // Preto
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

// Define as rotas disponíveis como constantes para evitar erros de digitação
const ROUTES = {
  CADASTRO: '/',
  RELATORIO: '/relatorio',
} as const;

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setAuthChecked(true);
      if (user) {
        loadExpenses();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    try {
      const expense = await expenseService.addExpense(newExpense);
      setExpenses((prev) => [...prev, expense]);
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await expenseService.updateExpense(updatedExpense);
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setExpenses([]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!authChecked) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography>Carregando...</Typography>
    </Box>;
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthPage onAuthSuccess={() => loadExpenses()} />
        </BrowserRouter>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              GaxteIA
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {user.email}
              </Typography>
              <Button 
                color="inherit" 
                component={Link} 
                to={ROUTES.CADASTRO}
                variant="text"
              >
                Cadastrar Despesa
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to={ROUTES.RELATORIO}
                variant="text"
              >
                Ver Relatório
              </Button>
              <Button 
                color="inherit"
                onClick={handleLogout}
                variant="outlined"
                sx={{ borderColor: 'white' }}
              >
                Sair
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 3 }}>
          <Routes>
            <Route
              path={ROUTES.CADASTRO}
              element={<CadastroPage onSubmit={handleAddExpense} />}
            />
            <Route
              path={ROUTES.RELATORIO}
              element={
                <RelatorioPage 
                  expenses={expenses} 
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              }
            />
            <Route
              path="*"
              element={<Navigate to={ROUTES.CADASTRO} replace />}
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 