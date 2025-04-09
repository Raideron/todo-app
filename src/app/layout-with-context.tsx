'use client';

import { Button, Container, Image, Navbar } from 'react-bootstrap';

import { ActiveTasksToggle } from '@/components/active-tasks-toggle';
import { SoundToggle } from '@/components/sound-toggle';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { usePbAuth } from '@/contexts/auth-context';
import { usePbHealthCheck } from '@/hooks/usePbHealthCheck';

export const LayoutWithContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = usePbAuth();
  const { data: pbHealth } = usePbHealthCheck();

  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Collapse className='justify-content-end'>
            <SoundToggle />
            <ActiveTasksToggle />
            <ThemeSwitcher />
            {auth.user && (
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
            )}
            {!auth.user && pbHealth?.code === 200 && (
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
