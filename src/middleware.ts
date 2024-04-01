import { NextApiRequest, NextApiResponse } from 'next';
import { NextMiddleware, NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

import { POCKET_BASE_URL } from '@/constants/pocketbase';

export const middleware: NextMiddleware = async (request) => {
  try {
    const pb = new PocketBase(POCKET_BASE_URL);
    const isLoggedIn = pb.authStore.isValid;

    const url = new URL(request.url);
    const loginPath = '/login';
    if (!isLoggedIn && url.pathname !== loginPath) {
      url.pathname = loginPath;
      return Response.redirect(url.href);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
