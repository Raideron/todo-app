'use client';

import { useRouter } from 'next/navigation';
import type { AuthProviderInfo } from 'pocketbase';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

import { PbUser, PbUserSchema } from '@/types/user';

import { pb } from '../pocketbase';

interface AuthContextType {
  user: PbUser | null;
  githubSignIn: () => void;
  setUser: (user: PbUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState<PbUser | null>(null);
  const [githubAuthProvider, setGithubAuthProvider] = useState<AuthProviderInfo | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const authMethods = await pb
        .collection('users')
        .listAuthMethods()
        .then((methods) => methods)
        .catch((err) => {
          console.error(err);
        });

      if (authMethods) {
        for (const provider of authMethods.authProviders) {
          if (provider.name === 'github') {
            setGithubAuthProvider(provider);
          }
        }
      }
    };

    initAuth();

    if (pb.authStore.model) {
      const pbUser = PbUserSchema.parse(pb.authStore.model);
      setUser(pbUser);
    }
  }, []);

  const githubSignIn = () => {
    signOut();
    localStorage.setItem('provider', JSON.stringify(githubAuthProvider));
    const redirectUrl = `${location.origin}/signin`;
    const url = githubAuthProvider?.authUrl + redirectUrl;

    router.push(url);
  };

  const signOut = () => {
    setUser(null);
    pb.authStore.clear();
  };

  return <AuthContext.Provider value={{ user, githubSignIn, setUser, signOut }}>{children}</AuthContext.Provider>;
};

export const usePbAuth = () => useContext(AuthContext) as AuthContextType;
export default AuthWrapper;
