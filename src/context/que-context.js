import React, { useState, useEffect, useContext } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import TaskContext from './task-context';

const QueContext = React.createContext({
    formData: null,
});

export const QueContextProvider = (props) => {
    const taskCtx = useContext(TaskContext);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const fetchFormData = async () => {
            if (taskCtx.taskID) {
                try {
                    const formDataRef = doc(collection(db, 'pre_task_questionaire'), taskCtx.taskID);
                    const formDataSnapshot = await getDoc(formDataRef);
                    if (formDataSnapshot.exists()) {
                        const data = formDataSnapshot.data();
                        setFormData(data);
                    } else {
                        setFormData(null);
                    }
                } catch (error) {
                    console.error('Error fetching form data:', error);
                }    
            } else {
                // Task ID is undefined, clear the form data
                setFormData(null);
            }
        };

        fetchFormData();
    }, [taskCtx.taskID]);

    const contextValue = {
        formData: formData,
    };

    return (
        <QueContext.Provider value={contextValue}>
            {props.children}
        </QueContext.Provider>
    );
};

export default QueContext;
