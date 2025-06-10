import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/Reports.css';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Expense {
  id?: string;
  category: string;
  description: string;
  value: number;
  card: string;
  date: string;
  spender: string;
}

interface MonthlyReport {
  month: string;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  expenses: Expense[];
  createdAt: Timestamp;
}

export function Reports() {
  const getCurrentMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const saveMonthlyReport = async (month: string) => {
    try {
      const monthlyExpenses = expenses;
      const totalExpenses = getTotalExpenses();
      const expensesByCategory = getExpensesByCategory();

      const report: MonthlyReport = {
        month,
        totalExpenses,
        expensesByCategory,
        expenses: monthlyExpenses,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'MonthlyReports'), report);
      console.log('Relatório mensal salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar relatório mensal:', error);
    }
  };

  const checkAndSaveMonthlyReport = async () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Se for o último dia do mês e ainda não salvamos o relatório
    if (today.getDate() === lastDayOfMonth.getDate()) {
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      const previousMonthStr = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;
      
      // Verificar se já existe um relatório para o mês anterior
      const q = query(
        collection(db, 'MonthlyReports'),
        where('month', '==', previousMonthStr)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await saveMonthlyReport(previousMonthStr);
        // Limpar os gastos do mês anterior
        await clearPreviousMonthExpenses(previousMonthStr);
      }
    }
  };

  const clearPreviousMonthExpenses = async (month: string) => {
    try {
      const start = `${month}-01`;
      const end = `${month}-31`;
      const q = query(
        collection(db, 'InformacoesDeGastos'),
        where('date', '>=', start),
        where('date', '<=', end)
      );
      const querySnapshot = await getDocs(q);
      
      // Excluir cada documento do mês anterior
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log('Gastos do mês anterior foram limpos com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar gastos do mês anterior:', error);
    }
  };

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
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Expense));
      setExpenses(data);
      setLoading(false);
    };
    fetchExpenses();
    checkAndSaveMonthlyReport();
  }, [currentMonth]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      try {
        await deleteDoc(doc(db, 'InformacoesDeGastos', expenseId));
        setExpenses(expenses.filter(expense => expense.id !== expenseId));
        alert('Gasto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir gasto.');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingExpense?.id) return;

    try {
      const expenseRef = doc(db, 'InformacoesDeGastos', editingExpense.id);
      await updateDoc(expenseRef, {
        category: editingExpense.category,
        description: editingExpense.description,
        value: editingExpense.value,
        card: editingExpense.card,
        date: editingExpense.date,
        spender: editingExpense.spender
      });

      setExpenses(expenses.map(expense => 
        expense.id === editingExpense.id ? editingExpense : expense
      ));
      setShowEditModal(false);
      setEditingExpense(null);
      alert('Gasto atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar gasto.');
    }
  };

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
    try {
      const doc = new jsPDF();
      const monthlyExpenses = getMonthlyExpenses();
      const total = getTotalExpenses();
      const categories = getExpensesByCategory();

      // Configuração do cabeçalho
      doc.setFontSize(20);
      doc.text('Relatório de Gastos Mensais', 14, 20);
      doc.setFontSize(12);
      doc.text(`Mês: ${currentMonth}`, 14, 30);

      // Preparação dos dados da tabela
      const tableData = monthlyExpenses.map(expense => [
        expense.date,
        expense.category,
        expense.description,
        expense.card,
        expense.spender,
        `R$ ${expense.value.toFixed(2)}`
      ]);

      // Configuração da tabela
      autoTable(doc, {
        head: [['Data', 'Categoria', 'Descrição', 'Cartão', 'Quem Gastou', 'Valor']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [10, 35, 66],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
        },
      });

      // Adicionando o total e gastos por categoria
      const finalY = (doc as any).lastAutoTable.finalY || 40;
      doc.setFontSize(12);
      doc.text(`Total: R$ ${total.toFixed(2)}`, 14, finalY + 10);
      doc.text('Gastos por Categoria:', 14, finalY + 20);

      let yOffset = finalY + 30;
      Object.entries(categories).forEach(([category, value]) => {
        doc.text(`${category}: R$ ${value.toFixed(2)}`, 20, yOffset);
        yOffset += 10;
      });

      // Salvando o PDF
      doc.save(`relatorio-gastos-${currentMonth}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      const errorMessage = error instanceof Error 
        ? `Código do erro: ${error.name}\nDescrição: ${error.message}`
        : 'Erro desconhecido ao gerar o PDF';
      alert(`Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.\n\n${errorMessage}`);
    }
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
              <th>Quem Gastou</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {getMonthlyExpenses().map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{expense.card}</td>
                <td>{expense.spender}</td>
                <td>R$ {expense.value.toFixed(2)}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => expense.id && handleDelete(expense.id)}
                    className="delete-button"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      <button onClick={generatePDF} className="download-button">
        Baixar Relatório em PDF
      </button>

      {showEditModal && editingExpense && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Gasto</h2>
            <div className="form-group">
              <label htmlFor="edit-category">Categoria:</label>
              <select
                id="edit-category"
                value={editingExpense.category}
                onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
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
              <label htmlFor="edit-description">Descrição:</label>
              <input
                type="text"
                id="edit-description"
                value={editingExpense.description}
                onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-value">Valor (R$):</label>
              <input
                type="number"
                id="edit-value"
                value={editingExpense.value}
                onChange={(e) => setEditingExpense({...editingExpense, value: Number(e.target.value)})}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-card">Cartão Utilizado:</label>
              <select
                id="edit-card"
                value={editingExpense.card}
                onChange={(e) => setEditingExpense({...editingExpense, card: e.target.value})}
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
              <label htmlFor="edit-spender">Quem está gastando?</label>
              <select
                id="edit-spender"
                value={editingExpense.spender}
                onChange={(e) => setEditingExpense({...editingExpense, spender: e.target.value})}
                required
              >
                <option value="">Selecione quem está gastando</option>
                <option value="Lucas">Lucas</option>
                <option value="Valesca">Valesca</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-date">Data do Gasto:</label>
              <input
                type="date"
                id="edit-date"
                value={editingExpense.date}
                onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                required
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleSaveEdit} className="save-button">
                Salvar
              </button>
              <button onClick={() => setShowEditModal(false)} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 