'use client';

import React, { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

export const SWRConfigProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (resource: string) => {
          const token = await miro.board.getIdToken();
          return fetch(resource, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json());
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

