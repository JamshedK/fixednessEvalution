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
    "Your objective is to respond to the question listed under 'Current task' on the left side of the screen. Utilize the 'Search the web...' feature to conduct online research as needed. With each search, you'll be asked to evaluate the usefulness of the results. Please be sure to compile and refine your answer in the note box to the right. Once you're satisfied with your response, hit 'Submit' to complete the task.";

  return (
    <div className="flex flex-row w-screen">
      <Navbar setShowInstructions={setShowInstructions}/>
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
