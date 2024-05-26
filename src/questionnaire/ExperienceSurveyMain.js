import React, { useState, useEffect, useContext } from "react";
import sessionExperienceJSON from "./../sessionExperience.json"; // Assuming sessionExperience.json is located in the src directory
import {
  addDoc,
  serverTimestamp,
  collection,
  where,
  getDocs,
  query,
  Timestamp,
} from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { FlowContext } from "../context/flow-context";

const ExperienceSurveyMain = () => {
  const [currentTask, setCurrentTask] = useState();
  const [startedTs, setStartedTs] = useState(Timestamp.now());
  const flowCtx = useContext(FlowContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  // State to hold responses
  const [responses, setResponses] = useState({
    overallExperience: "",
    responseSatisfaction: "",
    objectiveAchievement: "",
    topicFamiliarity: "",
    additionalComments: "",
    threeExamples: ["", "", ""],
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

  // get saved data from firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const task = new URLSearchParams(window.location.search).get(
          "currentTask"
        );
        const q = query(
          collection(db, "experienceSurvey"),
          where("task", "==", task),
          where("userId", "==", authCtx.user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // Each doc satisfies the query's conditions and can be processed
          const restult = doc.data();
          setResponses({
            overallExperience: restult.overallExperience,
            responseSatisfaction: restult.responseSatisfaction,
            objectiveAchievement: restult.objectiveAchievement,
            topicFamiliarity: restult.topicFamiliarity,
            additionalComments: restult.additionalComments,
            threeExamples: restult.threeExamples || ["", "", ""],
          });
        });
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    if (authCtx.user) {
      fetchData();
    }
  }, [authCtx]);

  // Validate the form whenever responses change
  useEffect(() => {
    const allExamplesFilled = responses.threeExamples.every(
      (example) => example.trim() !== ""
    );
    const allResponsesFilled = Object.values(responses).every((response) => {
      if (Array.isArray(response))
        return response.every((r) => r.trim() !== "");
      return response.trim() !== "";
    });
    setIsFormValid(allResponsesFilled && allExamplesFilled);
  }, [responses]);

  // Handler for changes in radio button selections
  const handleRadioChange = (key, option) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [key]: option,
    }));
  };

  // Handler for the open-ended question
  const handleOpenEndedChange = (e, key, index) => {
    if (key === "threeExamples") {
      const newExamples = [...responses.threeExamples];
      newExamples[index] = e.target.value;
      setResponses((prevResponses) => ({
        ...prevResponses,
        threeExamples: newExamples,
      }));
    } else {
      setResponses((prevResponses) => ({
        ...prevResponses,
        [key]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please answer all questions before submitting.");
    } else {
      console.log(responses);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const isFirstTask = queryParams.get("firstTask");
        const taskName = queryParams.get("currentTask");
        await addDoc(collection(db, "experienceSurvey"), {
          ...responses,
          startedTs: startedTs,
          completedTs: serverTimestamp(),
          task: taskName,
          userId: authCtx.user.uid,
        });
        const flowState = queryParams.get("flowState");
        flowCtx.updateFlowState(flowState);
        navigate("/");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-auto scrollbar justify-center scrollbar-thumb-[#ffffff] scrollbar-w-2">
      <form
        className="flex flex-col justify-center items-center h-fit w-[40%] bg-[#e3e3e3] text-black py-12 
         px-16 rounded-xl"
        onSubmit={handleSubmit}
      >
        {sessionExperienceJSON.map((question, index) => {
          const questionText = question.question.replace(
            "current task",
            currentTask
          );
          if (question.responseType === "open-ended") {
            if (question.key === "threeExamples") {
              return (
                <div key={index} className="w-full p-4">
                  <label>{questionText}</label>
                  {responses.threeExamples.map((example, idx) => (
                    <input
                      key={idx}
                      className="w-full p-2 text-black form-input outline-none rounded-md mt-2"
                      value={example}
                      onChange={(e) =>
                        handleOpenEndedChange(e, question.key, idx)
                      }
                      placeholder={`Example ${idx + 1}`}
                    />
                  ))}
                </div>
              );
            } else {
              return (
                <div key={index} className="w-full p-4">
                  <label>{questionText}</label>
                  <textarea
                    className="w-full p-2 text-black form-textarea outline-none rounded-md"
                    value={responses[question.key]}
                    onChange={(e) => handleOpenEndedChange(e, question.key)}
                  />
                </div>
              );
            }
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
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExperienceSurveyMain;
