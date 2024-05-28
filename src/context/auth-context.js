import React, { useState, useEffect } from "react";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config";

const AuthContext = React.createContext({
  user: {},
  isLoggedIn: false,
  login: (user) => {},
  logout: () => {},
  addUserToFirestore: (user) => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const isLoggedIn = !!user;

  const addUserToFirestore = async (user, password) => {
    console.log(user);
    if (!user || !user.uid) return;
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      creationTs: Timestamp.now(),
      password: password,
    };
    try {
      await setDoc(doc(db, "users", user.uid), userDoc, { merge: true });
      console.log("User added to Firestore successfully");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  };

  const login = async (user, password) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    await addUserToFirestore(user, password); // Add or update the user in Firestore
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const contextValue = {
    user: user,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    addUserToFirestore,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {" "}
      {props.children}{" "}
    </AuthContext.Provider>
  );
};

export default AuthContext;
