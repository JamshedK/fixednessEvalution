import { useContext, useEffect, useState } from "react";
import Navbar from "../chat/navbar";
import NoteBar from "../chat/NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "../chat/EndTaskPopUp";
import SearchPage from "./SearchPage";
import AuthContext from "../context/auth-context";
import InstructionsPopUp from "../questionnaire/InstructionsPopUp";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

const MainSearchTask = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  const instructionText =
    "Respond to the 'Current task' on the left, using 'Search the web...' for research. Evaluate each result, compile your answer in the right-side note box, and submit when ready";
  // save the start time
  useEffect(() => {
    const saveStartTime = async () => {
      try {
        const startTime = Timestamp.now();
        const userDocRef = doc(db, "searchTask", authCtx.user.uid);
        await setDoc(userDocRef, { startedTs: startTime }, { merge: true });
        console.log("Start time saved");
      } catch (error) {
        console.error("Error saving start time:", error);
      }
    };

    saveStartTime();
  }, [authCtx.user]);

  return (
    <div className="flex flex-row w-screen">
      <Navbar setShowInstructions={setShowInstructions} />
      <SearchPage />
      <NoteBar />
      {taskCtx.showEndTaskPopUp && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <EndTaskPopUp collectionName="searchTask" />
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

export default MainSearchTask;
