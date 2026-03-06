import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'TradeTamer',
    description: 'Automate your paperwork, focus on your trade.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <Navbar />
                <main className="flex flex-col min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}