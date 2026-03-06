import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { setDoc, doc } from 'firebase/firestore';
import Stripe from 'stripe';

const firebaseConfig = {
  credential: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
};

initializeApp(firebaseConfig);
const db = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { clientId, invoiceData } = req.body;

      if (!clientId || !invoiceData) {
        return res.status(400).json({ error: 'Client ID and invoice data are required.' });
      }

      // Creating a new invoice document in Firestore
      const invoiceRef = doc(db, 'invoices', `${clientId}-${Date.now()}`);
      await setDoc(invoiceRef, { clientId, ...invoiceData });

      // Optionally, create a Stripe invoice here or implement payment integration

      return res.status(201).json({ success: true, message: 'Invoice created successfully.' });
    } catch (err) {
      return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}