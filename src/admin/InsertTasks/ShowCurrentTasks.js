import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const ShowCurrentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const load = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const snap = await getDoc(doc(db, "admin", "tasks"));
      const data = snap.exists() ? snap.data() : null;
      const list = Array.isArray(data?.tasks) ? data.tasks : [];
      setTasks(list);
      setStatus({ type: "success", message: `Loaded ${list.length} tasks.` });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: `Failed to load tasks: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Current Tasks</h1>
      <p className="text-sm text-gray-600 mb-4">
        This shows the current task list stored in Firestore at <code>admin/tasks</code>.
      </p>

      <div className="mb-4 flex items-center gap-2">
        <a href="/admin/insert-tasks" className="px-3 py-1 rounded border bg-white">Back to Insert</a>
        <button
          onClick={load}
          disabled={loading}
          className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
        {status && (
          <span className={`ml-2 ${status.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {status.message}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-600">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t, idx) => (
            <li key={idx} className="border rounded p-3 bg-white">
              <div className="font-medium">{t.title}</div>
              {t.description && (
                <div className="text-sm text-gray-600 whitespace-pre-wrap">{t.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowCurrentTasks;
