// path: app/pages/Home.tsx
// Main home page component with header and footer.

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function Home() {
  return (
    <>
      <Header />
      <main>Welcome to UnitCalc</main>
      <Footer />
    </>
  );
}
