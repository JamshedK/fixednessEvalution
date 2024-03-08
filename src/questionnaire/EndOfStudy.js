import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { FlowContext } from "../context/flow-context";

const EndOfStudy = () => {
  const [mturkId, setMturkId] = useState("");
  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const [showInput, setShowInput] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assuming you might want to do something with the mturkId, like storing it
    console.log("MTurk ID:", mturkId);
    try {
      const useDocRef = doc(db, "users", authCtx.user.uid);
      // Update the user document with the MTurk ID
      await updateDoc(useDocRef, {
        mturkId: mturkId,
      });
      flowCtx.setIsEndOfStudySurveyCompleted(true);
      setShowInput(false);
    } catch (error) {
      alert("There was an error submitting your MTurk ID. Please try again.");
      console.error("Error submitting MTurk ID:", error);
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col items-center bg-[#f0f0f0] p-8 rounded-lg w-[30%]">
        <h1 className="text-xl mb-4">
          Thank you for participating in our study!
        </h1>
        {showInput && (
          <div className="flex flex-col w-full items-center">
            <p>Please enter your Amazon MTurk ID below.</p>
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex flex-col space-y-4 border-2 w-[70%] items-center"
            >
              <input
                type="text"
                value={mturkId}
                onChange={(e) => setMturkId(e.target.value)}
                placeholder="MTurk ID"
                className="text-center p-2 rounded-md border-2 border-gray-300 w-full "
              />
              <button
                type="submit"
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
              >
                Click to End the Study
              </button>
            </form>
          </div>
        )}
        {!showInput && (
          <p className="text-xl mb-4"> You may now close this page</p>
        )}
      </div>
    </div>
  );
};

export default EndOfStudy;
