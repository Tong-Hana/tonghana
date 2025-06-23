"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { ReactNode } from "react";
import { getQueryClient } from "./getQueryClient";

type TQProviderProps = {
  children: ReactNode;
};

export const TQProvider = ({ children }: TQProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
