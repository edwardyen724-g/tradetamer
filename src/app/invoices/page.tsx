import React from 'react';
import { useEffect, useState } from 'react';
import { getInvoices } from '@/lib/invoiceService'; // A hypothetical service to fetch invoices
import { Invoice } from '@/types/invoice'; // Assuming you have a type definition for Invoice
import { auth } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const fetchedInvoices = await getInvoices(currentUser.uid);
          setInvoices(fetchedInvoices);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your invoices.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Invoices</h1>
      {error && <div className="text-red-500">{error}</div>}
      {invoices.length === 0 ? (
        <div>No invoices found.</div>
      ) : (
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id} className="border-b py-2">
              <div>
                <strong>Invoice ID:</strong> {invoice.id}
              </div>
              <div>
                <strong>Amount:</strong> ${invoice.amount.toFixed(2)}
              </div>
              <div>
                <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvoicesPage;