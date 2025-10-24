import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/auth-context";
import checkbox_icon from "../assets/common/checkbox.svg";
import show_more_icon from "../assets/common/show_more.svg";
import circle_icon from "../assets/common/circle_icon.svg";

const AdminDashboard = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const adminTasks = [
    {
      title: "Manage Tasks",
      path: "/admin/insert-tasks",
      description: "Add, edit, or view research tasks",
    },
    {
        title: "Manage Session Experience Survey", 
        path: "/admin/experience-survey",
        description: "Create or modify the session experience survey",
    },
    {
        title: "Manage Demography Survey", 
        path: "/admin/demography-survey",
        description: "Create or modify demographic survey questions",
    },
    {
        title: "Manage Topology", 
        path: "/admin/topology",
        description: "Create or modify intention topology categories and intentions",
    }
  ];

  const handleNavigation = (task) => () => {
    navigate(task.path);
  };

  const handleLogout = () => {
    authCtx.logout();
    navigate("/admin/login");
  };

  return (
    <div className="w-screen h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {authCtx.adminInfo?.email || 'Administrator'}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Switch to Participant View
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 px-4 py-8">
        <div className="task-list w-[50%] max-w-2xl overflow-y-auto">
        <h2 className="text-gray-800 text-[24px] font-semibold text-center my-6">
          Admin Dashboard
        </h2>
        {adminTasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-stretch bg-white p-6 text-gray-800 w-full 
                    border border-gray-200 rounded-lg mb-4 shadow-sm transition-all
                    hover:cursor-pointer hover:shadow-md hover:border-blue-300"
            onClick={handleNavigation(task)}
          >
            <div className="w-full flex flex-col">
              <span className="text-[16px] font-medium mb-1">
                {task.title}
              </span>
              <span className="text-[14px] text-gray-600">
                {task.description}
              </span>
            </div>
            <span className="ml-4">
              <img
                src={show_more_icon}
                alt="Access"
                className="h-5 w-5 text-blue-600"
              />
            </span>
          </div>
        ))}
        </div>

        {/* Footer Instructions */}
        <div className="text-gray-600 text-[14px] mt-8 w-[50%] max-w-2xl text-center">
          <p>
            Welcome to the Research Assistant Admin Panel. Use the options above to manage 
            study tasks, view participant data, and configure system settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
