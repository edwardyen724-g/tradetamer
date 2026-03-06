import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '@/lib/firebase'; // Ensure you have initialized Firebase in this file
import InvoiceList from '@/components/InvoiceList';
import Scheduler from '@/components/Scheduler';
import ExpenseTracker from '@/components/ExpenseTracker';
import ClientCommunication from '@/components/ClientCommunication';
import 'tailwindcss/tailwind.css';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const fetchInvoices = async (userId: string) => {
    const db = getFirestore();
    const invoicesCollection = collection(db, 'invoices');
    
    try {
      const invoiceSnapshot = await getDocs(invoicesCollection);
      const invoiceList = invoiceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvoices(invoiceList);
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchInvoices(currentUser.uid);
      } else {
        setInvoices([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <h2 className="text-xl">Welcome, {user.displayName}</h2>
      <InvoiceList invoices={invoices} />
      <Scheduler />
      <ExpenseTracker />
      <ClientCommunication />
    </div>
  );
};

export default DashboardPage;