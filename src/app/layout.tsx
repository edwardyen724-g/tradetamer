import './globals.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ subsets: ['latin'] });

export const metadata = {
  title: 'TradeTamer',
  description: 'Automate your paperwork, focus on your trade.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">TradeTamer</h1>
          <p className="text-lg">Simplify Your Admin Tasks and Boost Your Trade Business</p>
        </header>
        <main className="p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          &copy; {new Date().getFullYear()} TradeTamer. All rights reserved.
        </footer>
      </body>
    </html>
  );
}