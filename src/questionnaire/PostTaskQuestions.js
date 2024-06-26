import { useState, useEffect, useContext } from "react";
import TaskContext from "../context/task-context";
import { useLocation } from "react-router-dom";
import { addDoc } from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";
import { collection, serverTimestamp } from "firebase/firestore";

const PostTaskQuestions = ({ itemId, ratings, onRatingsChange }) => {
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  // Initialize states with the passed ratings if available
  const [expectationRating, setExpectationRating] = useState(
    ratings?.expectationRating || ""
  );

  useEffect(() => {
    const checkAttention = async () => {
      if (itemId.includes("2")) {
        const service = location.search.includes("chat")
          ? "ChatGPT"
          : "Search Engine";
        const expectedRating = `${service} can always fully fulfill the intention`;
        const currentTask = urlParams.get("currentTask");
        if (expectationRating !== expectedRating && expectationRating !== "") {
          alert(
            "Uh-oh, wrong pick! Please pay closer attention to maintain data accuracy."
          );
          // add to firebase that this user selected the incorrect option
          await addDoc(collection(db, "attentionFails"), {
            task: currentTask,
            survey: "post-task",
            question: instructionString,
            intention: itemId,
            expectedRating: expectedRating,
            selectedRating: expectationRating,
            userID: authCtx.user.uid,
            ts: serverTimestamp(),
          });
        }
      }
    };
    checkAttention();
  }, [expectationRating]);

  const isPostTask = location.pathname.includes("post-task"); // Check if the current path includes 'post-task'

  var instructionString = isPostTask ? (
    <span>
      <strong>
        Based on your experience in the session you just completed
      </strong>
      , please classify the intention described above into one of the following
      categories.
    </span>
  ) : (
    "Based on your Expectation, please classify the intention described above into one of the following categories."
  );

  if (itemId.includes("2")) {
    instructionString =
      "If you are reading this message, for this specific question, please carefully select the first option from the list below to verify your attention to detail.";
    // remove the text attention check from the itemId
  }

  let service = "";
  const urlParams = new URLSearchParams(window.location.search);
  const currentTask = urlParams.get("currentTask");
  if (currentTask === "chat") {
    service = "ChatGPT";
  } else {
    service = "Search Engine";
  }

  const expectationList = [
    `${service} can always fully fulfill the intention`,
    `${service}  may be able to fully fulfill the intention if/once an effective query/prompt is successfully formulated (e.g. after several rounds of query/prompt modifications).`,
    `${service}  may be able to partially fulfill the intention if/once an effective query/prompt is successfully formulated.`,
    `${service}  is unlikely to fulfill the intention described above at all.`,
  ];

  // Update local state when the passed ratings change
  useEffect(() => {
    // Update local state based on the presence of ratings or reset to initial state if ratings are undefined
    setExpectationRating(ratings?.expectationRating ?? "");
  }, [ratings]);

  // Update parent state when either rating changes
  const handleRatingChange = () => {
    if (expectationRating !== "") {
      onRatingsChange(itemId, expectationRating);
    }
  };

  // Call handleRatingChange whenever the ratings change
  useEffect(() => {
    handleRatingChange();
  }, [expectationRating]);
  //   console.log(`Expectation rating: ${expectationRating}`);

  return (
    <div
      className="flex flex-col py-6 px-16 h-fit rounded-xl max-w-[50rem] 
        max-h-[85%] overflow-auto space-y-4 text-[18px] lg:text-[16px] text-black"
    >
      <div className="p-4 text-start flex flex-row space-x-2">
        <span className="font-bold">Intention: </span>
        <span className="">{itemId}</span>
      </div>
      <div className="bg-[#e3e3e3] py-6 px-16">
        <h1 className="text-[20px] lg:text-[16px] mb-5">{instructionString}</h1>
        {expectationList.map((item, index) => (
          <div key={index} className="flex flex-row space-x-4 items-start">
            <input
              type="radio"
              id={`expectation-${index}`}
              name="expectationRating"
              value={item}
              checked={expectationRating === item}
              onChange={(e) => setExpectationRating(e.target.value)}
              className="w-4 h-4 form-radio bg-white mt-[6px]"
            />
            <label htmlFor={`expectation-${index}`}>{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTaskQuestions;
