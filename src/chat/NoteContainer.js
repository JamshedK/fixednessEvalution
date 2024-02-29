import { useState, useRef } from "react";
import { useContext } from "react";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import { doc, setDoc, arrayUnion, Timestamp } from "firebase/firestore";
import TaskContext from "../context/task-context";

const NoteContainer = (props) => {
  const textRef = useRef(null);
  const [noteText, setNoteText] = useState(""); // To track the user's input
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false); // To control the save button visibility
  const [savedNote, setSavedNote] = useState(""); // Optional, to store the saved noteText

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
      const noteDocumentRef = doc(db, "notes", authCtx.user.uid);
      const noteObject = {
        noteText: noteText,
        ts: Timestamp.now(), // Use Firestore Timestamp for the current time
        // taskID: props.taskID || 'defaultTaskID' // Assuming taskID is passed as a prop
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
    <div className="flex flex-col bg-[#2F4454] h-fit rounded-xl mx-5 p-3 w-80 text-md">
      <textarea
        ref={textRef}
        className="bg-transparent overflow-hidden focus:outline-none text-white resize-none h-auto"
        placeholder="Type your answer"
        value={noteText} // Control the input with the state
        onChange={handleTextareaChange}
      />
      {(isSaveButtonVisible || taskCtx.showSaveButton) && (
        <div className="flex flex-row justify-around mt-8">
          <button
            className="bg-white px-3 py-1 rounded-sm"
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
