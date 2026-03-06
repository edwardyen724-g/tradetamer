import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firestore } from 'lib/firebase'; // Assume proper Firebase configuration is set up in lib/firebase
import { useRouter } from 'next/navigation';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SchedulePage: React.FC = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]); // Replace with a proper type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          return;
        }
        const querySnapshot = await firestore.collection('appointments').where('userId', '==', user.uid).get();
        const fetchedAppointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(fetchedAppointments);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>
      {loading && <p>Loading appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {appointments.map(appointment => (
          <li key={appointment.id} className="border p-4 rounded">
            <h2 className="font-semibold">{appointment.title}</h2>
            <p>Date & Time: {new Date(appointment.date).toLocaleString()}</p>
            <p>Client: {appointment.clientName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulePage;