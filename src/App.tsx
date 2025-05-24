import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import { User } from 'firebase/auth';
import { CadastroPage } from './pages/CadastroPage';
import { RelatorioPage } from './pages/RelatorioPage';
import { AuthPage } from './pages/AuthPage';
import { Expense, NewExpense } from './types/Expense';
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
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await expenseService.getAllExpenses();
      console.log('Despesas carregadas:', data);
      setExpenses(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load expenses';
      console.error('Error loading expenses:', error);
      setError(errorMessage);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Efeito para monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      console.log('Estado de autenticação alterado:', currentUser?.email);
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Efeito para carregar despesas quando o usuário mudar
  useEffect(() => {
    if (authChecked) {
      loadExpenses();
    }
  }, [authChecked, loadExpenses]);

  const handleAddExpense = async (newExpense: NewExpense) => {
    try {
      setError(null);
      const expense = await expenseService.addExpense(newExpense);
      console.log('Nova despesa adicionada:', expense);
      await loadExpenses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add expense';
      console.error('Error adding expense:', error);
      setError(errorMessage);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      setError(null);
      await expenseService.updateExpense(updatedExpense);
      await loadExpenses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update expense';
      console.error('Error updating expense:', error);
      setError(errorMessage);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setError(null);
      await expenseService.deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete expense';
      console.error('Error deleting expense:', error);
      setError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.logout();
      setExpenses([]);
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      console.error('Error during logout:', error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!user ? (
          <AuthPage onAuthSuccess={loadExpenses} />
        ) : (
          <>
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

            <Container>
              {error && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              )}
              
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              ) : (
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
              )}
            </Container>
          </>
        )}
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App; 