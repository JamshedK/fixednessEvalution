import edit_icon from "../assets/navbar/edit_icon.svg";
import star_filled from "../assets/navbar/star_filled.svg";
import tick_icon from "../assets/navbar/tick_icon.svg";

import { useState, useRef, useContext, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import TaskContext from "../context/task-context";

const Navbar = (props) => {
  const [timeLeft, setTimeLeft] = useState(60 * 20);
  const taskCtx = useContext(TaskContext);

  useEffect(() => {
    const timer =
      timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    taskCtx.setTimeRemaining(timeLeft);
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  const minutes = Math.floor(timeLeft / 60);

  // get the url of the current page
  let task = "";
  let taskDescription = "";
  const currentURL = window.location.pathname;
  if (currentURL.includes(taskCtx.tasks.firstTask)) {
    task = taskCtx.tasks.firstTaskTopic;
    taskDescription = taskCtx.tasks.firstTaskDescription;
  } else {
    task = taskCtx.tasks.secondTaskTopic;
    taskDescription = taskCtx.tasks.secondTaskDescription;
  }

  // get the variable for current task from url /search or /chat
  let currentTask = window.location.pathname.split("/").pop();
  // Capitalize the first letter of the task
  currentTask =
    currentTask.charAt(0).toUpperCase() +
    currentTask.slice(1) +
    " + Answer the Question";

  return (
    <div
      className="bg-[#e3e3e3] w-[30%] h-screen sticky flex top-0 flex-col text-[18px] 
    pb-10 pt-10 justify-between"
    >
      <div>
        <div className="pl-8 text-black font-bold underline mb-2">
          <label className="">Chatbot</label>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
