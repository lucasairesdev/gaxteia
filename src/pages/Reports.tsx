import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../styles/Reports.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Expense {
  category: string;
  description: string;
  value: number;
  card: string;
  date: string;
}

export function Reports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      const start = `${currentMonth}-01`;
      const end = `${currentMonth}-31`;
      const q = query(
        collection(db, 'InformacoesDeGastos'),
        where('date', '>=', start),
        where('date', '<=', end)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data() as Expense);
      setExpenses(data);
      setLoading(false);
    };
    fetchExpenses();
  }, [currentMonth]);

  const getMonthlyExpenses = () => expenses;
  const getTotalExpenses = () => getMonthlyExpenses().reduce((total, expense) => total + expense.value, 0);
  const getExpensesByCategory = () => {
    const monthlyExpenses = getMonthlyExpenses();
    const categories = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.value;
      return acc;
    }, {} as Record<string, number>);
    return categories;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const monthlyExpenses = getMonthlyExpenses();
    const total = getTotalExpenses();
    const categories = getExpensesByCategory();
    doc.setFontSize(20);
    doc.text('Relatório de Gastos Mensais', 14, 20);
    doc.setFontSize(12);
    doc.text(`Mês: ${currentMonth}`, 14, 30);
    const tableData = monthlyExpenses.map(expense => [
      expense.date,
      expense.category,
      expense.description,
      expense.card,
      `R$ ${expense.value.toFixed(2)}`
    ]);
    (doc as any).autoTable({
      head: [['Data', 'Categoria', 'Descrição', 'Cartão', 'Valor']],
      body: tableData,
      startY: 40,
    });
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.text(`Total: R$ ${total.toFixed(2)}`, 14, finalY + 10);
    doc.text('Gastos por Categoria:', 14, finalY + 20);
    let yOffset = finalY + 30;
    Object.entries(categories).forEach(([category, value]) => {
      doc.text(`${category}: R$ ${value.toFixed(2)}`, 20, yOffset);
      yOffset += 10;
    });
    doc.save(`relatorio-gastos-${currentMonth}.pdf`);
  };

  return (
    <div className="reports-container">
      <h1>Relatório de Gastos</h1>
      <div className="month-selector">
        <label htmlFor="month">Selecione o Mês:</label>
        <input
          type="month"
          id="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
        />
      </div>
      <div className="expenses-summary">
        <h2>Resumo do Mês</h2>
        <p>Total de Gastos: R$ {getTotalExpenses().toFixed(2)}</p>
        <h3>Gastos por Categoria:</h3>
        <div className="categories-breakdown">
          {Object.entries(getExpensesByCategory()).map(([category, value]) => (
            <div key={category} className="category-item">
              <span>{category}:</span>
              <span>R$ {value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="expenses-list">
        <h2>Lista de Gastos</h2>
        {loading ? <p>Carregando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Cartão</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {getMonthlyExpenses().map((expense, index) => (
              <tr key={index}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{expense.card}</td>
                <td>R$ {expense.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      <button onClick={generatePDF} className="download-button">
        Baixar Relatório em PDF
      </button>
    </div>
  );
} 