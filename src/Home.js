import React from "react";
import checkbox_icon from "./assets/common/checkbox.svg";
import show_more_icon from "./assets/common/show_more.svg";
import circle_icon from "./assets/common/circle_icon.svg";
import { FlowContext } from "./context/flow-context";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

const Home = ({ onSelectItem }) => {
  const flowCtx = useContext(FlowContext);
  const navigate = useNavigate();

  const tasks = [
    {
      title: "Demography Survey",
      completed: flowCtx.demographyCompleted,
      path: "/demography",
    },
    {
      title: "Pre-task Questionnaire 1",
      completed: flowCtx.preTask1Completed,
      path: "/pre-task",
    },
    { title: "Task 1: Chat", completed: flowCtx.task1Completed, path: "/chat" },
    {
      title: "Post-task Questionnaire 1",
      completed: flowCtx.postTask1Completed,
      path: "/pre-task",
    },
    {
      title: "Pre-task Questionnaire 2",
      completed: flowCtx.preTask2Completed,
      path: "/pre-task",
    },
    {
      title: "Task 2: Search",
      completed: flowCtx.task2Completed,
      path: "/search",
    },
    {
      title: "Post-task Questionnaire 2",
      path: "/pre-task",
      completed: flowCtx.postTask2Completed,
    },
  ];

  return (
    <div className="flex justify-center w-screen h-screen items-center ">
      <div className="task-list w-[30%]">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#142838] p-4 text-white w-full 
                        border-b-[1px] border-[#2F4454] text-[14px] hover:cursor-pointer"
            onClick={() => navigate(task.path)}
          >
            <span className="text-green-600">
              {task.completed ? (
                <img
                  src={checkbox_icon}
                  alt="Completed"
                  className="h-5 w-5 text-green-600"
                />
              ) : (
                <img
                  src={circle_icon}
                  alt="Not Completed"
                  className="h-5 w-5 text-green-600"
                />
              )}
            </span>
            <span
              className={`${task.completed ? "font-bold" : "ml-4"} w-full px-4`}
            >
              {task.title}
            </span>
            <span>
              <button>
                <img
                  src={show_more_icon}
                  alt="Show More"
                  className="h-5 w-5 text-green-600"
                />
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
