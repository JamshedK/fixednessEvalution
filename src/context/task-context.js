import React, { useState, createContext, useEffect, useContext } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import AuthContext from "./auth-context";
const TaskContext = createContext({
  LLMTask: null,
  SearchEngineTask: null,
  showEditNoteReminder: false, // Default value
  showPopUp: null, // you need showEditNoteReminder and showPopUp because otherwise you won't be able to display the popup properly
  showSaveButton: null, // if user clicks on Edit your draft
  isRatingNeeded: null,
  showRatingPopUp: null,
  noteText: null,
  showEndTaskPopUp: false,
  setLLMTask: () => {},
  setSearchEngineTask: () => {},
  setShowEditNoteReminder: () => {}, // Function to update showEditNoteReminder
  setShowPopUp: () => {},
  setShowSaveButton: () => {},
  setNoteText: () => {},
  setShowEndTaskPopUp: () => {},
  setIsRatingNeeded: () => {},
  setShowRatingPopUp: () => {},
});

export const TaskContextProvider = (props) => {
  const [LLMTask, setLLMTaskState] = useState(null);
  const [SearchEngineTask, setSearchEngineTaskState] = useState(null);
  const [showEditNoteReminder, setShowEditNoteReminderState] = useState(false);
  const [showPopUp, setShowPopUpState] = useState(false);
  const [showSaveButton, setShowSaveButtonState] = useState(false);
  const [noteText, setNoteTextState] = useState("");
  const [showEndTaskPopUp, setShowEndTaskPopUpState] = useState(false);
  const [isRatingNeeded, setIsRatingNeededState] = useState(false);
  const [showRatingPopUp, setShowRatingPopUpState] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignedTask = async () => {
      if (authCtx.user && authCtx.user.uid) {
        const userDocRef = doc(db, "users", authCtx.user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists() && docSnap.data().assignedTask) {
            setLLMTaskState(docSnap.data().assignedTask);
          } else {
            console.log("No assigned LLMTask found or user does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user's assigned task:", error);
        }
      }
    };

    fetchAssignedTask();
  }, [authCtx.user]);

  // Function to fetch tasks from Firestore and set a random LLMTask
  const setLLMTask = async (user) => {
    const taskCollectionRef = collection(db, "chatgptTasks");
    try {
      const taskDocs = await getDocs(taskCollectionRef);
      const tasks = taskDocs.docs.map((doc) => ({
        taskId: doc.id,
        ...doc.data(),
      }));
      if (tasks.length > 0) {
        // Randomly select a task
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        setLLMTaskState(randomTask);

        // Assign the random task to the current user in the 'users' collection
        if (user && user.uid) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            assignedTask: randomTask,
          });
          console.log("User was assigned an LLM task successfully");
        }
      }
    } catch (error) {
      console.error(
        "Error fetching tasks from Firestore or updating user's assigned task:",
        error
      );
    }
  };

  // Function to update showEditNoteReminder state
  const setShowEditNoteReminder = (value) => {
    setShowEditNoteReminderState(value);
  };

  const setShowPopUp = (value) => {
    setShowPopUpState(value);
  };

  const setShowSaveButton = (value) => {
    setShowSaveButtonState(value);
  };

  const setNoteText = (text) => {
    setNoteTextState(text);
  };

  const setShowEndTaskPopUp = (text) => {
    setShowEndTaskPopUpState(text);
  };

  const setIsRatingNeeded = (text) => {
    setIsRatingNeededState(text);
  };

  const setShowRatingPopUp = (text) => {
    setShowRatingPopUpState(text);
  };

  // Function to set SearchEngineTask and save to localStorage
  const setSearchEngineTask = (task) => {
    setSearchEngineTaskState(task);
  };

  const contextValue = {
    LLMTask,
    SearchEngineTask,
    showEditNoteReminder,
    showPopUp,
    showSaveButton,
    noteText,
    showEndTaskPopUp,
    isRatingNeeded,
    showRatingPopUp,
    setLLMTask,
    setSearchEngineTask,
    setShowEditNoteReminder,
    setShowPopUp,
    setShowSaveButton,
    setNoteText,
    setShowEndTaskPopUp,
    setIsRatingNeeded,
    setShowRatingPopUp,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
