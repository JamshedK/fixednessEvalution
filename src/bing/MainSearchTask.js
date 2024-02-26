import { useContext, useState } from "react";
import Navbar from "../chat/navbar";
import NoteBar from "../chat/NoteBar";
import TaskContext from "../context/task-context";
import EndTaskPopUp from "../chat/EndTaskPopUp";
import SearchPage from "./SearchPage";
const MainSearchTask = () => {
  const taskCtx = useContext(TaskContext);

  return (
    <div className="flex flex-row w-screen">
      <Navbar />
      <SearchPage />
      <NoteBar />
      {taskCtx.showEndTaskPopUp && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <EndTaskPopUp />
        </div>
      )}
    </div>
  );
};

export default MainSearchTask;
