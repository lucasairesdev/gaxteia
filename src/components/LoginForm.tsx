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

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(email, password);
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
              Login
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 