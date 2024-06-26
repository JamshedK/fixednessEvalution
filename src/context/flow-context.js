import { useState, createContext, useContext, useEffect } from "react";
import { db } from "../firebase-config";
import { getDoc, doc, setDoc } from "firebase/firestore";
import AuthContext from "./auth-context";
import { set } from "firebase/database";

export const FlowContext = createContext({
  demographyCompleted: false,
  preTask1Completed: false,
  task1Completed: false,
  postTask1Completed: false,
  sessionExperienceSurvey1Completed: false,
  preTask2Completed: false,
  task2Completed: false,
  postTask2Completed: false,
  sessionExperienceSurvey2Completed: false,
  preTask3Completed: false,
  isLoading: false,
  isEndOfStudySurveyCompleted: false,
  // Define the setter functions for the new states
  setDemographyCompleted: () => {},
  setPreTask1Completed: () => {},
  setTask1Completed: () => {},
  setPostTask1Completed: () => {},
  setSessionExperienceSurvey1Completed: () => {},
  setPreTask2Completed: () => {},
  setTask2Completed: () => {},
  setPostTask2Completed: () => {},
  setSessionExperienceSurvey2Completed: () => {},
  setPreTask3Completed: () => {},
  setIsLoading: () => {},
  setIsEndOfStudySurveyCompleted: () => {},
  updateFlowState: () => {},
});

export const FlowContextProvider = ({ children }) => {
  // Initialize the state hooks for the new states
  const [demographyCompleted, setDemographyCompleted] = useState(false);
  const [preTask1Completed, setPreTask1Completed] = useState(false);
  const [task1Completed, setTask1Completed] = useState(false);
  const [postTask1Completed, setPostTask1Completed] = useState(false);
  const [
    sessionExperienceSurvey1Completed,
    setSessionExperienceSurvey1Completed,
  ] = useState(false);
  const [preTask2Completed, setPreTask2Completed] = useState(false);
  const [task2Completed, setTask2Completed] = useState(false);
  const [postTask2Completed, setPostTask2Completed] = useState(false);
  const [
    sessionExperienceSurvey2Completed,
    setSessionExperienceSurvey2Completed,
  ] = useState(false);
  const [preTask3Completed, setPreTask3Completed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndOfStudySurveyCompleted, setIsEndOfStudySurveyCompleted] =
    useState(false);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  useEffect(() => {
    setIsLoading(true);
    // Fetch the user's tasks state from Firestore when the component mounts
    const fetchUserTaskState = async () => {
      if (!user || !user.uid) return;

      const userRef = doc(db, "users", user.uid);
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Update the state with the Firestore document data
          setDemographyCompleted(data.demographyCompleted || false);
          setPreTask1Completed(data.preTask1Completed || false);
          setTask1Completed(data.task1Completed || false);
          setPostTask1Completed(data.postTask1Completed || false);
          setPreTask2Completed(data.preTask2Completed || false);
          setTask2Completed(data.task2Completed || false);
          setPostTask2Completed(data.postTask2Completed || false);
          setSessionExperienceSurvey1Completed(
            data.sessionExperienceSurvey1Completed || false
          );
          setSessionExperienceSurvey2Completed(
            data.sessionExperienceSurvey2Completed || false
          );
          setPreTask3Completed(data.preTask3Completed || false);
          setIsEndOfStudySurveyCompleted(
            data.isEndOfStudySurveyCompleted || false
          );
        }
      } catch (error) {
        console.error("Error fetching user task state from Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTaskState();
  }, [user]);

  // Define a function to update the task state in Firestore
  const updateTaskStateInFirestore = async (taskName, value) => {
    if (!user || !user.uid) return;

    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, { [taskName]: value }, { merge: true });
      console.log(`${taskName} updated in Firestore successfully`);
    } catch (error) {
      console.error(`Error updating ${taskName} in Firestore:`, error);
    }
  };

  const updateFlowState = (flowState) => {
    switch (flowState) {
      case "setPreTask1Completed":
        setPreTask1Completed(true);
        updateTaskStateInFirestore("preTask1Completed", true);
        break;
      case "setPreTask2Completed":
        setPreTask2Completed(true);
        updateTaskStateInFirestore("preTask2Completed", true);
        break;
      case "setTask2Completed":
        setTask2Completed(true);
        updateTaskStateInFirestore("task2Completed", true);
        break;
      case "setPostTask2Completed":
        setPostTask2Completed(true);
        updateTaskStateInFirestore("postTask2Completed", true);
        break;
      case "setSessionExperienceSurvey2Completed":
        setSessionExperienceSurvey2Completed(true);
        updateTaskStateInFirestore("sessionExperienceSurvey2Completed", true);
        break;
      case "setPreTask3Completed":
        setPreTask3Completed(true);
        updateTaskStateInFirestore("preTask3Completed", true);
        break;
      default:
        break;
    }
  };

  // Include the new states in the contextValue object
  const contextValue = {
    demographyCompleted,
    preTask1Completed,
    task1Completed,
    postTask1Completed,
    sessionExperienceSurvey1Completed,
    preTask2Completed,
    task2Completed,
    postTask2Completed,
    sessionExperienceSurvey2Completed,
    preTask3Completed,
    isLoading,
    isEndOfStudySurveyCompleted,
    // Define the setter functions for the new states
    setDemographyCompleted: (value) => {
      setDemographyCompleted(value);
      updateTaskStateInFirestore("demographyCompleted", value);
    },
    setPreTask1Completed: (value) => {
      setPreTask1Completed(value);
      updateTaskStateInFirestore("preTask1Completed", value);
    },
    setTask1Completed: (value) => {
      setTask1Completed(value);
      updateTaskStateInFirestore("task1Completed", value);
    },
    setPostTask1Completed: (value) => {
      setPostTask1Completed(value);
      updateTaskStateInFirestore("postTask1Completed", value);
    },
    setSessionExperienceSurvey1Completed: (value) => {
      setSessionExperienceSurvey1Completed(value);
      updateTaskStateInFirestore("sessionExperienceSurvey1Completed", value);
    },
    setPreTask2Completed: (value) => {
      setPreTask2Completed(value);
      updateTaskStateInFirestore("preTask2Completed", value);
    },
    setTask2Completed: (value) => {
      setTask2Completed(value);
      updateTaskStateInFirestore("task2Completed", value);
    },
    setPostTask2Completed: (value) => {
      setPostTask2Completed(value);
      updateTaskStateInFirestore("postTask2Completed", value);
    },
    setSessionExperienceSurvey2Completed: (value) => {
      setSessionExperienceSurvey2Completed(value);
      updateTaskStateInFirestore("sessionExperienceSurvey2Completed", value);
    },
    setPreTask3Completed: (value) => {
      setPreTask3Completed(value);
      updateTaskStateInFirestore("preTask3Completed", value);
    },
    setIsLoading,
    setIsEndOfStudySurveyCompleted: (value) => {
      setIsEndOfStudySurveyCompleted(value);
      updateTaskStateInFirestore("isEndOfStudySurveyCompleted", value);
    },
    updateFlowState,
  };
  return (
    <FlowContext.Provider value={contextValue}>{children}</FlowContext.Provider>
  );
};

export default FlowContextProvider;
