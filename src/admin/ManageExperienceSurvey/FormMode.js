import React, { useState } from "react";
import { sanitizeFormQuestions } from "./shared/surveyUtils";

const FormMode = ({ onSave, isLoading }) => {
  const [count, setCount] = useState(3);
  const [formQuestions, setFormQuestions] = useState([]);

  const initFormQuestions = () => {
    const n = Math.max(1, Math.min(100, parseInt(count || 0, 10)));
    setFormQuestions(Array.from({ length: n }, () => ({ 
      key: "", 
      question: "", 
      responseType: "multiple-choice",
      options: [""] 
    })));
  };

  const updateFormQuestion = (idx, field, value) => {
    setFormQuestions((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateFormQuestionOption = (qIdx, optIdx, value) => {
    setFormQuestions((prev) => {
      const next = [...prev];
      const options = [...(next[qIdx].options || [])];
      options[optIdx] = value;
      next[qIdx] = { ...next[qIdx], options };
      return next;
    });
  };

  const addFormQuestionOption = (qIdx) => {
    setFormQuestions((prev) => {
      const next = [...prev];
      const options = [...(next[qIdx].options || []), ""];
      next[qIdx] = { ...next[qIdx], options };
      return next;
    });
  };

  const removeFormQuestionOption = (qIdx, optIdx) => {
    setFormQuestions((prev) => {
      const next = [...prev];
      const options = (next[qIdx].options || []).filter((_, i) => i !== optIdx);
      next[qIdx] = { ...next[qIdx], options };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const sanitized = sanitizeFormQuestions(formQuestions);
    
    if (sanitized.length === 0) {
      throw new Error("Please provide at least one question with key and question text.");
    }

    await onSave(sanitized);
    setFormQuestions([]); // Clear form on success
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Survey Questions</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Number of Questions:
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
            onClick={initFormQuestions}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Generate Form
          </button>
        </div>
      </div>

      {formQuestions.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-6">
            {formQuestions.map((question, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Question {idx + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Key:
                    </label>
                    <input
                      type="text"
                      value={question.key}
                      onChange={(e) => updateFormQuestion(idx, "key", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="questionKey"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Response Type:
                    </label>
                    <select
                      value={question.responseType}
                      onChange={(e) => updateFormQuestion(idx, "responseType", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="open-ended">Open Ended</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Question:
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateFormQuestion(idx, "question", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Enter your question here..."
                  />
                </div>

                {question.responseType === "multiple-choice" && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Options:
                    </label>
                    {(question.options || []).map((option, optIdx) => (
                      <div key={optIdx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateFormQuestionOption(idx, optIdx, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                          placeholder={`Option ${optIdx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeFormQuestionOption(idx, optIdx)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFormQuestionOption(idx)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isLoading ? "Saving..." : "Save Questions"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FormMode;
