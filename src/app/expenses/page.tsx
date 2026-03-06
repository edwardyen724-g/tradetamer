import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../lib/firebase'; // Ensure you have your firebase config in this file
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext to manage user authentication

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!currentUser) return;

      const db = getFirestore(app);
      const expensesCollection = collection(db, 'expenses');

      try {
        const expenseSnapshot = await getDocs(expensesCollection);
        const expenseList = expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExpenses(expenseList);
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
      }
    };

    fetchExpenses();
  }, [currentUser]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Expense Tracking</h1>
      <p className="mb-4">Simplify Your Admin Tasks and Boost Your Trade Business</p>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td className="border p-2">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="border p-2">{expense.category}</td>
              <td className="border p-2">{expense.amount.toFixed(2)}</td>
              <td className="border p-2">{expense.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesPage;