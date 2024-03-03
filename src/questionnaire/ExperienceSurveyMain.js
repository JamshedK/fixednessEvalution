import React, { useState, useEffect } from "react";
import sessionExperienceJSON from "./../sessionExperience.json"; // Assuming sessionExperience.json is located in the src directory

const ExperienceSurveyMain = () => {
  const [currentTask, setCurrentTask] = useState("");
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
  const handleRadioChange = (question, option) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [question]: option,
    }));
  };

  // Handler for the open-ended question
  const handleOpenEndedChange = (e) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      additionalComments: e.target.value,
    }));
  };

  // Placeholder function for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(responses);
    // Implement submission logic here, such as updating Firestore or navigating to another route
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
                      checked={responses[question.question] === option}
                      onChange={() =>
                        handleRadioChange(question.question, option)
                      }
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
