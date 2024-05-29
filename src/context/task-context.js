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
import { set } from "firebase/database";

const TaskContext = createContext({
  showEditNoteReminder: false, // Default value
  showPopUp: null, // you need showEditNoteReminder and showPopUp because otherwise you won't be able to display the popup properly
  showSaveButton: null, // if user clicks on Edit your draft
  isRatingNeeded: null,
  showRatingPopUp: null,
  note: null,
  showEndTaskPopUp: false,
  tasks: {},
  timeRemaining: 0,
  queryCount: 0,
  allResponsesRated: false,
  questionnaireOrder: {},
  promptIDForRating: null,
  setShowEditNoteReminder: () => {}, // Function to update showEditNoteReminder
  setShowPopUp: () => {},
  setShowSaveButton: () => {},
  setNote: () => {},
  setShowEndTaskPopUp: () => {},
  setIsRatingNeeded: () => {},
  setShowRatingPopUp: () => {},
  setTasks: () => {},
  setTimeRemaining: () => {},
  setQueryCount: () => {},
  setAllResponsesRated: () => {},
  setQuestionnaireOrder: () => {},
  getQuestionnaireText: () => {},
  setPromptIDForRating: () => {},
});

export const TaskContextProvider = (props) => {
  const [SearchEngineTask, setSearchEngineTaskState] = useState(null);
  const [showEditNoteReminder, setShowEditNoteReminderState] = useState(false);
  const [showPopUp, setShowPopUpState] = useState(false);
  const [showSaveButton, setShowSaveButtonState] = useState(false);
  const [note, setNoteState] = useState("");
  const [showEndTaskPopUp, setShowEndTaskPopUpState] = useState(false);
  const [isRatingNeeded, setIsRatingNeededState] = useState(false);
  const [showRatingPopUp, setShowRatingPopUpState] = useState(false);
  const [timeRemaining, setTimeRemainingState] = useState(0);
  const [queryCount, setQueryCountState] = useState(0);
  const [promptIDForRating, setPromptIDForRatingState] = useState(null);
  const [tasks, setTasksState] = useState({
    firstTask: null,
    firstTaskTopic: null,
  });
  const [questionnaireOrder, setQuestionnaireOrderState] = useState({
    firstQuestionnaire: null,
    secondQuestionnaire: null,
  });
  const [allResponsesRated, setAllResponsesRatedState] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignedTask = async () => {
      if (authCtx.user && authCtx.user.uid) {
        const userDocRef = doc(db, "users", authCtx.user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists() && docSnap.data().tasks) {
            setTasksState(docSnap.data().tasks);
            setQuestionnaireOrderState(docSnap.data().questionnaireOrder);
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
    console.log(latinSquare.length);
    const row = Math.floor(Math.random() * latinSquare.length);
    const column = Math.floor(Math.random() * latinSquare.length);
    return latinSquare[row][column];
  };

  const setTasks = (user) => {
    // Generate Latin Square for task topics
    const latinSquareTopics = generateLatinSquare(tasksJSON);
    console.log(latinSquareTopics);
    const firstTaskObj = selectRandomTask(latinSquareTopics);
    const questionnaires = ["search", "virtual-assistant"];
    const firstQuestionnaire = questionnaires[Math.floor(Math.random() * 2)];
    const secondQuestionnaire = questionnaires.filter(
      (questionnaire) => questionnaire !== firstQuestionnaire
    )[0];
    const questionnaireOrder = {
      firstQuestionnaire,
      secondQuestionnaire,
    };
    const firstTask = "chat";
    const obj = {
      firstTask,
      firstTaskTopic: firstTaskObj.title,
      firstTaskDescription: firstTaskObj.description,
    };
    try {
      if (user && user.uid) {
        const userDocRef = doc(db, "users", user.uid);
        updateDoc(userDocRef, {
          tasks: obj,
          questionnaireOrder,
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

  const setNote = (text) => {
    setNoteState(text);
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

  const setTimeRemaining = (time) => {
    setTimeRemainingState(time);
  };

  const setQueryCount = () => {
    console.log(queryCount);
    setQueryCountState(queryCount + 1);
  };

  const setAllResponsesRated = (value) => {
    setAllResponsesRatedState(value);
  };

  const setQuestionnaireOrder = (value) => {
    setQuestionnaireOrderState(value);
  };

  const setPromptIDForRating = (value) => {
    setPromptIDForRatingState(value);
  };

  const getQuestionnaireText = (questionnaire) => {
    if (questionnaire === "search") {
      return "Search Engine ";
    } else {
      return "Virtual Assistant";
    }
  };

  const contextValue = {
    SearchEngineTask,
    showEditNoteReminder,
    showPopUp,
    showSaveButton,
    note,
    showEndTaskPopUp,
    isRatingNeeded,
    showRatingPopUp,
    tasks,
    timeRemaining,
    queryCount,
    allResponsesRated,
    questionnaireOrder,
    promptIDForRating,
    setSearchEngineTask,
    setShowEditNoteReminder,
    setShowPopUp,
    setShowSaveButton,
    setNote,
    setShowEndTaskPopUp,
    setIsRatingNeeded,
    setShowRatingPopUp,
    setTasks,
    setTimeRemaining,
    setQueryCount,
    setAllResponsesRated,
    setQuestionnaireOrder,
    getQuestionnaireText,
    setPromptIDForRating,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
