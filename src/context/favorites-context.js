import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './auth-context';
import { auth, db } from '../firebase-config';
import { addDoc, updateDoc, getDocs, collection, query, where} from 'firebase/firestore';
import TaskContext from './task-context';

const FavouritesContext = React.createContext({
    favourites: [],
    saveFavourite: (promptID, text) => {},
    removeFavourite: (promptID) => {},
});

export const FavouritesContextProvider = (props) => {
    const [favourites, setFavourites] = useState([]);
    const authCtx = useContext(AuthContext)
    const taskCtx = useContext(TaskContext)

    // Get all the favourites
    useEffect(() => {
        const fetchFavourites = async () => {
            if(taskCtx.taskID){
                try {
                    const q = query(collection(db, 'favourites'), where('taskID', '==', taskCtx.taskID));
                    const querySnapshot = await getDocs(q);
                    const favouritesData = querySnapshot.docs[0]?.data().favourites
                    setFavourites(favouritesData);
                } catch (error) {
                    console.error('Error fetching favourites:', error);
                }
            }
        };
        fetchFavourites();
    }, [taskCtx.taskID]);

    // TODO: Add a userID as well
    const saveFavourite = async (promptID, text, divKey) => { // Include divKey parameter
        try {
            const favouritesRef = collection(db, 'favourites');
            const querySnapshot = await getDocs(query(favouritesRef, where('taskID', '==', taskCtx.taskID)));
        
            if (!querySnapshot.empty) {
                // Update existing favourites for the matching taskID
                const favouritesDoc = querySnapshot.docs[0];
                const existingFavourites = favouritesDoc.data().favourites || [];
                const updatedFavourites = [...existingFavourites, { promptID, text, divKey }]; // Include divKey in the new item so we can scroll
                await updateDoc(favouritesDoc.ref, { favourites: updatedFavourites });
                setFavourites(updatedFavourites);
            } else {
                // Add a new document for the non-matching taskID
                await addDoc(favouritesRef, {
                    taskID: taskCtx.taskID,
                    favourites: [{ promptID, text, divKey }], // Include divKey in the new item so we can scroll
                });
                setFavourites([{ promptID, text, divKey }]);
            }
            } catch (error) {
            console.error('Error saving favourite:', error);
            }
      };
    
    const removeFavourite = async (promptID) => {
        try {
            const favouritesRef = collection(db, 'favourites');
            const querySnapshot = await getDocs(query(favouritesRef, where('taskID', '==', taskCtx.taskID)));

            if (!querySnapshot.empty) {
                // Update existing favourites for the matching taskID
                const favouritesDoc = querySnapshot.docs[0];
                const existingFavourites = favouritesDoc.data().favourites || [];
                const updatedFavourites = existingFavourites.filter((fav) => fav.promptID !== promptID);
                await updateDoc(favouritesDoc.ref, { favourites: updatedFavourites });
                setFavourites(updatedFavourites);
            } else {
                // Favourites not found for the taskID, nothing to remove
                console.log('Favourites not found for this taskID:', taskCtx.taskID);
            }
        } catch (error) {
            console.error('Error removing favourite:', error);
        }
    };


    const contextValue = {
        favourites: favourites,
        saveFavourite: saveFavourite,
        removeFavourite: removeFavourite,
    };

    return <FavouritesContext.Provider value={contextValue}>{props.children}</FavouritesContext.Provider>;
};

export default FavouritesContext;
