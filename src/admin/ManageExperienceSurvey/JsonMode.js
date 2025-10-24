import React, { useState } from "react";
import { parseJsonInput, sanitizeJsonQuestions, DEFAULT_JSON_EXAMPLE } from "./shared/surveyUtils";

const JsonMode = ({ onSave, isLoading }) => {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON_EXAMPLE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const parsed = parseJsonInput(jsonInput);
    const sanitized = sanitizeJsonQuestions(parsed);

    if (sanitized.length === 0) {
      throw new Error("No valid questions found after processing.");
    }

    await onSave(sanitized);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">JSON Input</h2>
      <p className="text-gray-600 mb-4">
        Paste a JSON array of question objects. Each question should have "key", "question", 
        and optional "options" (for multiple choice) or "responseType" properties.
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 font-mono text-sm"
          rows={12}
          placeholder='[{"key": "example", "question": "Example question?", "options": ["Option 1", "Option 2"]}]'
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {isLoading ? "Saving..." : "Save Questions"}
        </button>
      </form>
    </div>
  );
};

export default JsonMode;
