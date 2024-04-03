'use client';

import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import type { AuthProviderInfo } from 'pocketbase';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { usePbAuth } from '@/contexts/auth-context';
import { PbUser, PbUserSchema } from '@/types/user';

import { pb } from '../../pocketbase';

const SignIn: NextPage = () => {
  const { githubSignIn, setUser } = usePbAuth();

  const router = useRouter();

  const storeUserAndRedirect = (user: PbUser) => {
    setUser(user);
    router.replace('/');
  };

  useEffect(() => {
    const f = async () => {
      const localAuthProvider: AuthProviderInfo = JSON.parse(localStorage.getItem('provider') as string);
      const params = new URL(location.href).searchParams;
      const redirectUrl = `${location.origin}/signin`;
      const code = params.get('code');

      // cancel signin logic if not a redirect
      if (!localAuthProvider || !code || localAuthProvider.state !== params.get('state')) {
        return;
      }

      const response = await pb
        .collection('users')
        .authWithOAuth2Code(localAuthProvider.name, code, localAuthProvider.codeVerifier, redirectUrl);
      const _user = await pb.collection('users').getOne(response.record.id);
      const pbUser: PbUser = PbUserSchema.parse(_user);

      // skip profile updation if user already exists or user data from OAuth providers haven't changed
      if (
        pbUser.name &&
        pbUser.avatarUrl &&
        pbUser.name === response.meta?.name &&
        pbUser.avatarUrl === response.meta.avatarUrl
      ) {
        storeUserAndRedirect(pbUser);
      } else {
        const res = await pb.collection('users').update(response.record.id, {
          name: response.meta?.name,
          avatarUrl: response.meta?.avatarUrl,
        });
        const parsedRes = PbUserSchema.parse(res);
        storeUserAndRedirect(parsedRes);
      }
    };

    f();
  }, []);

  return (
    <>
      <Head>
        <title>SignIn page</title>
      </Head>
      <main>
        <div>
          <Button onClick={githubSignIn}>Sign in with GitHub</Button>
        </div>
      </main>
    </>
  );
};

export default SignIn;
