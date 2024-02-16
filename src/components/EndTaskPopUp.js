import React, { useState, useRef, useContext } from 'react';
import { Timestamp, setDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase-config';
import TaskContext from '../context/task-context';
import AuthContext from '../context/auth-context';

const EndTaskPopUp = (props) => {
    const taskCtx = useContext(TaskContext);
    const authCtx = useContext(AuthContext)

    const handleYesClicked = () => {
        taskCtx.setShowEndTaskPopUp(false)
    }
    
    return(
        <div className="flex flex-col items-center justify-center bg-[#142838] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
            <p className="text-white mb-8">
            Are you sure that you are ready to submit the final answer? 
            You will no be able to do any further edits after final submission
            </p>
            <div className="flex space-x-4">
                <button 
                    className="bg-[#2F4454] text-white px-6 py-2 rounded-lg"
                    onClick={handleYesClicked}
                >
                    Yes
                </button>
                <button 
                    className="bg-white text-[#142838] px-6 py-2 rounded-lg"
                    onClick={() => taskCtx.setShowEndTaskPopUp(false)}
                >
                    No
                </button>
            </div>
        </div>
    );
}

export default EndTaskPopUp;
