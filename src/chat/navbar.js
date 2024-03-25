import edit_icon from "../assets/navbar/edit_icon.svg";
import star_filled from "../assets/navbar/star_filled.svg";
import tick_icon from "../assets/navbar/tick_icon.svg";

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
import TaskContext from "../context/task-context";

const Navbar = (props) => {
  const taskCtx = useContext(TaskContext);
  // get the url of the current page
  let task = "";
  const currentURL = window.location.pathname;
  if (currentURL.includes(taskCtx.tasks.firstTask)) {
    task = taskCtx.tasks.firstTaskTopic;
  } else {
    task = taskCtx.tasks.secondTaskTopic;
  }
  return (
    <div className="bg-[#e3e3e3] w-[30%] h-screen sticky flex top-0 flex-col text-[18px] pb-10 pt-10 justify-start space-y-5">
      <div className="pl-8 text-black font-bold underline">
        <label className="">Current task</label>
      </div>
      <div className="bg-[#FFFFFF] h-fit rounded-xl mx-5 px-6 py-4 w-fit text-md text-black">
        <label className="">{task}</label>
      </div>
    </div>
  );
};

export default Navbar;
