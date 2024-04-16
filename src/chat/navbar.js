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
  const [timeLeft, setTimeLeft] = useState(60 * 12); // For a 5-minute countdown
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

  return (
    <div
      className="bg-[#e3e3e3] w-[34%] h-screen sticky flex top-0 flex-col text-[18px] 
    pb-10 pt-10 justify-between"
    >
      <div>
        <div className="pl-8 text-black font-bold underline mb-2">
          <label className="">Current task</label>
        </div>
        <div className="bg-[#FFFFFF] h-fit rounded-xl mx-5 px-4 py-4 w-fit text-md lg:text-[14px] text-black">
          <label className="">{task}</label>
        </div>
        <div className="pl-8 text-black md:text-[16px] mt-4 mb-2">
          <label className="">Full task description</label>
        </div>
        <div className="bg-[#FFFFFF] h-fit rounded-xl mx-5 px-4 py-4 w-fit text-md lg:text-[14px] text-black">
          <label className="">{taskDescription}</label>
        </div>
      </div>
      <div className="pl-8">
        <div className=" text-black md:text-[16px] mt-4 mb-1">
          <label className="">Time remaining</label>
        </div>
        <div className="h-fit rounded-xl py-2 w-fit text-xl lg:text-[30px] text-black">
          <label className="">{formatTimeLeft()}</label>
        </div>
        {minutes === 0 && (
          <label className="text-[12px] italic mt-2">
            If you have not yet completed your task, please continue working on
            it and submit once you fully complete it
          </label>
        )}
      </div>
    </div>
  );
};

export default Navbar;
