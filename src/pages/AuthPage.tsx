import React, { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    onAuthSuccess();
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant={isLogin ? 'contained' : 'outlined'}
          onClick={() => setIsLogin(true)}
          sx={{ mr: 1 }}
        >
          Login
        </Button>
        <Button
          variant={!isLogin ? 'contained' : 'outlined'}
          onClick={() => setIsLogin(false)}
        >
          Criar Conta
        </Button>
      </Box>

      {isLogin ? (
        <LoginForm onSuccess={handleAuthSuccess} />
      ) : (
        <RegisterForm onSuccess={handleAuthSuccess} />
      )}
    </Container>
  );
}; 