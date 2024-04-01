'use client';

import 'bootstrap/dist/css/bootstrap.min.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { Container, Navbar } from 'react-bootstrap';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <QueryClientProvider client={queryClient}>
          <Navbar>
            <Container>
              <Navbar.Brand>
                <Link href='/'>Home</Link>
              </Navbar.Brand>
              <Navbar.Collapse className='gap-3'></Navbar.Collapse>
            </Container>
          </Navbar>

          <Container>{children}</Container>
        </QueryClientProvider>
      </body>
    </html>
  );
}
