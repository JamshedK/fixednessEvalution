import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/auth-context";
import { FlowContext } from "../context/flow-context";
import { db } from "../firebase-config";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DemographyQuestions = ({ onResponsesChange }) => {
  const [responses, setResponses] = useState({});
  const [demographyQuestions, setDemographyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const [demographyStartedTs, setDemographyStartedTs] = useState(
    Timestamp.now()
  );
  const navigate = useNavigate();

  // Load demography questions from Firebase admin/demographySurvey
  useEffect(() => {
    const fetchDemographyQuestions = async () => {
      try {
        const docRef = doc(db, "admin", "demographySurvey");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const questions = data.questions || [];
          setDemographyQuestions(questions);
        }
      } catch (error) {
        console.error("Error fetching demography questions:", error);
        // Fallback to empty state
        setDemographyQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographyQuestions();
  }, []);

  // get saved data from firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, "users", authCtx?.user?.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setResponses(data.backgroundResponses || {});
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    
    if (authCtx.user && demographyQuestions.length > 0) {
      fetchData();
    }
  }, [authCtx, demographyQuestions]);

  const handleInputChange = (
    questionId,
    optionValue,
    isCheckbox = false,
    selectUpto
  ) => {
    setResponses((prev) => {
      let updatedResponse;
      if (isCheckbox) {
        // Check if the current selection is already in the array
        const alreadySelected = prev[questionId]?.includes(optionValue);
        const currentSelections = prev[questionId] ? [...prev[questionId]] : [];
        if (alreadySelected) {
          // If it's already selected, remove it from the array
          updatedResponse = currentSelections.filter(
            (item) => item !== optionValue
          );
        } else {
          if (selectUpto === undefined) {
            updatedResponse = [...currentSelections, optionValue];
          } else {
            // Check if we can add a new selection based on selectUpto limit
            if (
              selectUpto !== undefined &&
              currentSelections.length < selectUpto
            ) {
              updatedResponse = [...currentSelections, optionValue];
            } else {
              // If we've reached the limit, return the current selections without adding a new one
              alert(`You can select up to ${selectUpto} options.`);
              return prev; // Early return to avoid updating the state
            }
          }
        }
      } else {
        updatedResponse = optionValue;
      }
      return { ...prev, [questionId]: updatedResponse };
    });
  };

  const validateForm = () => {
    if (demographyQuestions.length === 0) return false;
    
    return demographyQuestions.every((question) => {
      const response = responses[question.category];
      if (question.required) {
        if (question.allowMultipleSelections) {
          return response && response.length > 0;
        }
        return response !== undefined && response !== "";
      }
      return true;
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please answer all required questions before submitting.");
      return;
    }
    console.log(responses);
    try {
      const userDocRef = doc(db, "users", authCtx?.user?.uid);
      await updateDoc(userDocRef, {
        backgroundResponses: responses,
        demographyStartedTs: demographyStartedTs,
        demographyCompletedTs: Timestamp.now(),
      });
      console.log("Document successfully updated!");
      flowCtx.setDemographyCompleted(true);
      navigate("/");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="text-lg">Loading demography questions...</div>
      </div>
    );
  }

  if (demographyQuestions.length === 0) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="text-lg text-red-600">No demography questions found. Please contact the administrator.</div>
      </div>
    );
  }

  return (
    <div
      className="max-h-screen overflow-y-auto text-black py-20 flex flex-col scrollbar 
    scrollbar-thumb-[#d58d8d] scrollbar-thumb-rounded-full scrollbar-w-2"
    >
      {demographyQuestions.map((question, qIndex) => (
        <div key={qIndex} className="bg-[#e3e3e3] py-6 px-16 rounded-md mb-4">
          <h1 className="text-[20px]">{question.category}</h1>
          {question.selectUpto && (
            <label className="text-[13px] mb-2 text-red-500 italic">
              Select upto {question.selectUpto} options
            </label>
          )}
          {question.options.map((option, oIndex) => {
            const isChecked = question.allowMultipleSelections
              ? responses[question.category]?.includes(option)
              : responses[question.category] === option;
            const formType = question.allowMultipleSelections
              ? "checkbox"
              : "radio";
            return (
              <div
                key={oIndex}
                className="flex flex-row space-x-4 items-center mt-5"
              >
                <input
                  type={formType}
                  id={`${question.category}-${oIndex}`}
                  name={question.category}
                  value={option}
                  checked={isChecked}
                  onChange={(e) =>
                    handleInputChange(
                      question.category,
                      e.target.value,
                      question.allowMultipleSelections,
                      question.selectUpto
                    )
                  }
                  className={`w-4 h-4 form-${formType}`}
                />
                <label htmlFor={`${question.category}-${oIndex}`}>
                  {option}
                </label>
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
