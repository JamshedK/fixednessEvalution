import React, { useState } from "react";

const FormMode = ({ onSave, isLoading }) => {
  const [topologyItems, setTopologyItems] = useState([]);
  const [count, setCount] = useState("3");

  const initializeTopologyItems = () => {
    const n = Math.max(1, Math.min(20, parseInt(count || 0, 10)));
    setTopologyItems(Array.from({ length: n }, () => ({ 
      intention_type: "", 
      intention_list: [{ short_text: "", long_text: "" }]
    })));
  };

  const updateTopologyItem = (idx, field, value) => {
    setTopologyItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateIntention = (topologyIdx, intentionIdx, field, value) => {
    setTopologyItems(prev => {
      const next = [...prev];
      const newIntentions = [...next[topologyIdx].intention_list];
      newIntentions[intentionIdx] = { ...newIntentions[intentionIdx], [field]: value };
      next[topologyIdx] = { ...next[topologyIdx], intention_list: newIntentions };
      return next;
    });
  };

  const addIntention = (topologyIdx) => {
    setTopologyItems(prev => {
      const next = [...prev];
      next[topologyIdx] = { 
        ...next[topologyIdx], 
        intention_list: [...next[topologyIdx].intention_list, { short_text: "", long_text: "" }] 
      };
      return next;
    });
  };

  const removeIntention = (topologyIdx, intentionIdx) => {
    setTopologyItems(prev => {
      const next = [...prev];
      const newIntentions = next[topologyIdx].intention_list.filter((_, i) => i !== intentionIdx);
      next[topologyIdx] = { ...next[topologyIdx], intention_list: newIntentions };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitized = topologyItems
      .filter(item => item.intention_type.trim())
      .map(item => ({
        ...item,
        intention_type: item.intention_type.trim(),
        intention_list: item.intention_list
          .filter(intention => intention.short_text.trim() && intention.long_text.trim())
          .map(intention => ({
            short_text: intention.short_text.trim(),
            long_text: intention.long_text.trim(),
          })),
      }))
      .filter(item => item.intention_list.length > 0);

    if (sanitized.length === 0) {
      alert("Please provide at least one complete topology item with intentions.");
      return;
    }

    await onSave(sanitized);
    setTopologyItems([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Mode</h3>
      
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Number of topology categories:
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={initializeTopologyItems}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Initialize
        </button>
      </div>

      {topologyItems.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {topologyItems.map((item, tIdx) => (
            <div key={tIdx} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Topology Category {tIdx + 1}</h4>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Intention Type (e.g., 'Find information')"
                  value={item.intention_type}
                  onChange={(e) => updateTopologyItem(tIdx, "intention_type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intentions:</label>
                  {item.intention_list.map((intention, iIdx) => (
                    <div key={iIdx} className="border border-gray-100 rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Intention {iIdx + 1}</span>
                        {item.intention_list.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIntention(tIdx, iIdx)}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Short text (e.g., 'Find a known item')"
                        value={intention.short_text}
                        onChange={(e) => updateIntention(tIdx, iIdx, "short_text", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-2"
                      />
                      <textarea
                        placeholder="Long text (detailed description)"
                        value={intention.long_text}
                        onChange={(e) => updateIntention(tIdx, iIdx, "long_text", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addIntention(tIdx)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  >
                    + Add Intention
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Topology Data"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FormMode;
