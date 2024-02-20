import demographyJSON from "./../demography.json";

import React, { useState } from "react";

const DemographyQuestions = () => {
  // States for each question category
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [usageFrequency, setUsageFrequency] = useState("");
  const [purpose, setPurpose] = useState("");
  const [discovery, setDiscovery] = useState([]);

  // Handler for checkboxes to toggle selection
  const handleCheckboxChange = (option) => {
    setDiscovery((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Map each question to its corresponding input type
  const inputFieldMap = {
    Age: { state: age, setState: setAge, type: "radio" },
    Gender: { state: gender, setState: setGender, type: "radio" },
    "Highest Level of Education Completed": {
      state: education,
      setState: setEducation,
      type: "radio",
    },
    "Employment Status": {
      state: employmentStatus,
      setState: setEmploymentStatus,
      type: "radio",
    },
    "Frequency of Using Chatbots/Search Engine": {
      state: usageFrequency,
      setState: setUsageFrequency,
      type: "radio",
    },
    "Primary Purpose for Using ChatGPT": {
      state: purpose,
      setState: setPurpose,
      type: "radio",
    },
    "How did you hear about ChatGPT?": {
      state: discovery,
      setState: handleCheckboxChange,
      type: "checkbox",
    },
  };

  return (
    <div
      className="max-h-screen overflow-y-auto text-white py-20 scrollbar 
    scrollbar-thumb-[#ffffff] scrollbar-thumb-rounded-full"
    >
      {demographyJSON.map((question, qIndex) => (
        <div key={qIndex} className="bg-[#142838] py-12 px-16">
          <h1 className="text-[20px] mb-5">{question.category}</h1>
          {question.options.map((option, oIndex) => {
            const inputType = question.allowMultipleSelections
              ? "checkbox"
              : "radio";
            const inputName = question.allowMultipleSelections
              ? `${question.category}-${oIndex}`
              : question.category;
            const isChecked = question.allowMultipleSelections
              ? inputFieldMap[question.category].state.includes(option)
              : inputFieldMap[question.category].state === option;

            return (
              <div
                key={oIndex}
                className="flex flex-row space-x-4 items-center"
              >
                <input
                  type={inputType}
                  id={`${inputName}-${oIndex}`}
                  name={inputName}
                  value={option}
                  checked={isChecked}
                  onChange={(e) =>
                    question.allowMultipleSelections
                      ? inputFieldMap[question.category].setState(option)
                      : inputFieldMap[question.category].setState(
                          e.target.value
                        )
                  }
                  className={`w-4 h-4 ${
                    inputType === "radio" ? "form-radio" : "form-checkbox"
                  } bg-black`}
                />
                <label htmlFor={`${inputName}-${oIndex}`}>{option}</label>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DemographyQuestions;
