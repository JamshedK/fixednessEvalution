import { useState, useRef } from "react";
import { useContext } from "react";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import { doc, setDoc, arrayUnion, Timestamp } from "firebase/firestore";
import TaskContext from "../context/task-context";
import { useLocation } from "react-router-dom";

const NoteContainer = (props) => {
  const textRef = useRef(null);
  const [noteText, setNoteText] = useState(""); // To track the user's input
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false); // To control the save button visibility
  const [savedNote, setSavedNote] = useState(""); // Optional, to store the saved noteText
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setNoteText(value);
    taskCtx.setNoteText(value);
    if (value.trim().length > 0) {
      // Show save button when there's input
      setIsSaveButtonVisible(true);
    } else {
      setIsSaveButtonVisible(false); // Hide save button if input is cleared
    }

    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  };

  const handleSave = async () => {
    if (authCtx.user.uid) {
      const taskCategory = location.pathname.split("/")[1];
      console.log("taskCategory", taskCategory);
      const customDocID = `${authCtx.user.uid}${taskCategory}`;
      console.log(customDocID);
      const noteDocumentRef = doc(db, "notes", customDocID);
      const noteObject = {
        noteText: noteText,
        ts: Timestamp.now(), // Use Firestore Timestamp for the current time
      };

      try {
        const userID = authCtx.user.uid;
        // Set document with merge, if doesn't exist, it'll create
        await setDoc(
          noteDocumentRef,
          {
            taskCategory,
            userID,
            notesArray: arrayUnion(noteObject),
          },
          { merge: true }
        );
        setIsSaveButtonVisible(false);
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

  return (
    <div className="flex flex-col bg-[#FFFFFF] h-fit rounded-md mx-5 p-3 w-80 text-sm">
      <textarea
        ref={textRef}
        className="bg-transparent overflow-hidden focus:outline-none text-black resize-none h-auto"
        placeholder="Type your answer in notebox..."
        value={noteText} // Control the input with the state
        onChange={handleTextareaChange}
      />
      {(isSaveButtonVisible || taskCtx.showSaveButton) && (
        <div className="flex flex-row justify-around mt-8">
          <button
            className="bg-[#e3e3e3] px-3 py-1 rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteContainer;
