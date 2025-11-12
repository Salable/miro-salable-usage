import { NextRequest } from 'next/server';
import { miroClientSecret } from '../app/environment';
import { verifyToken } from './verifyToken';
import {State} from "../app/api/entitlements/check/route";

export const withAuth =
  (
    handler: (
      state: State,
      request: NextRequest,
      context: { params: Promise<Record<string, string>> }
    ) => Promise<Response>
  ) =>
  async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    const authHeader =
      request.headers.get('Authorization') ??
      request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const decoded = verifyToken<State>(token, miroClientSecret);
    if (!decoded)
      return new Response(JSON.stringify({ error: 'Unauthorised' }), {
        status: 403,
      });

    return handler(decoded, request, context);
  };