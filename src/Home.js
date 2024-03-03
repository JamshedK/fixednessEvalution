import React from "react";
import checkbox_icon from "./assets/common/checkbox.svg";
import show_more_icon from "./assets/common/show_more.svg";
import circle_icon from "./assets/common/circle_icon.svg";
import { FlowContext } from "./context/flow-context";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import TaskContext from "./context/task-context";

const Home = ({ onSelectItem }) => {
  const flowCtx = useContext(FlowContext);
  const taskCtx = useContext(TaskContext);
  const navigate = useNavigate();

  const tasks = [
    {
      title: "Demography Survey",
      completed: flowCtx.demographyCompleted,
      path: "/demography",
      canNavigate: true,
    },
    {
      title: "Pre-task Questionnaire 1",
      completed: flowCtx.preTask1Completed,
      path: "/pre-task?firstTask=true",
      canNavigate: flowCtx.demographyCompleted,
    },
    {
      title: `Task 1: ${taskCtx.tasks.firstTask}`,
      completed: flowCtx.task1Completed,
      path: `/${taskCtx.tasks.firstTask}`,
      canNavigate: flowCtx.preTask1Completed,
    },
    {
      title: "Post-task Questionnaire 1",
      completed: flowCtx.postTask1Completed,
      path: "/post-task?firstTask=true",
      canNavigate: flowCtx.task1Completed,
    },
    {
      title: "Pre-task Questionnaire 2",
      completed: flowCtx.preTask2Completed,
      path: "/pre-task?firstTask=false",
      canNavigate: flowCtx.postTask1Completed,
    },
    {
      title: `Task 2: ${taskCtx.tasks.secondTask}`,
      completed: flowCtx.task2Completed,
      path: `/${taskCtx.tasks.secondTask}`,
      canNavigate: flowCtx.preTask2Completed,
    },
    {
      title: "Post-task Questionnaire 2",
      path: "/post-task?firstTask=false",
      completed: flowCtx.postTask2Completed,
      canNavigate: flowCtx.task2Completed,
    },
  ];

  const handleNavigation = (task) => () => {
    if (task.canNavigate) {
      if (task.completed) {
        alert("You have already completed this item");
        return;
      }
      navigate(task.path);
    } else {
      alert("Please complete the previous item");
    }
  };

  return (
    <div className="flex flex-col justify-center w-screen h-screen items-center ">
      <div className="task-list w-[30%]">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#142838] p-4 text-white w-full 
                        border-b-[1px] border-[#2F4454] text-[14px] hover:cursor-pointer"
            onClick={handleNavigation(task)}
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
      <div className="text-white text-[20px] mt-20 w-[30%] text-center">
        <p>
          Please, complete each item in the study in the order they are listed.
          You can only move to the next item when the current item is completed.
        </p>
      </div>
    </div>
  );
};

export default Home;
