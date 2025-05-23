import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
} from '@mui/material';
import { authService } from '../services/authService';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="GaxteIA Logo"
              sx={{
                width: 120,
                height: 120,
                objectFit: 'contain',
                mb: 2
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
              GaxteIA
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
              Criar Conta
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />

            <TextField
              required
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              helperText="A senha deve ter pelo menos 6 caracteres"
            />

            <TextField
              required
              fullWidth
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 