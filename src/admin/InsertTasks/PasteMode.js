import React, { useState } from "react";
import { parseInput, sanitizePasteTasks, DEFAULT_PASTE_EXAMPLE } from "./shared/taskUtils";

const PasteMode = ({ onSave, isLoading }) => {
  const [raw, setRaw] = useState(DEFAULT_PASTE_EXAMPLE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const parsed = parseInput(raw);
    const sanitized = sanitizePasteTasks(parsed);

    if (sanitized.length === 0) {
      throw new Error("No valid tasks found. Use JSON or 'Title | Description'.");
    }

    await onSave(sanitized);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Paste Tasks</h2>
      <p className="text-gray-600 mb-4">
        Paste a JSON array of task objects (with title and description fields) or write one task per line using
        "Title | Description" format. This will overwrite the current task list.
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 font-mono text-sm"
          rows={8}
          placeholder="Title 1 | Description 1&#10;Title 2 | Description 2"
          spellCheck={false}
        />
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors mb-6"
        >
          {isLoading ? "Saving..." : "Save Tasks"}
        </button>
      </form>

      <div className="text-sm text-gray-700">
        <p className="font-medium mb-2">JSON example:</p>
        <pre className="bg-gray-100 p-3 rounded-lg overflow-auto text-xs">
{`[
  { "title": "Assess AI in hiring", "description": "Consider societal and ethical aspects." },
  { "title": "Balance privacy and surveillance", "description": "Legal, ethical, technological perspectives." }
]`}
        </pre>
      </div>
    </div>
  );
};

export default PasteMode;
