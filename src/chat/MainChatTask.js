import { useContext, useState, useEffect } from "react";
import Navbar from "./navbar";
import Chatbox from "./chatbox";
import NoteBar from "./NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "./EndTaskPopUp";
import MainSearchPage from "../bing/SearchPage";
import InstructionsPopUp from "../questionnaire/InstructionsPopUp";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";

const MainChatTask = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);

  const instructionText =
    "Your task is under 'Current Task' on the left. Interact with ChatGPT using 'Type a prompt...' and compile your answer in the note box on the right before submitting.";

  useEffect(() => {
    const saveStartTime = async () => {
      try {
        const startTime = Timestamp.now();
        const userDocRef = doc(db, "chatTasks", authCtx.user.uid);
        await setDoc(userDocRef, { startedTs: startTime }, { merge: true });
        console.log("Start time saved");
      } catch (error) {
        console.error("Error saving start time:", error);
      }
    };
    if (authCtx.user) {
      saveStartTime();
    }
  }, [authCtx.user]);

  return (
    <div className="flex flex-row bg-[#e3e3e3] w-screen border-2 border-red-600">
      <Navbar setShowInstructions={setShowInstructions} />
      <Chatbox />
      <NoteBar />
      {taskCtx.showEndTaskPopUp && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <EndTaskPopUp collectionName="chatTasks" />
        </div>
      )}
      {showInstructions && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <InstructionsPopUp
            instructionText={instructionText}
            setShowInstructions={setShowInstructions}
          />
        </div>
      )}
    </div>
  );
};

export default MainChatTask;
