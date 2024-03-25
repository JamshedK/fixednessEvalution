import { useState, useEffect, useContext } from "react";
import TaskContext from "../context/task-context";
import { useLocation } from "react-router-dom";

const PostTaskQuestions = ({ itemId, ratings, onRatingsChange }) => {
  const taskCtx = useContext(TaskContext);
  const location = useLocation();
  const isPostTask = location.pathname.includes("post-task"); // Check if the current path includes 'post-task'

  const instructionString = isPostTask
    ? "Based on your experience in the session you just completed, please classify the intention described above into one of the following categories."
    : "Based on your Expectation, please classify the intention described above into one of the following categories.";

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

  // Initialize states with the passed ratings if available
  const [expectationRating, setExpectationRating] = useState(
    ratings?.expectationRating || ""
  );

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
      className="flex flex-col py-12 px-16 h-fit rounded-xl max-w-[50rem] 
        max-h-[85%] overflow-auto space-y-4 text-[18px] text-black"
    >
      <div className="p-4 text-start flex flex-row space-x-2">
        <span className="font-bold">Intention: </span>
        <span className="">{itemId}</span>
      </div>
      <div className="bg-[#e3e3e3] py-12 px-16">
        <h1 className="text-[20px] mb-5">{instructionString}</h1>
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

export default PostTaskQuestions;
