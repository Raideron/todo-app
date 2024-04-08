import { Metadata } from 'next';

import AppLayout from './layout-app';

export const metadata: Metadata = {
  title: 'Todo App',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
