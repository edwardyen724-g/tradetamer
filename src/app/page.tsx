import Image from 'next/image';
import { useEffect } from 'react';
import { auth } from '../lib/firebase'; // Assumed path for firebase client initialization
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user);
      } else {
        console.log('No user is logged in.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Image
        src="/logo.svg" // Add your logo path here
        alt="TradeTamer Logo"
        width={300}
        height={100}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Simplify Your Admin Tasks and Boost Your Trade Business
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Automate your paperwork, focus on your trade.
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">MVP Features</h2>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Invoice generation with customizable templates tailored for tradespeople</li>
          <li>Automated scheduling reminders for jobs and client appointments</li>
          <li>Expense tracking with simple categorization and report generation</li>
          <li>Client communication automation via email templates for quotes and follow-ups</li>
          <li>Payment integration with Stripe for seamless billing and collections</li>
        </ul>
      </div>
      <div className="mt-8">
        <a
          href="/get-started"
          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}