import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { onSnapshot, collection, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { Expense } from '../../types/expense';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!auth.currentUser) return;

      const expensesCollection = collection(firestore, `users/${auth.currentUser.uid}/expenses`);
      const unsubscribe = onSnapshot(expensesCollection, (snapshot) => {
        const fetchedExpenses: Expense[] = [];
        snapshot.forEach((doc) => fetchedExpenses.push({ id: doc.id, ...doc.data() } as Expense));
        setExpenses(fetchedExpenses);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchExpenses();
  }, [auth.currentUser]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, `users/${auth.currentUser?.uid}/expenses`, id));
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracking</h1>
      <table className="min-w-full table-auto">
        {/* ... rest of your JSX */}
      </table>
    </div>
  );
};

export default ExpensesPage;