import { NextMiddleware } from 'next/server';

import { pb } from './pocketbase';

export const middleware: NextMiddleware = async (request) => {
  try {
    const isLoggedIn = pb.authStore.isValid;

    const url = new URL(request.url);
    const loginPath = '/signin';
    if (!isLoggedIn && url.pathname !== loginPath) {
      url.pathname = loginPath;
      // return Response.redirect(url.href);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
