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
import { Expense } from '../types/Expense';

const COLLECTION_NAME = 'despesas';

export const expenseService = {
  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), expense);
    return {
      ...expense,
      id: docRef.id,
    };
  },

  async updateExpense(expense: Expense): Promise<void> {
    const { id, ...expenseData } = expense;
    const expenseRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(expenseRef, expenseData);
  },

  async deleteExpense(id: string): Promise<void> {
    const expenseRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(expenseRef);
  },

  async getAllExpenses(): Promise<Expense[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
  },
}; 