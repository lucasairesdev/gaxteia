import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Expense, NewExpense } from '../types/Expense';
import { authService } from './authService';

const COLLECTION_NAME = 'despesas';

const checkAuth = () => {
  const user = authService.getCurrentUser();
  if (!user) {
    console.error('Tentativa de acesso sem autenticação');
    throw new Error('Usuário não autenticado');
  }
  console.log('Usuário autenticado:', user.email, 'ID:', user.uid);
  return user;
};

export const expenseService = {
  async addExpense(expense: NewExpense): Promise<Expense> {
    const user = checkAuth();
    console.log('Adicionando despesa para usuário:', user.email);

    const expenseWithUser = {
      ...expense,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseWithUser);
      console.log('Despesa adicionada com sucesso, ID:', docRef.id, 'Dados:', expenseWithUser);
      return {
        ...expenseWithUser,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      throw new Error('Erro ao adicionar despesa');
    }
  },

  async updateExpense(expense: Expense): Promise<void> {
    const user = checkAuth();
    console.log('Atualizando despesa:', expense.id);

    try {
      const expenseRef = doc(db, COLLECTION_NAME, expense.id);
      const { id, userId, createdAt, updatedAt, ...expenseData } = expense;
      
      await updateDoc(expenseRef, {
        ...expenseData,
        updatedAt: new Date().toISOString(),
      });
      console.log('Despesa atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      throw error;
    }
  },

  async deleteExpense(id: string): Promise<void> {
    const user = checkAuth();
    console.log('Excluindo despesa:', id);

    try {
      const expenseRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(expenseRef);
      console.log('Despesa excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      throw error;
    }
  },

  async getAllExpenses(): Promise<Expense[]> {
    const user = checkAuth();
    console.log('Buscando todas as despesas');

    try {
      // Removendo temporariamente o filtro por usuário
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('date', 'desc')
      );
      
      console.log('Query construída:', q);
      const querySnapshot = await getDocs(q);
      console.log('Snapshot obtido, quantidade de docs:', querySnapshot.size);
      
      const expenses = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Dados da despesa:', doc.id, data);
        return {
          id: doc.id,
          ...data,
        } as Expense;
      });

      console.log('Despesas encontradas:', expenses.length, 'Dados completos:', expenses);
      return expenses;
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      throw new Error('Erro ao buscar despesas');
    }
  },
}; 