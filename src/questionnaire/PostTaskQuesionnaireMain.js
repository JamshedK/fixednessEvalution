import { useContext, useState, useMemo, useEffect } from "react";
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import IntentionBox from "./IntentionBox";
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
  const [localTopology, setLocalTopology] = useState([]);
  const [topologyLoading, setTopologyLoading] = useState(true);
  const [startedTs, setStartedTs] = useState(Timestamp.now());
  const authCtx = useContext(AuthContext);
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get location object

  // Load topology data from Firebase admin/topology
  useEffect(() => {
    const fetchTopologyData = async () => {
      try {
        const docRef = doc(db, "admin", "topology");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const topology = data.topology || [];
          setLocalTopology(topology);
        }
      } catch (error) {
        console.error("Error fetching topology data:", error);
        // Fallback to empty state
        setLocalTopology([]);
      } finally {
        setTopologyLoading(false);
      }
    };

    fetchTopologyData();
  }, []);

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

  useEffect(() => {
    // Only run this effect when topology has loaded and is not empty
    if (topologyLoading || localTopology.length === 0) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const isFirstTask = searchParams.get("firstTask") === "true";
    if (isFirstTask) {
      // return if postTask1 is completed
      if (flowCtx.postTask1Completed) {
        return;
      }
    } else {
      // return if postTask2 is completed
      if (flowCtx.postTask2Completed) {
        return;
      }
    }
    
    const topologyCopy = localTopology.map((section) => ({
      ...section,
      intention_list: [...section.intention_list],
    }));
    
    // Make sure we have enough sections for the attention check
    if (topologyCopy.length > 3) {
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
    }
  }, [localTopology, topologyLoading, flowCtx.postTask1Completed, flowCtx.postTask2Completed]);

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
      startedTs: startedTs,
      completedTs: Timestamp.now(),
    };
    try {
      // Reference to your Firestore collection
      const docRef = await addDoc(
        collection(db, "questionnaireResponses"),
        dataToSave
      );
      console.log("Document written with ID: ", docRef.id);
      // Conditionally updating based on firstTask query parameter
      const flowState = searchParams.get("flowState");
      flowCtx.updateFlowState(flowState);
      navigate("/");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Calculate the progress percentage
  const progressPercentage = useMemo(() => {
    if (topologyLoading || localTopology.length === 0) {
      return 0;
    }
    
    const totalItems = localTopology.reduce(
      (acc, curr) => acc + curr.intention_list.length,
      0
    );
    
    if (totalItems === 0) {
      return 0;
    }
    
    const completedItems = Object.values(ratings).filter(
      (rating) => rating.expectationRating !== undefined
    ).length;
    
    return (completedItems / totalItems) * 100;
  }, [ratings, localTopology, topologyLoading]);

  // Check if all questions have been answered
  const allQuestionsAnswered = useMemo(() => {
    return progressPercentage === 100;
  }, [progressPercentage]);

  if (topologyLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="text-lg">Loading topology data...</div>
      </div>
    );
  }

  if (localTopology.length === 0) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="text-lg text-red-600">No topology data found. Please contact the administrator.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row bg-[#FFFFFF] items-center">
      <div className="flex flex-col w-[30%] h-screen pt-4">
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
