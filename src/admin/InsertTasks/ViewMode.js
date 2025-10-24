import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const ViewMode = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksDoc = await getDoc(doc(db, "admin", "tasks"));
        
        if (tasksDoc.exists()) {
          const data = tasksDoc.data();
          setTasks(data.tasks || []);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">View Current Tasks</h2>
        <div className="flex justify-center py-8">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">View Current Tasks</h2>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        View Current Tasks ({tasks.length})
      </h2>
      <p className="text-gray-600 mb-6">
        Here you can view all currently saved tasks. Switch to Form Mode or Paste Mode to make changes.
      </p>
      
      {tasks.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          No tasks found. Create some tasks using Form Mode or Paste Mode.
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 mb-1">
                    {index + 1}. {task.title}
                  </div>
                  {task.description && (
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMode;
