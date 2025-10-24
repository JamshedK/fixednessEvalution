import React from "react";
import ShowCurrentSurvey from "./ShowCurrentSurvey";

const ViewMode = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">View Survey Questions</h2>
      <p className="text-gray-600 mb-6">
        Here you can view all currently saved survey questions. Switch to Form Mode or JSON Mode to make changes.
      </p>
      <ShowCurrentSurvey />
    </div>
  );
};

export default ViewMode;
