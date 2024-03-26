import { useState, useRef } from "react";
import { useContext, useEffect } from "react";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import { doc, setDoc, arrayUnion, Timestamp } from "firebase/firestore";
import TaskContext from "../context/task-context";
import { useLocation } from "react-router-dom";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css"; // Basic styling
import { convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

const NoteContainer = (props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const textRef = useRef(null);
  const [noteText, setNoteText] = useState(""); // To track the user's input
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false); // To control the save button visibility
  const [savedNote, setSavedNote] = useState(""); // Optional, to store the saved noteText
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);

  // This useEffect will monitor any changes to editorState and determine whether to show the save button
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const textLength = contentState.getPlainText("").trim().length;
    setIsSaveButtonVisible(textLength > 0);
  }, [editorState]);

  const handleSave = async () => {
    if (authCtx.user.uid) {
      const taskCategory = location.pathname.split("/")[1];
      console.log("taskCategory", taskCategory);
      const customDocID = `${authCtx.user.uid}${taskCategory}`;
      console.log(customDocID);
      const noteDocumentRef = doc(db, "notes", customDocID);
      // Get the current content
      const contentState = editorState.getCurrentContent();
      // Convert to HTML
      const noteInHTML = stateToHTML(contentState);
      console.log(noteInHTML); // Use or save this HTML as needed
      // Convert to raw JSON so the formatting is saved and we can recreate the content
      const rawContent = convertToRaw(contentState);
      const serializedContent = JSON.stringify(rawContent);

      const noteObject = {
        noteInHTML: noteInHTML,
        serializedContent: serializedContent,
        ts: Timestamp.now(),
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

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div className="flex flex-col  h-fit rounded-md  w-full text-sm items-start mx-5">
      <div className="bg-[#FFFFFF] p-3 w-full rounded-md min-h-8">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
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
      {/* <textarea
        ref={textRef}
        className="bg-transparent overflow-hidden focus:outline-none text-black resize-none h-auto"
        placeholder="Type your answer in notebox..."
        value={noteText} // Control the input with the state
        onChange={handleTextareaChange}
      /> */}
    </div>
  );
};

export default NoteContainer;
