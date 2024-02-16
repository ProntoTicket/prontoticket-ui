import React from 'react';
import './css/style.css';
import Header from '../components/ui/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
      <Header />
      {children}
    </div>
  );
}
