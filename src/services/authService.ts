import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app } from '../config/firebase';

const auth = getAuth(app);

export const authService = {
  // Registrar novo usuário
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  },

  // Login de usuário
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  },

  // Observar mudanças no estado de autenticação
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Obter usuário atual
  getCurrentUser() {
    return auth.currentUser;
  },

  // Tratamento de erros de autenticação
  handleAuthError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('Este email já está sendo usado');
      case 'auth/invalid-email':
        return new Error('Email inválido');
      case 'auth/operation-not-allowed':
        return new Error('Operação não permitida');
      case 'auth/weak-password':
        return new Error('Senha muito fraca');
      case 'auth/user-disabled':
        return new Error('Usuário desabilitado');
      case 'auth/user-not-found':
        return new Error('Usuário não encontrado');
      case 'auth/wrong-password':
        return new Error('Senha incorreta');
      default:
        return new Error('Ocorreu um erro na autenticação');
    }
  }
}; 