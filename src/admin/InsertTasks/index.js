import React, { useState, useContext } from "react";
import { db } from "../../firebase-config";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import AuthContext from "../../context/auth-context";
import ShowCurrentTasks from "./ShowCurrentTasks";

const parseInput = (raw) => {
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

const InsertTasks = () => {
  // Mode toggle: simple form vs paste
  const [mode, setMode] = useState("form");

  // Paste mode state
  const [raw, setRaw] = useState(
    "Assess AI in hiring | Consider societal and ethical aspects.\n" +
      "Balance privacy and surveillance | Legal, ethical, technological perspectives.\n" +
      "Compare diets | Keto, Vegan, Mediterranean — effects on health\n"
  );

  // Form mode state
  const [count, setCount] = useState(3);
  const [formTasks, setFormTasks] = useState([]);

  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const initFormTasks = () => {
    const n = Math.max(1, Math.min(100, parseInt(count || 0, 10)));
    setFormTasks(Array.from({ length: n }, () => ({ title: "", description: "" })));
    setStatus(null);
  };

  const updateFormTask = (idx, field, value) => {
    setFormTasks((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // Save the entire list into admin/tasks document
  const saveTasksList = async (items) => {
    const adminTasksDoc = doc(db, "admin", "tasks");
    const payload = {
      tasks: items.map((t, idx) => ({ id: idx + 1, title: t.title, description: t.description })),
      updatedAt: serverTimestamp(),
      updatedBy: authCtx?.user?.uid || null,
    };
    await setDoc(adminTasksDoc, payload, { merge: true });
  };

  const handleSubmitPaste = async (e) => {
    e.preventDefault();
    setStatus(null);

    let parsed;
    try {
      parsed = parseInput(raw);
    } catch (err) {
      setStatus({ type: "error", message: `Please format correctly: ${err.message}` });
      return;
    }

    // Ensure minimal fields only (id will be assigned on save)
    const sanitized = parsed
      .filter((t) => t && typeof t.title === "string")
      .map((t) => ({ title: t.title.trim(), description: (t.description || "").trim() }))
      .filter((t) => t.title.length > 0);

    if (sanitized.length === 0) {
      setStatus({ type: "error", message: "No valid tasks found. Use JSON or 'Title | Description'." });
      return;
    }

    setIsLoading(true);
    try {
      await saveTasksList(sanitized);
      setStatus({ type: "success", message: `Saved ${sanitized.length} tasks to admin/tasks.` });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: `Failed to save tasks: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setStatus(null);

    const sanitized = formTasks
      .map((t) => ({ title: (t.title || "").trim(), description: (t.description || "").trim() }))
      .filter((t) => t.title.length > 0);

    if (sanitized.length === 0) {
      setStatus({ type: "error", message: "Please provide at least one title." });
      return;
    }

    setIsLoading(true);
    try {
      await saveTasksList(sanitized);
      setStatus({ type: "success", message: `Saved ${sanitized.length} tasks to admin/tasks.` });
      setFormTasks([]);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: `Failed to save tasks: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Insert Tasks</h1>
      <p className="text-sm text-gray-600 mb-4">
        This page enables you to customize the tasks you give to the users. You can either have your own tasks by
        inserting through forms or use paste mode to enter as a list.
      </p>

      <div className="mb-4 flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded border ${mode === "form" ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => setMode("form")}
          type="button"
        >
          Form mode
        </button>
        <button
          className={`px-3 py-1 rounded border ${mode === "paste" ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => setMode("paste")}
          type="button"
        >
          Paste mode
        </button>
        <button
          className={`px-3 py-1 rounded border ${mode === "current" ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => setMode("current")}
          type="button"
        >
          Current tasks
        </button>
        {status && (
          <span className={`ml-2 ${status.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {status.message}
          </span>
        )}
      </div>

      {mode === "form" ? (
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Number of tasks</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="border rounded px-3 py-2 w-32"
              />
            </div>
            <button type="button" onClick={initFormTasks} className="bg-gray-800 text-white px-4 py-2 rounded mt-6">
              Generate fields
            </button>
          </div>

          {formTasks.length > 0 && (
            <form onSubmit={handleSubmitForm} className="space-y-6">
              {formTasks.map((t, idx) => (
                <div key={idx} className="border rounded p-3 bg-white">
                  <div className="text-sm text-gray-500 mb-2">Task {idx + 1}</div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={t.title}
                    onChange={(e) => updateFormTask(idx, "title", e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={t.description}
                    onChange={(e) => updateFormTask(idx, "description", e.target.value)}
                    className="w-full h-24 border rounded px-3 py-2"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save list"}
              </button>
            </form>
          )}
        </div>
      ) : mode === "paste" ? (
        <form onSubmit={handleSubmitPaste}>
          <p className="text-sm text-gray-600 mb-3">
            Paste a JSON array of tasks (with fields: title, description) or write one task per line using
            "Title | Description". This will overwrite the list at admin/tasks.
          </p>
          <textarea
            className="w-full h-64 p-3 border rounded font-mono text-sm"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
          />
          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save list"}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-700">
            <p>JSON example:</p>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">{
`[
  { "title": "Assess AI in hiring", "description": "Consider societal and ethical aspects." },
  { "title": "Balance privacy and surveillance", "description": "Legal, ethical, technological perspectives." }
]`}
            </pre>
          </div>
        </form>
      ) : (
        <ShowCurrentTasks />
      )}
    </div>
  );
};

export default InsertTasks;
