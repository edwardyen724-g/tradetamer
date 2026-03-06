import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { Invoice } from '../../../types/invoice'; // Assuming you have a type for Invoice

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS as string)),
  });
}

const db = getFirestore();

interface AuthedRequest extends NextApiRequest {
  uid?: string;
}

const rateLimitMap = new Map<string, { count: number; lastTime: number }>();

const RATE_LIMIT = 100; // Requests allowed per minute
const TIME_FRAME = 60 * 1000; // Time frame in milliseconds

export async function POST(req: AuthedRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const currentTime = Date.now();
  const rateLimitInfo = rateLimitMap.get(ip as string) || { count: 0, lastTime: currentTime };

  if (currentTime - rateLimitInfo.lastTime < TIME_FRAME) {
    if (rateLimitInfo.count >= RATE_LIMIT) {
      return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
    }
    rateLimitInfo.count += 1;
  } else {
    rateLimitInfo.count = 1;
    rateLimitInfo.lastTime = currentTime;
  }
  rateLimitMap.set(ip as string, rateLimitInfo);

  try {
    const invoiceData: Invoice = await req.json();
    const userId = req.uid; // Assuming you have set the user's UID in the request.

    if (!userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const invoiceRef = db.collection('invoices').doc();
    await invoiceRef.set({
      ...invoiceData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ id: invoiceRef.id, message: 'Invoice created successfully.' });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}

export async function GET(req: AuthedRequest, res: NextApiResponse) {
  const userId = req.uid; // Assuming you have set the user's UID in the request.

  if (!userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const invoicesSnapshot = await db.collection('invoices').where('userId', '==', userId).get();
    const invoices: Invoice[] = [];

    invoicesSnapshot.forEach((doc) => {
      invoices.push({ id: doc.id, ...doc.data() } as Invoice);
    });

    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}