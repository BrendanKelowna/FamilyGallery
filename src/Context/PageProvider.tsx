import React, { createContext, ReactNode, useContext, useState } from "react";

export const PageContext = createContext("");
export const SetPageContext = createContext(undefined as undefined | ((newPage: string) => void));

export type AuthProviderProps = {
  children: ReactNode
}

export function usePage() {
  return useContext(PageContext);
}
export function useSetPage() {
  return useContext(SetPageContext);
}

export const PageProvider = ({ children }: AuthProviderProps) => {

  const [page, setpage] = useState("");

  const handleSetPage = (newPage: string) => {
    setpage(newPage)
  }

  return (
    <PageContext.Provider value={page} >
      <SetPageContext.Provider value={handleSetPage} >
        {children}
      </SetPageContext.Provider>
    </PageContext.Provider>
  )
};