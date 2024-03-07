import React, { useState, useEffect, useContext } from "react";
import sessionExperienceJSON from "./../sessionExperience.json"; // Assuming sessionExperience.json is located in the src directory
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { FlowContext } from "../context/flow-context";

const ExperienceSurveyMain = () => {
  const [currentTask, setCurrentTask] = useState("");
  const flowCtx = useContext(FlowContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  // State to hold responses
  const [responses, setResponses] = useState({
    overallExperience: "",
    responseSatisfaction: "",
    objectiveAchievement: "",
    additionalComments: "",
  });

  useEffect(() => {
    // Create a URLSearchParams object based on the current window location
    const queryParams = new URLSearchParams(window.location.search);
    // Extract the 'currentTask' query parameter
    const task = queryParams.get("currentTask"); // 'search' or 'chat'

    // Map 'search' or 'chat' to more descriptive task names, if necessary
    let taskName = "";
    if (task === "chat") {
      taskName = "ChatGPT";
    } else if (task === "search") {
      taskName = "Search Engine";
    }

    // Update the currentTask state with the extracted and mapped task name
    setCurrentTask(taskName);
  }, []);

  // Handler for changes in radio button selections
  const handleRadioChange = (key, option) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [key]: option,
    }));
  };

  // Handler for the open-ended question
  const handleOpenEndedChange = (e) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      additionalComments: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(responses);
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const isFirstTask = queryParams.get("firstTask");
      const taskName = queryParams.get("currentTask");
      await addDoc(collection(db, "experienceSurvey"), {
        ...responses,
        ts: serverTimestamp(),
        task: taskName,
        userId: authCtx.user.uid,
      });

      if (isFirstTask === "true") {
        flowCtx.setSessionExperienceSurvey1Completed(true);
      } else {
        flowCtx.setSessionExperienceSurvey2Completed(true);
      }
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-auto scrollbar justify-center scrollbar-thumb-[#ffffff] scrollbar-w-2">
      <form
        className="flex flex-col justify-center items-center h-fit w-[40%] bg-[#142838] text-white py-12 
         px-16 rounded-xl"
        onSubmit={handleSubmit}
      >
        {sessionExperienceJSON.map((question, index) => {
          if (question.responseType === "open-ended") {
            return (
              <div key={index} className="w-full p-4">
                <label>
                  {question.question.replace("current task", currentTask)}
                </label>
                <textarea
                  className="w-full p-2 text-black form-textarea outline-none rounded-md"
                  value={responses.additionalComments}
                  onChange={handleOpenEndedChange}
                />
              </div>
            );
          } else {
            return (
              <div key={index} className="w-full p-4 space-y-2">
                <p> {question.question.replace("current task", currentTask)}</p>
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex flex-row space-x-4 items-center"
                  >
                    <input
                      type="radio"
                      id={`${question.question}-${option}`}
                      name={question.question}
                      value={option}
                      className="form-radio"
                      checked={responses[question.key] === option}
                      onChange={() => handleRadioChange(question.key, option)}
                    />
                    <label htmlFor={`${question.question}-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            );
          }
        })}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExperienceSurveyMain;
