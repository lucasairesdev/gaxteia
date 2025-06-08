import { useState } from 'react';
import '../styles/Home.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Expense {
  category: string;
  description: string;
  value: number;
  card: string;
  date: string;
  spender: string;
}

export function Home() {
  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [expense, setExpense] = useState<Expense>({
    category: '',
    description: '',
    value: 0,
    card: '',
    date: getTodayDate(),
    spender: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'InformacoesDeGastos'), expense);
      setExpense({
        category: '',
        description: '',
        value: 0,
        card: '',
        date: getTodayDate(),
        spender: ''
      });
      alert('Gasto registrado com sucesso!');
    } catch (error) {
      alert('Erro ao registrar gasto.');
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <h1>Registrar Novo Gasto</h1>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="category">Categoria:</label>
          <select
            id="category"
            value={expense.category}
            onChange={(e) => setExpense({...expense, category: e.target.value})}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="alimentacao">Alimentação</option>
            <option value="transporte">Transporte</option>
            <option value="moradia">Moradia</option>
            <option value="lazer">Lazer</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição:</label>
          <input
            type="text"
            id="description"
            value={expense.description}
            onChange={(e) => setExpense({...expense, description: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="value">Valor (R$):</label>
          <input
            type="number"
            id="value"
            value={expense.value}
            onChange={(e) => setExpense({...expense, value: Number(e.target.value)})}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="card">Cartão Utilizado:</label>
          <select
            id="card"
            value={expense.card}
            onChange={(e) => setExpense({...expense, card: e.target.value})}
            required
          >
            <option value="">Selecione o cartão</option>
            <option value="Caju Lucas">Caju Lucas</option>
            <option value="Caju Valesca">Caju Valesca</option>
            <option value="Inter débito">Inter débito</option>
            <option value="Inter crédito">Inter crédito</option>
            <option value="Itaú débito">Itaú débito</option>
            <option value="Nubank crédito">Nubank crédito</option>
            <option value="Pix">Pix</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="spender">Quem está gastando?</label>
          <select
            id="spender"
            value={expense.spender}
            onChange={(e) => setExpense({...expense, spender: e.target.value})}
            required
          >
            <option value="">Selecione quem está gastando</option>
            <option value="Lucas">Lucas</option>
            <option value="Valesca">Valesca</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Data do Gasto:</label>
          <input
            type="date"
            id="date"
            value={expense.date}
            onChange={(e) => setExpense({...expense, date: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Salvando...' : 'Registrar Gasto'}
        </button>
      </form>
    </div>
  );
} 