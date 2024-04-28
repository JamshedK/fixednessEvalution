import React, { useEffect } from "react";
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
      title: "Background Survey",
      completed: flowCtx.demographyCompleted,
      path: "/demography",
      canNavigate: true,
      allowEntryUponCompletion: true,
      estimatedTime: "1-2 minutes",
    },
    {
      title: "First Task",
      isText: true,
    },
    {
      title: "Pre-task Questionnaire 1",
      completed: flowCtx.preTask1Completed,
      path: `/pre-task?firstTask=true&currentTask=${taskCtx.tasks.firstTask}`,
      canNavigate: flowCtx.demographyCompleted,
      allowEntryUponCompletion: false,
      estimatedTime: "3-4 minutes",
    },
    {
      title: `Task 1: ${taskCtx.tasks.firstTask} + Answer the Question`,
      completed: flowCtx.task1Completed,
      path: `/${taskCtx.tasks.firstTask}?firstTask=true`,
      canNavigate: flowCtx.preTask1Completed,
      allowEntryUponCompletion: false,
      estimatedTime: "15 minutes or above",
    },
    {
      title: "Post-task Questionnaire 1",
      completed: flowCtx.postTask1Completed,
      path: `/post-task?firstTask=true&currentTask=${taskCtx.tasks.firstTask}`,
      canNavigate: flowCtx.task1Completed,
      allowEntryUponCompletion: true,
      estimatedTime: "3-4 minutes",
    },
    {
      title: "Session Experience Survey 1",
      completed: flowCtx.sessionExperienceSurvey1Completed,
      path: `/session-experience?firstTask=true&currentTask=${taskCtx.tasks.firstTask}`,
      canNavigate: flowCtx.postTask1Completed,
      allowEntryUponCompletion: true,
      estimatedTime: "1-2 minutes",
    },
    {
      title: "Second Task",
      isText: true,
    },
    {
      title: "Pre-task Questionnaire 2",
      completed: flowCtx.preTask2Completed,
      path: `/pre-task?firstTask=false&currentTask=${taskCtx.tasks.secondTask}`,
      canNavigate: flowCtx.sessionExperienceSurvey1Completed,
      allowEntryUponCompletion: false,
      estimatedTime: "3-4 minutes",
    },
    {
      title: `Task 2: ${taskCtx.tasks.secondTask} + Answer the Question`,
      completed: flowCtx.task2Completed,
      path: `/${taskCtx.tasks.secondTask}?firstTask=false`,
      canNavigate: flowCtx.preTask2Completed,
      allowEntryUponCompletion: false,
      estimatedTime: "15 minutes or above",
    },
    {
      title: "Post-task Questionnaire 2",
      path: `/post-task?firstTask=false&currentTask=${taskCtx.tasks.secondTask}`,
      completed: flowCtx.postTask2Completed,
      canNavigate: flowCtx.task2Completed,
      allowEntryUponCompletion: true,
      estimatedTime: "3-4 minutes",
    },
    {
      title: "Session Experience Survey 2",
      completed: flowCtx.sessionExperienceSurvey2Completed,
      path: `/session-experience?firstTask=false&currentTask=${taskCtx.tasks.secondTask}`,
      canNavigate: flowCtx.postTask2Completed,
      allowEntryUponCompletion: true,
      estimatedTime: "1-2 minutes",
    },
    {
      title: "End of Study",
      isText: true,
    },
    {
      title: "End of Study Survey",
      completed: flowCtx.isEndOfStudySurveyCompleted,
      path: "/end",
      canNavigate: flowCtx.sessionExperienceSurvey2Completed,
      allowEntryUponCompletion: true,
      estimatedTime: "~1 minute",
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refresh = urlParams.get("refresh");
    if (refresh) {
      navigate("/home", { replace: true });
      window.location.reload();
    }
  }, [flowCtx.isLoading]);

  const handleNavigation = (task) => () => {
    if (task.canNavigate) {
      // If the task is completed and the task is pre-task or chat/search task, don't allow entry
      if (task.completed && !task.allowEntryUponCompletion) {
        alert("You have already completed this task");
        return;
      } else {
        navigate(task.path);
      }
    } else {
      alert("Please complete the previous item");
    }
  };

  return (
    <div className="flex flex-col justify-center w-screen h-screen items-center">
      <div className="task-list w-[40%] overflow-y-auto mt-10">
        {tasks.map((task, index) => {
          if (task.isText) {
            return (
              <div
                key={task.title}
                className="text-black text-[16px] text-center my-2 mr-20"
              >
                {task.title}
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="flex items-center justify-stretch bg-[#e3e3e3] p-4 text-black w-full 
                        border-b-[1px] border-[#f9f9f9] text-[14px] hover:cursor-pointer"
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
                <div className="w-full flex flex-col">
                  <span
                    className={`${task.completed ? "" : "ml-4"} w-full px-4`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[12px] ml-8">
                    Estimated duration:
                    <span className="text-red-600 ml-2">
                      {task.estimatedTime}
                    </span>
                  </span>
                </div>
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
            );
          }
        })}
      </div>
      <div className="text-black text-[20px]md:text-[14px] mt-20 md:mt-6 w-[30%] text-center">
        <p className="text-red-600 italic">Scroll to see all tasks</p>
        <p>
          Please, complete each item in the study in the order they are listed.
          You can only move to the next item when the current item is completed.
        </p>
      </div>
    </div>
  );
};

export default Home;
