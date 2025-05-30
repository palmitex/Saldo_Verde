import { Inter } from 'next/font/google';

import { AuthProvider } from '../context/AuthContext';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import PageTransition from '../components/loading/PageTransition';

import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Saldo Verde",
  description: "Seu aplicativo de controle financeiro",
  icons: {
    icon: '/Porco-logo.png',
    shortcut: 'Porco-logo.png',
    apple: 'Porco-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Header />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
