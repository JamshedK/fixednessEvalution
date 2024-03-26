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
    "Your objective is to respond to the question listed under 'Current task' on the left side of the screen. Utilize the 'Type a prompt...' feature to interact with ChatGPT as needed to answer the question. With each interaction, you'll be asked to evaluate the usefulness of the response. Please be sure to compile and refine your answer to the task in the note box to the right after each interaction. Once you're satisfied with your response, hit 'Submit' to complete the task.";

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
