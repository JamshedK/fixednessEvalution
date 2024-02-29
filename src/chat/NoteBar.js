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
    <div className="bg-[#142838] w-[35%] h-screen sticky flex top-0 flex-col text-[18px] pb-10 pt-10 justify-between items-center">
      <div className="flex flex-col space-y-10">
        <div className="bg-[#2F4454] h-fit rounded-xl mx-5 px-8 py-4 w-80 text-md text-white">
          <label className="">
            Please add your answer to the task below. You can always click and
            edit it before final submission
          </label>
        </div>
        <NoteContainer />
      </div>
      <button
        className="bg-[#2F4454] text-white px-6 py-2 rounded-lg w-fit"
        onClick={() => taskCtx.setShowEndTaskPopUp(true)}
      >
        Submit
      </button>
    </div>
  );
};

export default NoteBar;
