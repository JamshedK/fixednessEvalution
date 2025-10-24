import React, { useState } from "react";
import { sanitizeFormTasks } from "./shared/taskUtils";

const FormMode = ({ onSave, isLoading }) => {
  const [count, setCount] = useState(3);
  const [formTasks, setFormTasks] = useState([]);

  const initFormTasks = () => {
    const n = Math.max(1, Math.min(100, parseInt(count || 0, 10)));
    setFormTasks(Array.from({ length: n }, () => ({ title: "", description: "" })));
  };

  const updateFormTask = (idx, field, value) => {
    setFormTasks((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const sanitized = sanitizeFormTasks(formTasks);
    
    if (sanitized.length === 0) {
      throw new Error("Please provide at least one task title.");
    }

    await onSave(sanitized);
    setFormTasks([]); // Clear form on success
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Tasks</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Number of Tasks:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-24 p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={initFormTasks}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Generate Form
          </button>
        </div>
      </div>

      {formTasks.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-6">
            {formTasks.map((task, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Task {idx + 1}</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Title:
                  </label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateFormTask(idx, "title", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter task title..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    value={task.description}
                    onChange={(e) => updateFormTask(idx, "description", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Enter task description..."
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isLoading ? "Saving..." : "Save Tasks"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FormMode;
