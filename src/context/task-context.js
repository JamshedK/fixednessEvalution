import React, { useState, createContext, useEffect, useContext } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import AuthContext from "./auth-context";
import tasksJSON from "../tasks.json";

const TaskContext = createContext({
  SearchEngineTask: null,
  showEditNoteReminder: false, // Default value
  showPopUp: null, // you need showEditNoteReminder and showPopUp because otherwise you won't be able to display the popup properly
  showSaveButton: null, // if user clicks on Edit your draft
  isRatingNeeded: null,
  showRatingPopUp: null,
  noteText: null,
  showEndTaskPopUp: false,
  tasks: {},
  setSearchEngineTask: () => {},
  setShowEditNoteReminder: () => {}, // Function to update showEditNoteReminder
  setShowPopUp: () => {},
  setShowSaveButton: () => {},
  setNoteText: () => {},
  setShowEndTaskPopUp: () => {},
  setIsRatingNeeded: () => {},
  setShowRatingPopUp: () => {},
  setTasks: () => {},
});

export const TaskContextProvider = (props) => {
  const [SearchEngineTask, setSearchEngineTaskState] = useState(null);
  const [showEditNoteReminder, setShowEditNoteReminderState] = useState(false);
  const [showPopUp, setShowPopUpState] = useState(false);
  const [showSaveButton, setShowSaveButtonState] = useState(false);
  const [noteText, setNoteTextState] = useState("");
  const [showEndTaskPopUp, setShowEndTaskPopUpState] = useState(false);
  const [isRatingNeeded, setIsRatingNeededState] = useState(false);
  const [showRatingPopUp, setShowRatingPopUpState] = useState(false);
  const [tasks, setTasksState] = useState({
    firstTask: null,
    firstTaskTopic: null,
    secondTask: null,
    secondTaskTopic: null,
  });
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignedTask = async () => {
      if (authCtx.user && authCtx.user.uid) {
        const userDocRef = doc(db, "users", authCtx.user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists() && docSnap.data().tasks) {
            setTasksState(docSnap.data().tasks);
          } else {
            console.log("No assigned tasks found or user does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user's assigned task:", error);
        }
      }
    };

    fetchAssignedTask();
  }, [authCtx.user]);

  const generateLatinSquare = (tasks) => {
    let square = [];
    for (let i = 0; i < tasks.length; i++) {
      let row = [];
      for (let j = 0; j < tasks.length; j++) {
        let index = (i + j) % tasks.length;
        row.push(tasks[index]);
      }
      square.push(row);
    }
    return square;
  };

  const selectRandomTask = (latinSquare) => {
    const row = Math.floor(Math.random() * latinSquare.length);
    const column = Math.floor(Math.random() * latinSquare[row].length);
    return latinSquare[row][column].title;
  };

  const setTasks = (user) => {
    // Generate Latin Square for task topics
    const latinSquareTopics = generateLatinSquare(tasksJSON);
    console.log(latinSquareTopics);
    const firstTaskTopic = selectRandomTask(latinSquareTopics);
    const secondTaskTopic = selectRandomTask(latinSquareTopics);
    const taskTypes = ["chat", "search"];
    const firstTaskIndex = Math.floor(Math.random() * taskTypes.length);
    const firstTask = taskTypes[firstTaskIndex];
    const secondTask = taskTypes[firstTaskIndex === 0 ? 1 : 0]; // Ensure the second task is different
    const obj = {
      firstTask,
      firstTaskTopic,
      secondTask,
      secondTaskTopic,
    };
    console.log(obj);
    try {
      if (user && user.uid) {
        const userDocRef = doc(db, "users", user.uid);
        updateDoc(userDocRef, {
          tasks: obj,
        });
        console.log("User was assigned tasks successfully");
      }
    } catch (error) {
      console.error("Error assigning tasks to user:", error);
    }
    setTasksState(obj);
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
    SearchEngineTask,
    showEditNoteReminder,
    showPopUp,
    showSaveButton,
    noteText,
    showEndTaskPopUp,
    isRatingNeeded,
    showRatingPopUp,
    tasks,
    setSearchEngineTask,
    setShowEditNoteReminder,
    setShowPopUp,
    setShowSaveButton,
    setNoteText,
    setShowEndTaskPopUp,
    setIsRatingNeeded,
    setShowRatingPopUp,
    setTasks,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
