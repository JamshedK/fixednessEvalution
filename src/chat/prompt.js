import star_icon from "../assets/common/star_icon.svg";
import star_filled_icon from "../assets/common/star_filled_icon.svg";
import more_icon from "../assets/chatbox/more_icon.svg";
import comment_icon from "../assets/chatbox/comment_icon.svg";
import { useContext, useEffect, useState } from "react";
import TaskContext from "../context/task-context";

const Prompt = (props) => {
  const promptID = props.promptID;
  const role = props.role;
  const isStarred = props.ratingID != null;
  const taskCtx = useContext(TaskContext);

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
    </div>
  );
};

export default Prompt;
