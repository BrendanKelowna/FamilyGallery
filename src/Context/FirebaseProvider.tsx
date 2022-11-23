import { FirebaseApp, initializeApp } from "@firebase/app";
import { Auth, getAuth, User, onAuthStateChanged } from "@firebase/auth";
import { Functions, getFunctions } from "@firebase/functions"
import { FirebaseStorage, getStorage } from "@firebase/storage"
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import fbConfig from "../Config/google-services.json"

export const FunctionsContext = createContext(null as Functions | null);
export const AuthContext = createContext(null as Auth | null);
export const UserContext = createContext(null as null | UserWithTokens);
export const AppContext = createContext(null as FirebaseApp | null);
export const StorageContext = createContext(null as FirebaseStorage | null);

export type UserWithTokens = User & {
  admin?: boolean
  dbName?: string
}
export type AuthProviderProps = {
  children: ReactNode
}

export function useFunctions() {
  return useContext(FunctionsContext);
}
export function useAuth() {
  return useContext(AuthContext);
}
export function useUser() {
  return useContext(UserContext);
}
export function useFirebase() {
  return useContext(AppContext);
}
export function useStorage() {
  return useContext(StorageContext)
}

export const FirebaseProvider = ({ children }: AuthProviderProps) => {

  const [user, setuser] = useState(null as null | UserWithTokens);

  const firebaseApp = initializeApp(fbConfig)

  const auth = getAuth()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setuser(user);
      if (user) {
        user.getIdTokenResult()
          .then((tokens) => {
            setuser((user) => {
              return {
                ...user,
                admin: tokens.claims.admin,
                dbName: tokens.claims.dbName,
              } as UserWithTokens
            })
          })
          .catch((error) => console.error(error.message))
      }
    })
  }, []);

  const functions = getFunctions(firebaseApp)

  const storage = getStorage()

  return (
    <AppContext.Provider value={firebaseApp}>
      <AuthContext.Provider value={auth}>
        <UserContext.Provider value={user}>
          <FunctionsContext.Provider value={functions} >
            <StorageContext.Provider value={storage} >
              {children}
            </StorageContext.Provider>
          </FunctionsContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </AppContext.Provider>
  )
};