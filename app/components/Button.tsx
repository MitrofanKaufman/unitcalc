// path: app/components/Button.tsx
// Reusable button component with proper TypeScript typing.

import React from 'react';
import '@/styles/button.css';

export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button className="btn" onClick={onClick}>{children}</button>;
}
