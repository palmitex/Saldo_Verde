import { Inter } from 'next/font/google';

import { AuthProvider } from '../context/AuthContext';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import PageTransition from '../components/loading/PageTransition';
import { Nunito } from 'next/font/google';

import "./globals.css";

const nunito = Nunito({
  // weight: ['400', '700'],
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Saldo Verde",
  description: "Seu aplicativo de controle financeiro",
  icons: {
    icon: '/Poco-logo.png',
    shortcut: 'Poco-logo.png',
    apple: 'Poco-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={nunito.className} suppressHydrationWarning>
      <head>
      </head>
      <body className={`antialiased`}>
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
