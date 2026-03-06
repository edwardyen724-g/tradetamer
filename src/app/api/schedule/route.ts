import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { z } from 'zod';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string; email?: string };
}

// Request Schema
const ScheduleRequestSchema = z.object({
  clientId: z.string(),
  jobDetails: z.string(),
  appointmentDate: z.string(),
});

// API Route for scheduling
export async function POST(req: AuthedRequest, res: NextApiResponse) {
  try {
    const body = await req.json();
    const validatedData = ScheduleRequestSchema.parse(body);

    const { clientId, jobDetails, appointmentDate } = validatedData;
    
    const appointmentRef = collection(db, 'appointments');
    await addDoc(appointmentRef, {
      clientId,
      jobDetails,
      appointmentDate,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: 'Appointment scheduled successfully.' });
  } catch (err) {
    return res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
}

export async function GET(req: AuthedRequest, res: NextApiResponse) {
  try {
    const { uid } = req.user || {};
    
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appointmentRef = collection(db, 'appointments');
    const appointmentsQuery = query(appointmentRef, where('clientId', '==', uid));
    const snapshot = await getDocs(appointmentsQuery);

    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(appointments);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}