import React, { useState } from "react";

const FormMode = ({ onSave, isLoading }) => {
  const [questions, setQuestions] = useState([]);
  const [count, setCount] = useState("5");

  const initializeQuestions = () => {
    const n = Math.max(1, Math.min(50, parseInt(count || 0, 10)));
    setQuestions(Array.from({ length: n }, () => ({ 
      category: "", 
      options: [""], 
      required: true,
      allowMultipleSelections: false,
      selectUpto: 1
    })));
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateOption = (questionIdx, optionIdx, value) => {
    setQuestions(prev => {
      const next = [...prev];
      const newOptions = [...next[questionIdx].options];
      newOptions[optionIdx] = value;
      next[questionIdx] = { ...next[questionIdx], options: newOptions };
      return next;
    });
  };

  const addOption = (questionIdx) => {
    setQuestions(prev => {
      const next = [...prev];
      next[questionIdx] = { 
        ...next[questionIdx], 
        options: [...next[questionIdx].options, ""] 
      };
      return next;
    });
  };

  const removeOption = (questionIdx, optionIdx) => {
    setQuestions(prev => {
      const next = [...prev];
      const newOptions = next[questionIdx].options.filter((_, i) => i !== optionIdx);
      next[questionIdx] = { ...next[questionIdx], options: newOptions };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitized = questions
      .filter(q => q.category.trim())
      .map(q => ({
        ...q,
        category: q.category.trim(),
        options: q.options.filter(opt => opt.trim()).map(opt => opt.trim()),
      }))
      .filter(q => q.options.length > 0);

    if (sanitized.length === 0) {
      alert("Please provide at least one complete question with options.");
      return;
    }

    await onSave(sanitized);
    setQuestions([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Mode</h3>
      
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Number of questions:
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={initializeQuestions}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Initialize
        </button>
      </div>

      {questions.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, qIdx) => (
            <div key={qIdx} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Question {qIdx + 1}</h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Question/Category"
                  value={question.category}
                  onChange={(e) => updateQuestion(qIdx, "category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options:</label>
                  {question.options.map((option, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`Option ${oIdx + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      {question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIdx, oIdx)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIdx)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(qIdx, "required", e.target.checked)}
                      className="mr-2"
                    />
                    Required
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={question.allowMultipleSelections}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        updateQuestion(qIdx, "allowMultipleSelections", isChecked);
                        // Set default selectUpto to number of options when enabling multiple selections
                        if (isChecked && !question.selectUpto) {
                          updateQuestion(qIdx, "selectUpto", question.options.filter(opt => opt.trim()).length || 1);
                        }
                      }}
                      className="mr-2"
                    />
                    Allow Multiple Selections
                  </label>
                  
                  {question.allowMultipleSelections && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Max selections:</label>
                      <input
                        type="number"
                        min="1"
                        value={question.selectUpto || ""}
                        onChange={(e) => updateQuestion(qIdx, "selectUpto", e.target.value ? parseInt(e.target.value) : null)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="No limit"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save All Questions"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FormMode;
