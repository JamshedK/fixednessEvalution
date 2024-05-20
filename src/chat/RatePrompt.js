import React, { useContext, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";
import TaskContext from "../context/task-context";
import AuthContext from "../context/auth-context";

const RatePrompt = (props) => {
  const [rating, setRating] = useState(null);
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  var array = [
    "Does not meet my expectation",
    "Meets my expectation",
    "Exceeds my expectation",
  ];

  const handleSubmit = async () => {
    const formData = {
      promptID: props.promptID,
      rating: array[rating],
      userID: authCtx.user.uid,
      ts: Timestamp.now(),
    };

    try {
      // Save the form data to Firestore
      const docRef = await addDoc(collection(db, "promptRatings"), formData);
      console.log("Document written with ID:", docRef.id);

      // Get the chat document reference
      const chatTaskRef = doc(db, "chatTasks", authCtx.user.uid);
      const chatTaskSnap = await getDoc(chatTaskRef);

      if (chatTaskSnap.exists()) {
        // Get the data and find the specific prompt
        const chatData = chatTaskSnap.data();
        const prompts = chatData.prompts.map((prompt) => {
          if (prompt.id === props.promptID) {
            return { ...prompt, rating: array[rating], ratingID: docRef.id };
          }
          return prompt;
        });

        // Update the document with the new prompts array
        await updateDoc(chatTaskRef, { prompts });
      }

      // Close the prompt and handle any further actions here (if needed)
      taskCtx.setShowRatingPopUp(false);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="fixed flex flex-col bg-[#e3e3e3] py-12 px-16 h-fit rounded-xl min-w-[30rem] max-h-[85%] overflow-auto space-y-4">
      {/* <h1 className="text-black text-center mb-2">How did the system perform compared to your expectation?</h1> */}
      <div className="flex flex-col text-black space-y-4 ma x-w-[28rem]">
        <h1 className="text-lg">
          How did the system perform compared to your expectation under the most
          recent prompt?
        </h1>
        <div className="flex flex-col pl-8 pr-16 justify-between space-y-">
          {/* Array to generate the radio buttons */}
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <div className="flex flex-row space-x-4 items-center">
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
      <div className="flex flex-row justify-center mt-16 space-x-6">
        <button
          className="bg-white px-6 py-2 rounded-2xl"
          onClick={handleSubmit}
        >
          Save
        </button>
        <button
          className=" px-6 py-2 rounded-2xl"
          onClick={() => taskCtx.setShowRatingPopUp(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RatePrompt;
