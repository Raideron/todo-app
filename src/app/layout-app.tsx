'use client';

import 'bootstrap/dist/css/bootstrap.min.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthWrapper from '@/contexts/auth-context';

import { LayoutWithContext } from './layout-with-context';

const queryClient = new QueryClient();

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
      <QueryClientProvider client={queryClient}>
        <LayoutWithContext>{children}</LayoutWithContext>
      </QueryClientProvider>
    </AuthWrapper>
  );
}