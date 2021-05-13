import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../../firebaseConfig';
import { initUserData } from 'main/fireBaseMethods';

type value = {
  currentUser: any | null;
  signup: (email: string, password: string, fullName: string) => Promise<unknown>;
  signin: (email: string, password: string) => Promise<unknown>;
  signInWithGoogle: () => any;
  signout: () => Promise<void>;
};

const googleProvider = new googleAuthProvider();

const AuthContext = createContext<null | value>(null);
export function useAuth() {
  return useContext(AuthContext);
}

const UserProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = (email: string, password: string, fullName: string) => {
    let promise = new Promise(function (resolve, reject) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((ref) => {
          ref.user?.updateProfile({
            displayName: fullName,
          });
          initUserData({ userId: ref.user?.uid, email: email, displayName: fullName });
          resolve(ref);
        })
        .catch((error) => reject(error));
    });
    return promise;
  };
  const signin = (email: string, password: string) => {
    let promise = new Promise(function (resolve, reject) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((ref) => {
          resolve(ref);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  };
  const signout = () => {
    return auth.signOut();
  };
  const signInWithGoogle = () => {
    let promise = new Promise(function (resolve, reject) {
      auth
        .signInWithPopup(googleProvider)
        .then((ref) => {
          resolve(ref);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  const value = {
    currentUser,
    signup,
    signin,
    signInWithGoogle,
    signout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default UserProvider;
