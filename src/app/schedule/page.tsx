import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '../../lib/firebase'; // Adjust path based on your structure
import { collection, getDocs } from 'firebase/firestore';

const SchedulePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadAppointments(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const loadAppointments = async (userId: string) => {
    try {
      const appointmentsCollection = collection(firestore, `users/${userId}/appointments`);
      const appointmentsSnapshot = await getDocs(appointmentsCollection);
      const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(appointmentsList);
    } catch (err) {
      console.error('Error loading appointments:', err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Schedule Your Appointments</h1>
      {user ? (
        <div>
          <h2 className="text-xl mt-4">Your Appointments</h2>
          <ul className="mt-2">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="mb-2 border p-2 rounded shadow">
                <span>{appointment.date} - {appointment.clientName}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Please log in to view your appointments.</p>
      )}
    </div>
  );
};

export default SchedulePage;