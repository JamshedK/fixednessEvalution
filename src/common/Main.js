import { useContext, useState } from "react";
import Navbar from "../chat/navbar";
import Chatbox from "../chat/chatbox";
import NoteBar from "../chat/NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "../chat/EndTaskPopUp";
import MainSearchPage from "../bing/MainSearchPage";

const Main = () => {
  const taskCtx = useContext(TaskContext);

  return (
    <div className="flex flex-row ">
      <Navbar />
      {/* <Chatbox /> */}
      <MainSearchPage />
      <NoteBar />
      {taskCtx.showEndTaskPopUp && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <EndTaskPopUp />
        </div>
      )}
    </div>
  );
};

export default Main;
