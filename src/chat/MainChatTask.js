import { useContext, useState } from "react";
import Navbar from "./navbar";
import Chatbox from "./chatbox";
import NoteBar from "./NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "./EndTaskPopUp";
import MainSearchPage from "../bing/SearchPage";
import InstructionsPopUp from "../questionnaire/InstructionsPopUp";

const MainChatTask = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const taskCtx = useContext(TaskContext);

  const instructionText =
    "Your task is under 'Current Task' on the left. Interact with ChatGPT using 'Type a prompt...' and compile your answer in the note box on the right before submitting.";

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
