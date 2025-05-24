import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Expense } from '../types/Expense';
import { authService } from './authService';

const COLLECTION_NAME = 'despesas';

const checkAuth = () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');
  return user;
};

export const expenseService = {
  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const user = checkAuth();

    const expenseWithUser = {
      ...expense,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseWithUser);
    return {
      ...expenseWithUser,
      id: docRef.id,
    };
  },

  async updateExpense(expense: Expense): Promise<void> {
    const user = checkAuth();

    const { id, userId, ...expenseData } = expense;
    
    // Verificar se a despesa pertence ao usuário atual
    const expenseRef = doc(db, COLLECTION_NAME, id);
    const expenseDoc = await getDocs(query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      where('__name__', '==', id)
    ));

    if (expenseDoc.empty) {
      throw new Error('Despesa não encontrada ou sem permissão');
    }

    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteExpense(id: string): Promise<void> {
    const user = checkAuth();

    // Verificar se a despesa pertence ao usuário atual
    const expenseDoc = await getDocs(query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      where('__name__', '==', id)
    ));

    if (expenseDoc.empty) {
      throw new Error('Despesa não encontrada ou sem permissão');
    }

    const expenseRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(expenseRef);
  },

  async getAllExpenses(): Promise<Expense[]> {
    const user = checkAuth();

    console.log('Buscando despesas para o usuário:', user.email);

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const expenses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];

    console.log('Despesas encontradas:', expenses.length);
    
    return expenses;
  },
}; 