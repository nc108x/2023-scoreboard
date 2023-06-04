import { React, createContext, useState, useContext, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, runTransaction, ref } from "firebase/database";

const firebaseContext = createContext(null);
const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
});

export default function FirebaseProvider({ children }) {
  const [db] = useState(getDatabase(app));
  const dbRef = useMemo(
    () => ref(db, process.env.REACT_APP_SCOREBOARD_YEAR),
    [db]
  );

  const mutate = (newVal, ref = dbRef) =>
    runTransaction(ref, (oldVal) => {
      if (Object.is(oldVal, newVal)) return oldVal;
      return { ...structuredClone(oldVal), ...newVal };
    });

  return (
    <firebaseContext.Provider value={{ db, dbRef, mutate }}>
      {children}
    </firebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(firebaseContext);
