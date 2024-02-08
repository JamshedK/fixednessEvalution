import React, {useState, useEffect } from 'react'
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

const AuthContext = React.createContext({
    user: {},
    isLoggedIn: false,
    login: (user) => {},
    logout: () => {},
    addUserToFirestore: (user) => {},
})

export const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const isLoggedIn = !!user 

    const addUserToFirestore = async (user) => {
        console.log(user);
        if (!user|| !user.uid) return; 
        const userDoc = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        try {
          await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true });
          console.log('User added to Firestore successfully');
        } catch (error) {
          console.error('Error adding user to Firestore:', error);
        }
      };
    
    

    const login = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        addUserToFirestore(user); // Add or update the user in Firestore
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
        addUserToFirestore
    }

    return <AuthContext.Provider value={contextValue}> {props.children} </AuthContext.Provider>
};

export default AuthContext;