import { useState, useEffect, useContext } from "react";
import TaskContext from "../context/task-context";
import { useLocation } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import AuthContext from "../context/auth-context";
import { db } from "../firebase-config";

const Questions = ({ itemId, ratings, onRatingsChange }) => {
  // Initialize states with the passed ratings if available
  const [expectationRating, setExpectationRating] = useState(
    ratings?.expectationRating || ""
  );
  const [usageFrequencyRating, setUsageFrequencyRating] = useState(
    ratings?.usageFrequencyRating || ""
  );
  const taskCtx = useContext(TaskContext);
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const isPostTask = location.pathname.includes("post-task"); // Check if the current path includes 'post-task'
  let service = "";
  const urlParams = new URLSearchParams(window.location.search);
  const currentTask = urlParams.get("currentTask");

  if (currentTask === "chat") {
    service = "ChatGPT";
  } else if (currentTask === "virtual-asssistant") {
    service = "Virtual Assistant";
  } else {
    service = "Search Engine";
  }

  useEffect(() => {
    const checkAttention = async () => {
      if (itemId.includes("2")) {
        const expectedRating = `${service}  may be able to partially fulfill the intention if/once an effective query/prompt is successfully formulated.`;
        const expectedUsageFrequency = usageFrequency[4];
        const currentTask = urlParams.get("currentTask");
        if (expectationRating !== expectedRating && expectationRating !== "") {
          alert(
            "Uh-oh, wrong pick! Please pay closer attention to maintain data accuracy."
          );
          // add to firebase that this user selected the incorrect option
          await addDoc(collection(db, "attentionFails"), {
            task: currentTask,
            survey: "pre-task",
            question: instructionString,
            intention: itemId,
            expectedRating: expectedRating,
            selectedRating: expectationRating,
            userID: authCtx.user.uid,
            ts: serverTimestamp(),
          });
        }
        if (
          usageFrequencyRating !== expectedUsageFrequency &&
          usageFrequencyRating !== ""
        ) {
          alert(
            "Uh-oh, wrong pick! Please pay closer attention to maintain data accuracy."
          );
          // add to firebase that this user selected the incorrect option
          await addDoc(collection(db, "attentionFails"), {
            task: currentTask,
            survey: "pre-task",
            question: instructionString,
            intention: itemId,
            expectedRating: expectedUsageFrequency,
            selectedRating: usageFrequencyRating,
            userID: authCtx.user.uid,
            ts: serverTimestamp(),
          });
        }
      }
    };
    checkAttention();
  }, [expectationRating, usageFrequencyRating]);

  var instructionString = isPostTask
    ? "Based on your experience in the session you just completed, please classify the intention described above into one of the following categories."
    : "Based on your Expectation, please classify the intention described above into one of the following categories.";
  var instructionString2 = undefined;
  if (itemId.includes("2")) {
    instructionString =
      "If you are reading this message, for this specific question, please carefully select the third option from the list below to verify your attention to detail.";
    instructionString2 =
      "If you are reading this message, for this specific question, please select the last option from the list below";
    // remove the text attention check from the itemId
  }

  const expectationList = [
    `${service} can always fully fulfill the intention`,
    `${service}  may be able to fully fulfill the intention if/once an effective query/prompt is successfully formulated (e.g. after several rounds of query/prompt modifications).`,
    `${service}  may be able to partially fulfill the intention if/once an effective query/prompt is successfully formulated.`,
    `${service}  is unlikely to fulfill the intention described above at all.`,
  ];

  const usageFrequency = [
    "Never or Rarely Used: less than once a month",
    "Infrequently Used: about once a month",
    "Moderately Used: engage with the system on a weekly basis",
    "Frequently Used: use the system several times a week",
    "Heavily Used: use the system daily or almost daily",
  ];

  // Update local state when the passed ratings change
  useEffect(() => {
    // Update local state based on the presence of ratings or reset to initial state if ratings are undefined
    setExpectationRating(ratings?.expectationRating ?? "");
    setUsageFrequencyRating(ratings?.usageFrequencyRating ?? "");
  }, [ratings]);

  // Update parent state when either rating changes
  const handleRatingChange = () => {
    if (expectationRating !== "" && usageFrequencyRating !== "") {
      onRatingsChange(itemId, expectationRating, usageFrequencyRating);
    }
  };

  // Call handleRatingChange whenever the ratings change
  useEffect(() => {
    handleRatingChange();
  }, [expectationRating, usageFrequencyRating]);
  //   console.log(`Expectation rating: ${expectationRating}`);

  return (
    <div
      className="flex flex-col py-12 px-16 h-fit rounded-xl max-w-[50rem] 
        max-h-[85%] overflow-auto space-y-4 lg:text-[16px] text-[18px] text-black"
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
      {!isPostTask && (
        <div className="bg-[#e3e3e3] py-6 px-16">
          {instructionString2 === undefined && (
            <h1 className="text-[20px] lg:text-[16px] mb-5">
              In your prior interaction experiences, how often did you try to
              use {service} to fulfill the intention described above?
            </h1>
          )}
          {instructionString2 !== undefined && (
            <h1 className="text-[20px] lg:text-[16px] mb-5">
              {instructionString2}
            </h1>
          )}
          {usageFrequency.map((item, index) => (
            <div key={index} className="flex flex-row space-x-4 items-center">
              <input
                type="radio"
                id={`usage-${index}`}
                name="usageFrequencyRating"
                value={item}
                checked={usageFrequencyRating === item}
                onChange={(e) => setUsageFrequencyRating(e.target.value)}
                className="w-4 h-4 form-radio bg-white"
              />
              <label htmlFor={`usage-${index}`}>{item}</label>
            </div>
          ))}
        </div>
      )}
      {/* TODO: Implement these if you get time*/}
      {/* <div className="flex flex-row justify-around mt-16">
        <button
          className="bg-[#e3e3e3] px-6 py-2 rounded-2xl"
          //   onClick={handleSubmit}
        >
          {"< Previous"}
        </button>
        <button
          className="bg-[#e3e3e3] px-6 py-2 rounded-2xl"
          //   onClick={handleSubmit}
        >
          {"Next >"}
        </button>
      </div> */}
    </div>
  );
};

export default Questions;
