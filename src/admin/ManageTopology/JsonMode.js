import React, { useState } from "react";
import { parseInput } from "./shared/topologyUtils";

const JsonMode = ({ onSave, isLoading }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState("");

  const loadExistingTopology = async () => {
    try {
      // Import the existing topology.json file
      const response = await import("../../topology.json");
      const existingData = response.default;
      setJsonInput(JSON.stringify(existingData, null, 2));
      setParseError("");
    } catch (err) {
      setParseError("Failed to load existing topology data: " + err.message);
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
        setParseError("No valid topology items found in the input");
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
    "intention_type": "Find information",
    "intention_list": [
      {
        "short_text": "Find a known item or site",
        "long_text": "searching or asking for an item (e.g., a bag, book, name of a restaurant or celebrity), website or information source that you were familiar with in advance."
      },
      {
        "short_text": "Find items sharing a named characteristic",
        "long_text": "finding items or information with something in common."
      }
    ]
  },
  {
    "intention_type": "Problem-solving",
    "intention_list": [
      {
        "short_text": "Tutorial request",
        "long_text": "step-by-step instructions or guidance."
      },
      {
        "short_text": "Decision support",
        "long_text": "assistance in decision-making through insights, comparisons of options and/or outcomes, discussions, and evaluations."
      }
    ]
  }
]`;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">JSON Mode</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Paste or type JSON array of topology data. Each item should have:
            </p>
            <ul className="text-xs text-gray-500 ml-4 list-disc space-y-1">
              <li><code>intention_type</code>: Category name (string)</li>
              <li><code>intention_list</code>: Array of intentions with:</li>
              <li className="ml-4"><code>short_text</code>: Brief description (string)</li>
              <li className="ml-4"><code>long_text</code>: Detailed description (string)</li>
            </ul>
          </div>
          <button
            onClick={loadExistingTopology}
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
          {isLoading ? "Saving..." : "Parse and Save Topology Data"}
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
