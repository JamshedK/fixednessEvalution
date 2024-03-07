import { useContext, useState } from "react";
import Navbar from "./navbar";
import Chatbox from "./chatbox";
import NoteBar from "./NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "./EndTaskPopUp";
import MainSearchPage from "../bing/SearchPage";

const MainChatTask = () => {
  const taskCtx = useContext(TaskContext);

  return (
    <div className="flex flex-row ">
      <Navbar />
      <Chatbox />
      {/* <MainSearchPage /> */}
      <NoteBar />
      {taskCtx.showEndTaskPopUp && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <EndTaskPopUp collectionName="chatTasks" />
        </div>
      )}
    </div>
  );
};

export default MainChatTask;
