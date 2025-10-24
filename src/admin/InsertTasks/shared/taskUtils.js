import { db } from "../../../firebase-config";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";

// Save tasks to Firebase
export const saveTasksList = async (items, authCtx) => {
  const adminTasksDoc = doc(db, "admin", "tasks");
  const payload = {
    tasks: items.map((t, idx) => ({ id: idx + 1, title: t.title, description: t.description })),
    updatedAt: serverTimestamp(),
    updatedBy: authCtx?.user?.uid || null,
  };
  await setDoc(adminTasksDoc, payload, { merge: true });
};

// Parse input for paste mode (JSON or line format)
export const parseInput = (raw) => {
  // Try JSON first
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const items = parsed
        .filter((t) => t && typeof t.title === "string" && typeof t.description === "string")
        .map((t) => ({ title: t.title, description: t.description }));
      if (items.length === 0) {
        throw new Error("JSON must be an array of objects with 'title' and 'description' strings.");
      }
      return items;
    }
  } catch (_) {
    // ignore, fallback to line parsing
  }

  // Fallback: strict line-based parsing: Title | Description
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    throw new Error("No content. Provide JSON or lines like 'Title | Description'.");
  }

  const tasks = [];
  for (const line of lines) {
    const parts = line.split("|");
    if (parts.length < 2) {
      throw new Error(`Invalid line: "${line}". Use "Title | Description".`);
    }
    const title = parts.shift().trim();
    const description = parts.join("|").trim();
    if (!title || !description) {
      throw new Error(`Invalid line: "${line}". Use "Title | Description".`);
    }
    tasks.push({ title, description });
  }
  return tasks;
};

// Sanitize form tasks
export const sanitizeFormTasks = (formTasks) => {
  return formTasks
    .map((t) => ({ title: (t.title || "").trim(), description: (t.description || "").trim() }))
    .filter((t) => t.title.length > 0);
};

// Sanitize paste tasks
export const sanitizePasteTasks = (parsed) => {
  return parsed
    .filter((t) => t && typeof t.title === "string")
    .map((t) => ({ title: t.title.trim(), description: (t.description || "").trim() }))
    .filter((t) => t.title.length > 0);
};

// Default paste example
export const DEFAULT_PASTE_EXAMPLE = `Assess AI in hiring | Consider societal and ethical aspects.
Balance privacy and surveillance | Legal, ethical, technological perspectives.
Compare diets | Keto, Vegan, Mediterranean — effects on health`;
