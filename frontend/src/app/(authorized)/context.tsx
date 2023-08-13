"use client";
import { createContext } from "react";

export const TokenContext = createContext<string | null>(null);

export const TokenProvider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) => {
  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
};
