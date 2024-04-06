'use client';

import 'bootstrap/dist/css/bootstrap.min.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Metadata } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Container, Image, Navbar } from 'react-bootstrap';

import AuthWrapper, { usePbAuth } from '@/contexts/auth-context';

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: 'Todo App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <AuthWrapper>
          <QueryClientProvider client={queryClient}>
            <LayoutWithContext>{children}</LayoutWithContext>
          </QueryClientProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}

const LayoutWithContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = usePbAuth();

  return (
    <>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <meta title='Todo App' />
      </Head>
      <Navbar>
        <Container>
          <Navbar.Brand>
            <Link href='/'>Home</Link>
          </Navbar.Brand>

          <Navbar.Collapse className='gap-3' />

          <Navbar.Collapse className='justify-content-end'>
            {auth.user ? (
              <>
                <Navbar.Text>Signed in as: {auth.user.name || auth.user.username}</Navbar.Text>
                <Image
                  className='ms-2 me-3'
                  src={auth.user.avatarUrl}
                  roundedCircle
                  width={30}
                  height={30}
                  alt='Avatar'
                />
                <Button onClick={auth.signOut} variant='outline-danger'>
                  Sign out
                </Button>
              </>
            ) : (
              <Navbar.Text>
                <Button onClick={auth.githubSignIn} variant='outline-primary'>
                  Sign in with GitHub
                </Button>
              </Navbar.Text>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>{children}</Container>
    </>
  );
};
