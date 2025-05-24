export interface Expense {
  id: string;
  userId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewExpense = Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; 