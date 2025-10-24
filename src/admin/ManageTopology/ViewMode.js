import React, { useState, useEffect } from "react";
import { loadTopologyData } from "./shared/topologyUtils";

const ViewMode = () => {
  const [topologyData, setTopologyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopologyData = async () => {
      try {
        const loadedData = await loadTopologyData();
        setTopologyData(loadedData);
      } catch (err) {
        console.error("Error loading topology data:", err);
        setError("Failed to load topology data");
      } finally {
        setLoading(false);
      }
    };

    fetchTopologyData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading topology data...</div>
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

  if (topologyData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">No topology data found.</div>
          <p className="text-sm text-gray-400 mt-2">
            Use Form Mode or JSON Mode to add topology data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Current Topology Data ({topologyData.length} categories)
      </h3>
      
      <div className="space-y-6">
        {topologyData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 text-lg">
                {index + 1}. {item.intention_type}
              </h4>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {item.intention_list.length} intention{item.intention_list.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="ml-4 space-y-3">
              {item.intention_list.map((intention, intentionIndex) => (
                <div key={intentionIndex} className="border-l-2 border-gray-200 pl-4">
                  <h5 className="font-medium text-gray-800 mb-1">
                    {intention.short_text}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {intention.long_text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">JSON Export</h4>
        <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-48">
          {JSON.stringify(topologyData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ViewMode;
