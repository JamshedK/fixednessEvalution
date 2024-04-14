import { useContext, useState } from "react";
import Navbar from "../chat/navbar";
import NoteBar from "../chat/NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "../chat/EndTaskPopUp";
import SearchPage from "./SearchPage";
import InstructionsPopUp from "../questionnaire/InstructionsPopUp";

const MainSearchTask = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const taskCtx = useContext(TaskContext);
  const instructionText =
    "Respond to the 'Current task' on the left, using 'Search the web...' for research. Evaluate each result, compile your answer in the right-side note box, and submit when ready";
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
