import { useState, useRef, useContext } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";

import NoteContainer from "./NoteContainer";
import TaskContext from "../context/task-context";
import { useLocation } from "react-router-dom";

const NoteBar = (props) => {
  const taskCtx = useContext(TaskContext);
  const location = useLocation();

  const handleEndTask = async () => {
    const timeRemainingInMinutes = taskCtx.timeRemaining / 60;
    const currentPath = location.pathname;
    var alert_message;
    if (currentPath === "/chat") {
      alert_message =
        "You can end the task either before the time runs out or after 4 interactions with the ChatGPT.";
    } else {
      alert_message =
        "You can end the task either before the time runs out or after 4 interactions with the search engine.";
    }
    if (timeRemainingInMinutes < 1 || taskCtx.queryCount >= 4) {
      taskCtx.setShowEndTaskPopUp(true);
    } else {
      console.log("timeRemainingInMinutes", timeRemainingInMinutes);
      console.log("taskCtx.queryCount", taskCtx.queryCount);
      alert(alert_message);
      return;
    }
  };

  return (
    <div className="bg-[#e3e3e3] w-[50%] h-screen sticky flex top-0 pl-1 flex-col text-[18px] pb-10 pt-10 justify-between items-center overflow-y-auto">
      <div className="flex flex-col space-y-10">
        <div className="bg-[#FFFFFF] h-fit rounded-md mx-5 px-4 py-2 text-[16px] text-black">
          <label className="">
            Please add your answer to the task below. You can always click and
            edit it before final submission
          </label>
        </div>
        <div>
          <NoteContainer />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="bg-[#FFFFFF] text-black px-6 py-2 rounded-lg w-fit mt-4"
          onClick={handleEndTask}
        >
          Submit
        </button>
        <label className="text-[12px] italic mt-2">
          Please submit your response ONLY when you are ready to complete/exit
          the current task. You can edit and save your response at any time
          before the completion.
        </label>
      </div>
    </div>
  );
};

export default NoteBar;
