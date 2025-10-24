import React, { useState } from "react";
import { parseInput } from "./shared/demographyUtils";

const JsonMode = ({ onSave, isLoading }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState("");

  const loadExistingDemography = async () => {
    try {
      // Import the existing demography.json file
      const response = await import("../../demography.json");
      const existingData = response.default;
      setJsonInput(JSON.stringify(existingData, null, 2));
      setParseError("");
    } catch (err) {
      setParseError("Failed to load existing demography data: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setParseError("");

    if (!jsonInput.trim()) {
      setParseError("Please enter JSON data");
      return;
    }

    try {
      const parsed = parseInput(jsonInput);
      
      if (parsed.length === 0) {
        setParseError("No valid questions found in the input");
        return;
      }

      await onSave(parsed);
      setJsonInput("");
    } catch (err) {
      setParseError(err.message);
    }
  };

  const exampleJson = `[
  {
    "category": "What is your age group?",
    "options": [
      "Under 18",
      "18-24",
      "25-34",
      "35-44",
      "45-54",
      "55-64",
      "65 or older"
    ],
    "required": true,
    "allowMultipleSelections": false
  },
  {
    "category": "What is your primary purpose for using ChatGPT?",
    "options": [
      "Education",
      "Work-related tasks",
      "Personal interest/hobby",
      "Entertainment",
      "Other"
    ],
    "allowMultipleSelections": true,
    "selectUpto": 2,
    "required": true
  }
]`;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">JSON Mode</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Paste or type JSON array of demography questions. Each question should have:
            </p>
            <ul className="text-xs text-gray-500 ml-4 list-disc space-y-1">
              <li><code>category</code>: Question text (string)</li>
              <li><code>options</code>: Array of answer options (array of strings)</li>
              <li><code>required</code>: Whether question is required (boolean, default: true)</li>
              <li><code>allowMultipleSelections</code>: Allow multiple answers (boolean, default: false)</li>
              <li><code>selectUpto</code>: Max selections when multiple allowed (number, optional)</li>
            </ul>
          </div>
          <button
            onClick={loadExistingDemography}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Load Existing Data
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
          {parseError && (
            <p className="mt-2 text-sm text-red-600">{parseError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Parse and Save Questions"}
        </button>
      </form>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Example JSON:</h4>
        <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-xs text-gray-700">
          {exampleJson}
        </pre>
      </div>
    </div>
  );
};

export default JsonMode;
