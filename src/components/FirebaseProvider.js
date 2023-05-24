import { React, createContext, useState, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseContext = createContext(null);
const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
});

export default function FirebaseProvider({ children }) {
  const [db] = useState(getDatabase(app));

  return <firebaseContext.Provider value={{ db }}>{children}</firebaseContext.Provider>;
}

export const useFirebase = () => useContext(firebaseContext);
