import React, { useContext, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import TaskContext from "../context/task-context";
import AuthContext from "../context/auth-context";

const RateSearchResults = (props) => {
  const [rating, setRating] = useState(null);
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext);
  var array = [
    "Does not meet my expectation",
    "Meets my expectation",
    "Exceeds my expectation",
  ];

  const handleSubmit = async () => {
    const formData = {
      queryID: props.queryID,
      rating: array[rating],
      ts: Timestamp.now(),
      userID: authCtx.user.uid,
    };

    try {
      // Save the form data to Firestore
      const docRef = await addDoc(collection(db, "searchRating"), formData);
      console.log("Document written with ID:", docRef.id);
      // Close the prompt and handle any further actions here (if needed)
      taskCtx.setIsRatingNeeded(false);
      taskCtx.setShowRatingPopUp(false);
      if (taskCtx.showEditNoteReminder) {
        taskCtx.setShowPopUp(true);
      }
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="fixed flex flex-col bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl min-w-[30rem] max-h-[85%] overflow-auto space-y-4">
      {/* <h1 className="text-black text-center mb-2">How did the system perform compared to your expectation?</h1> */}
      <div className="flex flex-col text-black space-y-4 ma x-w-[28rem]">
        <h1 className="text-lg">
          How did the system perform compared to your expectation?{" "}
        </h1>
        <div className="flex flex-col pl-8 pr-16 justify-between space-y-">
          {/* Array to generate the radio buttons */}
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <div key={index} className="flex flex-row space-x-4 items-center">
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full border-[1px] border-black ${
                    rating === index ? "bg-black" : ""
                  }`}
                  onClick={() => setRating(index)}
                ></button>
                <label>{array[index]}</label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row justify-around mt-16">
        <button
          className="bg-white px-6 py-2 rounded-2xl"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RateSearchResults;
