import React, { useState, useEffect } from "react";
import { setDoc, doc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const AuthContext = React.createContext({
  user: {},
  isLoggedIn: false,
  isAdmin: false,
  adminInfo: null,
  isAuthLoading: true,
  login: (user) => {},
  logout: () => {},
  addUserToFirestore: (user) => {},
  updateMTurkId: (mturkId) => {},
  checkAdminStatus: (uid) => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkInitialAuth = async () => {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        setUser(userData);
        // Check admin status when user is loaded from localStorage
        await checkAdminStatus(userData.uid, userData.email);
      }
      setIsAuthLoading(false);
    };
    
    checkInitialAuth();
  }, []);

  const isLoggedIn = !!user;

  const addUserToFirestore = async (user, password) => {
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

  const checkAdminStatus = async (uid, userEmail) => {
    if (!uid && !userEmail) return false;
    try {
      const adminDoc = await getDoc(doc(db, "admin", "account"));
      if (adminDoc.exists()) {
        console.log("User ID for admin check:", uid);
        console.log("User email for admin check:", userEmail);
        const adminData = adminDoc.data();
        console.log("Admin UID from Firestore:", adminData.uid);
        console.log("Admin email from Firestore:", adminData.email);
        
        // Check both UID and email for admin verification
        const isAdminByUid = adminData.uid === uid;
        const isAdminByEmail = adminData.email === userEmail;
        
        if (isAdminByUid || isAdminByEmail) {
          setIsAdmin(true);
          setAdminInfo(adminData);
          console.log("Admin access granted");
          return true;
        } else {
          setIsAdmin(false);
          setAdminInfo(null);
          console.log("Admin access denied");
          return false;
        }
      } else {
        console.log("No admin document found");
        setIsAdmin(false);
        setAdminInfo(null);
        return false;
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setAdminInfo(null);
      return false;
    }
  };

  const login = async (user, password) => {
    setIsAuthLoading(true);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    await addUserToFirestore(user, password); // Add or update the user in Firestore
    await checkAdminStatus(user.uid, user.email); // Check admin status on login
    setIsAuthLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setAdminInfo(null);
    localStorage.removeItem("user");
  };

  const updateMTurkId = async (mturkId, uid) => {
    if (!uid) return;
    await setDoc(doc(db, "users", uid), { mturkId }, { merge: true });
  };

  const contextValue = {
    user: user,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin,
    adminInfo: adminInfo,
    isAuthLoading: isAuthLoading,
    addUserToFirestore,
    updateMTurkId,
    checkAdminStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {" "}
      {props.children}{" "}
    </AuthContext.Provider>
  );
};

export default AuthContext;
