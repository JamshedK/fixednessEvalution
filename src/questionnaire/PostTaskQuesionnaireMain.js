import { useContext, useState, useMemo, useEffect } from "react";
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import IntentionBox from "./IntentionBox";
import topologyJSON from "./../topology.json";
import IntentionTypeItem from "./IntentionTypeItem";
import ProgressBar from "@ramonak/react-progress-bar";
import PostTaskQuestions from "./PostTaskQuestions";
import { FlowContext } from "../context/flow-context";
import { useNavigate } from "react-router-dom";
import InstructionsPopUp from "./InstructionsPopUp";
import { useLocation } from "react-router-dom";

const instructionText =
  "Read the intention on the left, then answer the two survey questions below it. Click the next intention in the sidebar for new questions. Complete all intentions listed.";
const PostTaskQuestionnaireMain = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ratings, setRatings] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);

  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get location object

  // get ratings from firebase`
  useEffect(() => {
    const fetchData = async () => {
      const task = new URLSearchParams(location.search).get("currentTask");
      try {
        const collectionRef = collection(db, "questionnaireResponses");
        const q = query(
          collectionRef,
          where("isPostTask", "==", true),
          where("userID", "==", authCtx.user.uid),
          where("currentTask", "==", task)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setRatings(data.ratings);
        });
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    };
    if (authCtx.user) {
      fetchData();
    }
  }, [authCtx]);

  const handleSelectItem = (itemId) => {
    setSelectedItem(itemId);
  };

  const handleRatingsChange = (itemId, expectationRating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itemId]: { expectationRating },
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
      (rating) => rating.expectationRating !== undefined
    ).length;
    return (completedItems / totalItems) * 100;
  }, [ratings]);

  // Check if all questions have been answered
  const allQuestionsAnswered = useMemo(() => {
    return progressPercentage === 100;
  }, [progressPercentage]);

  return (
    <div className="flex flex-row bg-[#FFFFFF] items-center">
      <div className="flex flex-col w-[30%] h-screen pt-4">
        <div
          className="bg-[#e3e3e3] max-h-screen overflow-y-auto scrollbar 
                scrollbar-thumb-[#d58d8d] scrollbar-thumb-rounded-full text-[14px] 
                sticky top-0 scrollbar-w-2 scrollbar-h-4"
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
        <div className="text-black p-4 bg-[#white] flex flex-col space-y-2 pt-2 border-r-8 border-[#e3e3e3]">
          <label>Progress</label>
          <ProgressBar completed={Number(progressPercentage.toFixed(0))} />
        </div>
      </div>
      <div className="w-full flex justify-center mr-16">
        {selectedItem && (
          <PostTaskQuestions
            itemId={selectedItem}
            ratings={ratings[selectedItem]}
            onRatingsChange={handleRatingsChange}
          />
        )}
      </div>
      {allQuestionsAnswered && (
        <div className="flex flex-row justify-around mt-16 border-2">
          <button
            className="bg-[#e3e3e3] px-6 py-2 rounded-2xl fixed bottom-4 right-4"
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

export default PostTaskQuestionnaireMain;
