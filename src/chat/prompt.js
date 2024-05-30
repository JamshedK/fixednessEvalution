import star_icon from "../assets/common/star_icon.svg";
import star_filled_icon from "../assets/common/star_filled_icon.svg";
import more_icon from "../assets/chatbox/more_icon.svg";
import comment_icon from "../assets/chatbox/comment_icon.svg";
import { useContext, useEffect, useState } from "react";
import TaskContext from "../context/task-context";
import RatePrompt from "./RatePrompt";

const Prompt = (props) => {
  const promptID = props.promptID;
  const role = props.role;
  const isStarred = props.ratingID != null;
  const taskCtx = useContext(TaskContext);
  const needsRating = !isStarred && role === "assistant";

  const handleStartClicked = () => {
    taskCtx.setShowRatingPopUp(true);
    taskCtx.setPromptIDForRating(promptID);
  };

  return (
    <div
      className={
        "flex flex-row space-x-4 align-top p-4 pl-[10%] " + props.bgColor
      }
    >
      <div className="w-full xl:max-w-[80%] lg:max-w-[80%]">
        <div className="inline-flex  w-full space-x-4">
          <img className="w-9 h-9" src={props.profile_image} />
          <p className="text-black  w-full leading-7">{props.text}</p>
        </div>
      </div>
      {role === "assistant" && (
        <div className="flex flex-col items-center">
          <div className="flex items ml">
            <button onClick={handleStartClicked}>
              <img
                className="w-7  ml-4"
                src={isStarred ? star_filled_icon : star_icon}
              />
            </button>
          </div>
          {needsRating && (
            <label className="text-red flex items-center text-[12px] ml-4">
              Click to rate
            </label>
          )}
          {!needsRating && (
            <label className="text-green flex items-center text-[12px] ml-4">
              Rated
            </label>
          )}
        </div>
      )}
      {taskCtx.showRatingPopUp && role === "assistant" && (
        <div className="fixed top-0 z-10 left-0 w-screen h-screen flex items-center justify-center">
          <RatePrompt promptID={taskCtx.promptIDForRating} />
        </div>
      )}
    </div>
  );
};

export default Prompt;
