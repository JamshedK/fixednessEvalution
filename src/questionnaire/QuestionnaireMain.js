import { useContext, useState, useMemo } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import IntentionBox from "./IntentionBox";
import topologyJSON from "./../topology.json";
import IntentionTypeItem from "./IntentionTypeItem";
import ProgressBar from "@ramonak/react-progress-bar";
import Questions from "./Questions";
import DemographyQuestions from "./DemographyQuestions";
import { FlowContext } from "../context/flow-context";
import { useNavigate } from "react-router-dom";
import InstructionsPopUp from "./InstructionsPopUp";
import { useLocation } from "react-router-dom";

const instructionText =
  "In the following phase, please complete the two survey questions under each intention presented on the left sidebar. Please read the intention description first before answering the two questions. After your complete the questions under one intention, you can click on the next intention on the sidebar, which will take you to a new set of survey questions. Please complete the survey questions for all intentions listed on the left sidebar.";

const QuestionnnaireMain = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ratings, setRatings] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);

  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get location object

  const handleSelectItem = (itemId) => {
    setSelectedItem(itemId);
  };

  const handleRatingsChange = (
    itemId,
    expectationRating,
    usageFrequencyRating
  ) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itemId]: { expectationRating, usageFrequencyRating },
    }));
  };

  const handleSubmit = async () => {
    const searchParams = new URLSearchParams(location.search);
    const isFirstTask = searchParams.get("firstTask") === "true"; // Check if firstTask query parameter is 'true'
    const isPostTask = location.pathname.includes("post-task"); // Check if the current path includes 'post-task'
    const currentTask = searchParams.get("currentTask");
    const dataToSave = {
      userID: authCtx.user.uid,
      ratings,
      isPostTask,
      currentTask,
      ts: Timestamp.now(),
    };
    try {
      // Reference to your Firestore collection
      const docRef = await addDoc(
        collection(db, "questionnaireResponses"),
        dataToSave
      );
      console.log("Document written with ID: ", docRef.id);
      // Conditionally updating based on firstTask query parameter
      if (isFirstTask && !isPostTask) {
        flowCtx.setPreTask1Completed(true);
      } else if (isFirstTask && isPostTask) {
        flowCtx.setPostTask1Completed(true);
      } else if (!isFirstTask && !isPostTask) {
        flowCtx.setPreTask2Completed(true);
      } else {
        flowCtx.setPostTask2Completed(true);
      }
      navigate("/");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Calculate the progress percentage
  const progressPercentage = useMemo(() => {
    const totalItems = topologyJSON.reduce(
      (acc, curr) => acc + curr.intention_list.length,
      0
    );
    const completedItems = Object.values(ratings).filter(
      (rating) =>
        rating.expectationRating !== undefined &&
        rating.usageFrequencyRating !== undefined
    ).length;
    return (completedItems / totalItems) * 100;
  }, [ratings]);

  // Check if all questions have been answered
  const allQuestionsAnswered = useMemo(() => {
    return progressPercentage === 100;
  }, [progressPercentage]);

  return (
    <div className="flex flex-row bg-[#2F4454] items-center">
      <div className="flex flex-col w-[30%] h-screen">
        <div
          className="bg-[#142838] max-h-screen overflow-y-auto scrollbar 
                scrollbar-thumb-[#ffffff] scrollbar-thumb-rounded-full text-[14px] 
                pb-10 pt-6 sticky top-0 scrollbar-w-2 scrollbar-h-4"
        >
          {topologyJSON.map((item, index) => (
            <IntentionBox
              selectedItem={selectedItem}
              key={index}
              title={item.intention_type}
              intentionList={item.intention_list}
              onSelectItem={handleSelectItem}
              ratings={ratings}
            />
          ))}
        </div>
        <div className="text-white p-4 bg-[#142838] flex flex-col space-y-2">
          <label>Progress</label>
          <ProgressBar completed={Number(progressPercentage.toFixed(0))} />
        </div>
      </div>
      <div className="w-full flex justify-center mr-16">
        {selectedItem && (
          <Questions
            itemId={selectedItem}
            ratings={ratings[selectedItem]}
            onRatingsChange={handleRatingsChange}
          />
        )}
      </div>
      {allQuestionsAnswered && (
        <div className="flex flex-row justify-around mt-16 border-2">
          <button
            className="bg-white px-6 py-2 rounded-2xl fixed bottom-4 right-4"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
      {showInstructions && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
          <InstructionsPopUp
            instructionText={instructionText}
            setShowInstructions={setShowInstructions}
          />
        </div>
      )}
      ;
    </div>
  );
};

export default QuestionnnaireMain;
