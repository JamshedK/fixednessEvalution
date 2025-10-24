import { db } from "../../../firebase-config";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";

// Save survey questions to Firebase
export const saveSurveyQuestions = async (items, authCtx) => {
  const adminSurveyDoc = doc(db, "admin", "experienceSurvey");
  const payload = {
    questions: items,
    updatedAt: serverTimestamp(),
    updatedBy: authCtx?.user?.uid || null,
  };
  await setDoc(adminSurveyDoc, payload, { merge: true });
};

// Parse and validate JSON input
export const parseJsonInput = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON must be an array of question objects.");
    }
    
    const items = parsed
      .filter((q) => q && typeof q.key === "string" && typeof q.question === "string")
      .map((q) => ({
        key: q.key,
        question: q.question,
        responseType: q.responseType || (q.options ? "multiple-choice" : "open-ended"),
        ...(q.options && { options: q.options })
      }));
      
    if (items.length === 0) {
      throw new Error("No valid questions found. Each question must have 'key' and 'question' properties.");
    }
    
    return items;
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
};

// Sanitize question data for form mode
export const sanitizeFormQuestions = (formQuestions) => {
  return formQuestions
    .map((q) => ({
      key: (q.key || "").trim(),
      question: (q.question || "").trim(),
      responseType: q.responseType || "open-ended",
      ...(q.responseType === "multiple-choice" && q.options && {
        options: q.options.filter(opt => opt.trim()).map(opt => opt.trim())
      })
    }))
    .filter((q) => q.key.length > 0 && q.question.length > 0);
};

// Sanitize question data for JSON mode
export const sanitizeJsonQuestions = (parsed) => {
  return parsed
    .map((q) => ({
      key: q.key.trim(),
      question: q.question.trim(),
      responseType: q.responseType || "open-ended",
      ...(q.options && { options: q.options })
    }))
    .filter((q) => q.key.length > 0 && q.question.length > 0);
};

// Default JSON example for JSON mode
export const DEFAULT_JSON_EXAMPLE = `[
  {
    "key": "overallExperience",
    "question": "How would you rate your overall experience with the current task interaction?",
    "options": [
      "Very Unsatisfactory",
      "Unsatisfactory", 
      "Neutral",
      "Satisfactory",
      "Very Satisfactory"
    ]
  },
  {
    "key": "additionalComments",
    "question": "Please provide any additional comments or feedback you have about your experience.",
    "responseType": "open-ended"
  }
]`;
