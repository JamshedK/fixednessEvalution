import { useContext, useState, useMemo, useEffect } from "react";
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { auth, db } from "../firebase-config";
import IntentionBox from "./IntentionBox";
import topologyJSON from "../topology.json";
import IntentionTypeItem from "./IntentionTypeItem";
import ProgressBar from "@ramonak/react-progress-bar";
import Questions from "./PreTaskQuestions";
import { FlowContext } from "../context/flow-context";
import { useNavigate } from "react-router-dom";
import InstructionsPopUp from "./InstructionsPopUp";
import { useLocation } from "react-router-dom";
import IntroPage from "./IntroPage";

let instructionText =
  "Read the intention on the left, answer the two survey questions below it, then click the next intention for more questions. Complete all listed intentions.";

const QuestionnnaireMain = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ratings, setRatings] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [localTopology, setLocalTopology] = useState(topologyJSON);
  const [startedTs, setStartedTs] = useState(Timestamp.now());
  const [showIntroPage, setShowIntroPage] = useState(false);

  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get location object

  // check if current task is search, if it is, change the instruction text
  const currentTask = new URLSearchParams(location.search).get("currentTask");
  if (currentTask === "search") {
    instructionText =
      "Please reflect on your personal experience of using search engines (e.g. Google, Bing), and answer the following questions (see left sidebar).";
  } else if (currentTask === "virtual-asssistant") {
    instructionText =
      "Please reflect on your personal experience of using virtual assistants (e.g. Siri, Cortana, Google Assistant, Amazon Alexa), and answer the following questions (see left sidebar).";
  }
  // For showing the intro page
  useEffect(() => {
    const currentTask = new URLSearchParams(location.search).get("currentTask");
    if (currentTask !== "chat") {
      setShowIntroPage(true);
    }
  }, []);

  // get ratings from firebase
  useEffect(() => {
    const fetchData = async () => {
      const task = new URLSearchParams(location.search).get("currentTask");
      try {
        const collectionRef = collection(db, "questionnaireResponses");
        const q = query(
          collectionRef,
          where("isPostTask", "==", false),
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

  useEffect(() => {
    const topologyCopy = localTopology.map((section) => ({
      ...section,
      intention_list: [...section.intention_list],
    }));
    const randomSectionIndex = 3; // Attention check needs to be in section index 3
    const randomPos = Math.floor(
      Math.random() * topologyCopy[randomSectionIndex].intention_list.length
    );
    const repeatedIntention = {
      ...topologyCopy[randomSectionIndex].intention_list[randomPos],
      short_text:
        topologyCopy[randomSectionIndex].intention_list[randomPos].short_text +
        " 2",
      attentionCheck: true,
    };

    topologyCopy[randomSectionIndex].intention_list.splice(
      randomPos + 1,
      0,
      repeatedIntention
    );
    setLocalTopology(topologyCopy);
  }, []);

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
      startedTs: startedTs,
      completedTs: Timestamp.now(),
    };
    console.log(dataToSave);
    try {
      // Reference to your Firestore collection
      const docRef = await addDoc(
        collection(db, "questionnaireResponses"),
        dataToSave
      );
      console.log("Document written with ID: ", docRef.id);
      const flowState = searchParams.get("flowState");
      flowCtx.updateFlowState(flowState);
      navigate("/");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Calculate the progress percentage
  const progressPercentage = useMemo(() => {
    var totalItems = localTopology.reduce(
      (acc, curr) => acc + curr.intention_list.length,
      0
    );
    // totalItems += 1; // Add one for the attention check
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
    <div>
      {showIntroPage ? (
        <IntroPage
          currentTask={currentTask}
          setShowIntroPage={setShowIntroPage}
        />
      ) : (
        <>
          <div className="flex flex-row bg-[#FFFFFF] items-center pt-4">
            <div className="flex flex-col w-[30%] h-screen">
              <div
                className="bg-[#e3e3e3] max-h-screen overflow-y-auto scrollbar 
                scrollbar-thumb-[#d58d8d] scrollbar-thumb-rounded-full text-[14px] 
                sticky top-0 scrollbar-w-2 scrollbar-h-4"
              >
                {localTopology.map((item, index) => (
                  <IntentionBox
                    selectedItem={selectedItem}
                    key={index}
                    index={index}
                    title={item.intention_type}
                    intentionList={item.intention_list}
                    onSelectItem={handleSelectItem}
                    ratings={ratings}
                  />
                ))}
              </div>
              <div className="text-black p-4 bg-[#white] flex flex-col space-y-2 pt-2 border-r-8 border-[#e3e3e3]">
                <label>Progress</label>
                <ProgressBar
                  completed={Number(progressPercentage.toFixed(0))}
                />
              </div>
            </div>
            <div className="w-full flex justify-center mr-16 overflow-auto">
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
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionnnaireMain;
