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
const NoteBar = (props) => {
  const taskCtx = useContext(TaskContext);

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
      <button
        className="bg-[#FFFFFF] text-black px-6 py-2 rounded-lg w-fit mt-4"
        onClick={() => taskCtx.setShowEndTaskPopUp(true)}
      >
        Submit
      </button>
    </div>
  );
};

export default NoteBar;
