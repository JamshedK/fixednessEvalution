import React, { useState, useContext } from "react";
import AuthContext from "../../context/auth-context";
import FormMode from "./FormMode";
import JsonMode from "./JsonMode";
import ViewMode from "./ViewMode";
import { saveSurveyQuestions } from "./shared/surveyUtils";



const ManageExperienceSurvey = () => {
  const [mode, setMode] = useState("form");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const handleSave = async (items) => {
    setStatus(null);
    setIsLoading(true);
    
    try {
      await saveSurveyQuestions(items, authCtx);
      setStatus({ type: "success", message: `Saved ${items.length} questions to admin/experienceSurvey.` });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: `Failed to save questions: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Experience Survey</h1>
          <p className="text-gray-600">Create and manage session experience survey questions</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Mode</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setMode("form")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "form"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Form Mode
            </button>
            <button
              onClick={() => setMode("json")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "json"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              JSON Mode
            </button>
            <button
              onClick={() => setMode("view")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "view"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              View Only
            </button>
          </div>
        </div>

        {/* Render appropriate mode component */}
        {mode === "form" && (
          <FormMode 
            onSave={handleSave} 
            isLoading={isLoading} 
          />
        )}
        
        {mode === "json" && (
          <JsonMode 
            onSave={handleSave} 
            isLoading={isLoading} 
          />
        )}

        {mode === "view" && <ViewMode />}

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

export default ManageExperienceSurvey;
