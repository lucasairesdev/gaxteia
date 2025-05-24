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

export const expenseService = {
  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const expenseWithUser = {
      ...expense,
      userId: user.uid,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseWithUser);
    return {
      ...expenseWithUser,
      id: docRef.id,
    };
  },

  async updateExpense(expense: Expense): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { id, ...expenseData } = expense;
    const expenseRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(expenseRef, expenseData);
  },

  async deleteExpense(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const expenseRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(expenseRef);
  },

  async getAllExpenses(): Promise<Expense[]> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
  },
}; 