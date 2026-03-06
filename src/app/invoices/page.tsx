import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Invoice } from '@/lib/types';
import { fetchInvoices } from '@/lib/invoiceService';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('You must be logged in to view invoices.');
        setLoading(false);
        return;
      }

      try {
        const fetchedInvoices = await fetchInvoices(user.uid);
        setInvoices(fetchedInvoices);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Invoices</h1>
      <ul className="mt-4">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="border p-4 mb-2">
            <h2 className="font-semibold">{invoice.title}</h2>
            <p>{invoice.description}</p>
            <p className="text-gray-500">Amount: ${invoice.amount}</p>
            <p className="text-gray-500">Due Date: {invoice.dueDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoicesPage;