import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const ShowCurrentSurvey = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const surveyDoc = await getDoc(doc(db, "admin", "experienceSurvey"));
        
        if (surveyDoc.exists()) {
          const data = surveyDoc.data();
          setQuestions(data.questions || []);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Error fetching survey questions:", err);
        setError("Failed to load survey questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Survey Questions</h2>
        <div className="flex justify-center py-8">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Survey Questions</h2>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Current Survey Questions ({questions.length})
      </h2>
      
      {questions.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          No survey questions found. Create some questions using the form above.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 mb-1">
                    {index + 1}. {question.question}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Key:</span> {question.key} | 
                    <span className="font-medium"> Type:</span> {question.responseType}
                  </div>
                </div>
              </div>
              
              {question.options && question.options.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Options:</div>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {question.responseType === "open-ended" && (
                <div className="mt-3 text-sm text-gray-600 italic">
                  Open-ended response expected
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowCurrentSurvey;
