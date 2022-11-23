import React, { createContext, ReactNode, useContext, useState } from "react";

export const MenuContext = createContext(false);
export const SetMenuContext = createContext(undefined as undefined | ((open?: boolean) => void));

export type AuthProviderProps = {
  children: ReactNode
};

export function useMenu() {
  return useContext(MenuContext);
};
export function useSetMenu() {
  return useContext(SetMenuContext);
};

export const MenuProvider = ({ children }: AuthProviderProps) => {

  const [menu, setmenu] = useState(false);

  const handleSetMenu = (newMenu?: boolean) => {
    setmenu((state) => (newMenu === undefined) ? !state : newMenu)
  }

  return (
    <MenuContext.Provider value={menu} >
      <SetMenuContext.Provider value={handleSetMenu} >
        {children}
      </SetMenuContext.Provider>
    </MenuContext.Provider>
  )
};