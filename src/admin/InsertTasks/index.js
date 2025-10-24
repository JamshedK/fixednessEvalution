import React, { useState, useContext } from "react";
import AuthContext from "../../context/auth-context";
import FormMode from "./FormMode";
import PasteMode from "./PasteMode";
import ViewMode from "./ViewMode";
import { saveTasksList } from "./shared/taskUtils";

const InsertTasks = () => {
  const [activeMode, setActiveMode] = useState("form");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const handleSave = async (items) => {
    setStatus(null);
    setIsLoading(true);
    
    try {
      await saveTasksList(items, authCtx);
      setStatus({ type: "success", message: `Saved ${items.length} tasks to admin/tasks.` });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: `Failed to save tasks: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Insert Tasks</h1>
          <p className="text-gray-600">Add new tasks for participants.</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Mode</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveMode("form")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeMode === "form"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Form Mode
            </button>
            <button
              onClick={() => setActiveMode("paste")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeMode === "paste"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Paste Mode
            </button>
            <button
              onClick={() => setActiveMode("view")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeMode === "view"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              View Only
            </button>
          </div>
        </div>

        {/* Render appropriate mode component */}
        {activeMode === "form" && (
          <FormMode 
            onSave={handleSave} 
            isLoading={isLoading} 
          />
        )}
        
        {activeMode === "paste" && (
          <PasteMode 
            onSave={handleSave} 
            isLoading={isLoading} 
          />
        )}

        {activeMode === "view" && <ViewMode />}

        {/* Status Messages */}
        {status && (
          <div className={`rounded-lg p-4 mb-6 ${
            status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsertTasks;
