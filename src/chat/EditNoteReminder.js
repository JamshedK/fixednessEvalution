import React, { useState, useRef, useContext } from 'react';
import { Timestamp, setDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase-config';
import TaskContext from '../context/task-context';
import AuthContext from '../context/auth-context';

const EditNoteReminder = (props) => {
    const taskCtx = useContext(TaskContext);
    const authCtx = useContext(AuthContext)

    const handleResubmitClicked = async () => {
        if (authCtx.user.uid) {
            const noteDocumentRef = doc(db, "notes", authCtx.user.uid);
            const noteObject = {
                noteText: taskCtx.noteText,
                ts: Timestamp.now(), 
                resubmmited: true,
            };

            try {
                // Set document with merge, if doesn't exist, it'll create
                await setDoc(noteDocumentRef, {
                    notesArray: arrayUnion(noteObject)
                }, { merge: true });
                taskCtx.setShowSaveButton(false)
                taskCtx.setShowEditNoteReminder(false)
                taskCtx.setShowPopUp(false)
                console.log("Note saved successfully");
            } catch (error) {
                console.error("Error saving note:", error);
            }
        } else {
            console.log("User ID is not available");
        }
    }

    const handleEditDraftClicked = () => {
        taskCtx.setShowSaveButton(true);
        taskCtx.setShowPopUp(false);
    }
    
    return(
        <div className="flex flex-col items-center justify-center bg-[#142838] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
            <p className="text-white mb-8">
                You need to record your thoughts before typing a new prompt. 
                If you choose Edit your draft, remember to click save
            </p>
            <div className="flex space-x-4">
                <button 
                    className="bg-[#2F4454] text-white px-6 py-2 rounded-lg"
                    onClick={handleResubmitClicked}>
                    Resubmit the same
                </button>
                <button 
                    className="bg-white text-[#142838] px-6 py-2 rounded-lg"
                    onClick={handleEditDraftClicked}>
                    Edit your draft
                </button>
            </div>
        </div>
    );
}

export default EditNoteReminder;
