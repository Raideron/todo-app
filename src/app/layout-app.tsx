'use client';

import '@/styles/custom.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthWrapper from '@/contexts/auth-context';
import { SoundProvider } from '@/contexts/sound-context';
import { ThemeProvider } from '@/contexts/theme-context';

import { LayoutWithContext } from './layout-with-context';

const queryClient = new QueryClient();

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AuthWrapper>
          <QueryClientProvider client={queryClient}>
            <LayoutWithContext>{children}</LayoutWithContext>
          </QueryClientProvider>
        </AuthWrapper>
      </SoundProvider>
    </ThemeProvider>
  );
}
