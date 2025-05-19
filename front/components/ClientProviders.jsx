'use client';

import { AuthProvider } from '../context/AuthContext';
import Header from './header/Header';
import Footer from "./footer/Footer";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}