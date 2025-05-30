import { Inter } from 'next/font/google';

import { AuthProvider } from '../context/AuthContext';
import Header from '../components/header/Header';
import Footer from "../components/footer/Footer";
import PageTransition from '../components/loading/PageTransition';
import { Roboto_Serif } from 'next/font/google';

import "./globals.css";

const robotoSerif = Roboto_Serif({
  weight: ['400', '700'],
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
    icon: '/Porco-logo.png',
    shortcut: 'Porco-logo.png',
    apple: 'Porco-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={robotoSerif.className} suppressHydrationWarning>
      <head>
      </head>
      <body className={` antialiased`}>
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
