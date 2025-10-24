import React, { useState, useEffect } from "react";
import { loadDemographyQuestions } from "./shared/demographyUtils";

const ViewMode = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const loadedQuestions = await loadDemographyQuestions();
        setQuestions(loadedQuestions);
      } catch (err) {
        console.error("Error loading questions:", err);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">No demography questions found.</div>
          <p className="text-sm text-gray-400 mt-2">
            Use Form Mode or JSON Mode to add some questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Current Demography Questions ({questions.length})
      </h3>
      
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                {index + 1}. {question.category}
              </h4>
              <div className="flex gap-2">
                {question.required && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Required
                  </span>
                )}
                {question.allowMultipleSelections && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Multiple
                    {question.selectUpto && ` (max ${question.selectUpto})`}
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-4">
              <p className="text-sm text-gray-600 mb-2">Options:</p>
              <ul className="list-disc list-inside space-y-1">
                {question.options.map((option, optIndex) => (
                  <li key={optIndex} className="text-sm text-gray-700">
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">JSON Export</h4>
        <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-48">
          {JSON.stringify(questions, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ViewMode;
