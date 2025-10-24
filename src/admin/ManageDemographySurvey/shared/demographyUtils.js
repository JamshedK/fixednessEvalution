import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

export const saveDemographyQuestions = async (questions, authCtx) => {
  const adminDemographyDoc = doc(db, "admin", "demographySurvey");
  const payload = {
    questions: questions.map((q, idx) => ({ 
      id: idx + 1, 
      ...q 
    })),
    updatedAt: serverTimestamp(),
    updatedBy: authCtx?.user?.uid || null,
  };
  await setDoc(adminDemographyDoc, payload, { merge: true });
};

export const loadDemographyQuestions = async () => {
  const adminDemographyDoc = doc(db, "admin", "demographySurvey");
  const docSnap = await getDoc(adminDemographyDoc);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.questions || [];
  }
  return [];
};

export const parseInput = (input) => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map(validateDemographyQuestion);
    } else {
      throw new Error("Input must be an array of questions");
    }
  } catch (jsonError) {
    throw new Error(`Invalid JSON format: ${jsonError.message}`);
  }
};

const validateDemographyQuestion = (question) => {
  if (!question || typeof question !== "object") {
    throw new Error("Each question must be an object");
  }
  
  if (!question.category || typeof question.category !== "string") {
    throw new Error("Each question must have a 'category' field");
  }
  
  if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
    throw new Error("Each question must have an 'options' array with at least one option");
  }
  
  const cleanedOptions = question.options.map(opt => opt.toString().trim()).filter(opt => opt.length > 0);
  const allowMultiple = question.allowMultipleSelections || false;
  
  return {
    category: question.category.trim(),
    options: cleanedOptions,
    required: question.required !== false, // Default to true
    allowMultipleSelections: allowMultiple,
    selectUpto: question.selectUpto || (allowMultiple ? cleanedOptions.length : 1),
  };
};
