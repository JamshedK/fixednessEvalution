import React, { useState, useRef, useContext } from "react";
import { Timestamp, setDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config";
import TaskContext from "../context/task-context";
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { FlowContext } from "../context/flow-context";

const EndTaskPopUp = (props) => {
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();

  const handleYesClicked = () => {
    if (taskCtx.isRatingNeeded) {
      taskCtx.setShowRatingPopUp(true);
      return;
    }
    if (taskCtx.showEditNoteReminder) {
      taskCtx.setShowPopUp(true);
      return;
    }
    taskCtx.setShowEndTaskPopUp(false);
    const collectionRef = doc(db, props.collectionName, authCtx.user.uid);
    setDoc(
      collectionRef,
      {
        endTime: Timestamp.now(),
        status: "completed",
      },
      { merge: true }
    );
    // see the url parameter and get firstTask
    const urlParams = new URLSearchParams(window.location.search);
    const isFirstTask = urlParams.get("firstTask");
    if (isFirstTask === "true") {
      flowCtx.setTask1Completed(true);
    } else {
      flowCtx.setTask2Completed(true);
    }
    // delay for 1 second
    setTimeout(() => {
      navigate("/home?refresh=true");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl max-w-lg mx-auto">
      <p className="text-black mb-8">
        Are you sure that you are ready to submit the final answer? You will no
        be able to do any further edits after final submission
      </p>
      <div className="flex space-x-4">
        <button
          className="bg-[#FFFFFF] text-black px-6 py-2 rounded-lg"
          onClick={handleYesClicked}
        >
          Yes
        </button>
        <button
          className="bg-white text-[#e3e3e3] px-6 py-2 rounded-lg"
          onClick={() => taskCtx.setShowEndTaskPopUp(false)}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default EndTaskPopUp;
