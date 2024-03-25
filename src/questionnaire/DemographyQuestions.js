import demographyJSON from "./../demography.json";

import React, { useState, useContext } from "react";
import AuthContext from "../context/auth-context";
import { FlowContext } from "../context/flow-context";
import { db } from "../firebase-config";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DemographyQuestions = ({ onResponsesChange }) => {
  // States for each question category
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [usageFrequency, setUsageFrequency] = useState("");
  const [purpose, setPurpose] = useState("");
  const [discovery, setDiscovery] = useState([]);
  // State to store "Other" inputs for different categories
  const [otherInputs, setOtherInputs] = useState({});

  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();

  // Handler for checkboxes to toggle selection
  const handleCheckboxChange = (option) => {
    setDiscovery((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Function to handle changes in the "Other" input fields
  const handleOtherInputChange = (category, value) => {
    setOtherInputs((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Map each question to its corresponding input type
  const inputFieldMap = {
    "What is your age group?": { state: age, setState: setAge, type: "radio" },
    "What is your gender?": {
      state: gender,
      setState: setGender,
      type: "radio",
    },
    "What is the highest level of education you have completed or currently pursuing?":
      {
        state: education,
        setState: setEducation,
        type: "radio",
        name: "education",
      },
    "What is your current employment status?": {
      state: employmentStatus,
      setState: setEmploymentStatus,
      type: "radio",
      name: "employmentStatus",
    },
    "How frequently do you use chatbots or search engines?": {
      state: usageFrequency,
      setState: setUsageFrequency,
      type: "radio",
      name: "usageFrequency",
    },
    "What is your primary purpose for using ChatGPT?": {
      state: purpose,
      setState: setPurpose,
      type: "radio",
      name: "purpose",
    },
    "How did you hear about ChatGPT?": {
      state: discovery,
      setState: handleCheckboxChange,
      type: "checkbox",
      name: "discovery",
    },
  };

  // Validation function to check if all fields are filled
  const validateForm = () => {
    const requiredFields = [
      age,
      gender,
      education,
      employmentStatus,
      usageFrequency,
      purpose,
    ];
    const allFieldsFilled = requiredFields.every((field) => field !== "");
    const discoveryFilled = discovery.length > 0;

    return allFieldsFilled && discoveryFilled;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please answer all questions before submitting.");
      return; // Stop the function from proceeding
    }

    // TODO: If other is selected for checkbox, not everything gets saved
    const responses = {
      age,
      gender,
      education,
      employmentStatus,
      usageFrequency,
      purpose,
      discovery,
      ...Object.keys(otherInputs).reduce((acc, category) => {
        console.log(acc);
        if (otherInputs[category] !== "") {
          acc[category] = otherInputs[category];
        }
        return acc;
      }, {}),
    };

    try {
      // Reference to the user's document in Firestore using the user's UUID
      const userDocRef = doc(db, "users", authCtx?.user?.uid);
      // Update the user's document with the new responses
      await updateDoc(userDocRef, {
        ...responses,
        demographyCompletedTs: Timestamp.now(), // Spread the responses object to update fields in the document
      });
      console.log("Document successfully updated!");
      flowCtx.setDemographyCompleted(true);
      navigate("/");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div
      className="max-h-screen overflow-y-auto text-black py-20 scrollbar-h-10 scrollbar 
    scrollbar-thumb-[#ffffff] scrollbar-thumb-rounded-full scrollbar-w-2 space-y-4"
    >
      {demographyJSON.map((question, qIndex) => (
        <div key={qIndex} className="bg-[#e3e3e3] py-6 px-16 rounded-md">
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
                  } bg-white`}
                />
                <label htmlFor={`${inputName}-${oIndex}`}>{option}</label>
                {option === "Other" && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    className="bg-[#FFFFFF] px-2 py-1 rounded-md"
                    onChange={(e) =>
                      handleOtherInputChange(
                        inputFieldMap[question.category].name,
                        e.target.value
                      )
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex flex-row justify-around mt-8 text-black">
        <button
          className="bg-[#e3e3e3] px-6 py-2 rounded-2xl"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>{" "}
    </div>
  );
};

export default DemographyQuestions;
