import React, { useState, useRef, useContext } from "react";
import { Timestamp, setDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config";
import TaskContext from "../context/task-context";
import AuthContext from "../context/auth-context";
import { useLocation } from "react-router-dom";

const EditNoteReminder = (props) => {
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext);
  const location = useLocation();

  const handleResubmitClicked = async () => {
    if (authCtx.user.uid) {
      const taskCategory = location.pathname.split("/")[1];
      const customDocID = `${authCtx.user.uid}${taskCategory}`;
      const noteDocumentRef = doc(db, "notes", customDocID);
      const noteObject = {
        noteInHTML: taskCtx.note.noteInHTML,
        serializedContent: taskCtx.note.serializedContent,
        ts: Timestamp.now(),
        resubmitted: true,
      };

      try {
        // Set document with merge, if doesn't exist, it'll create
        await setDoc(
          noteDocumentRef,
          {
            notesArray: arrayUnion(noteObject),
          },
          { merge: true }
        );
        taskCtx.setShowSaveButton(false);
        taskCtx.setShowEditNoteReminder(false);
        taskCtx.setShowPopUp(false);
        console.log("Note saved successfully");
      } catch (error) {
        console.error("Error saving note:", error);
      }
    } else {
      console.log("User ID is not available");
    }
  };

  const handleEditDraftClicked = () => {
    taskCtx.setShowSaveButton(true);
    taskCtx.setShowPopUp(false);
    taskCtx.setShowEndTaskPopUp(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
      <p className="text-black mb-8">
        You need to record your thoughts before typing a new prompt. If you
        choose Edit your draft, remember to click save
      </p>
      <div className="flex space-x-4">
        <button
          className="bg-[#FFFFFF] text-gray-500 px-6 py-2 rounded-lg"
          onClick={handleResubmitClicked}
        >
          Resubmit the same
        </button>
        <button
          className="bg-white text-black px-6 py-2 rounded-lg"
          onClick={handleEditDraftClicked}
        >
          Edit your draft
        </button>
      </div>
    </div>
  );
};

export default EditNoteReminder;
