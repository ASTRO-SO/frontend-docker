import React, { useState, useEffect } from "react";
import EditMeaning from "./EditMeaning";

function MeaningsSection({ onNumberClick, numberMeanings: propNumberMeanings }) {
  const numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22
];

  const [showEditMeaning, setShowEditMeaning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [numberMeanings, setNumberMeanings] = useState(propNumberMeanings || {});
  const [systems, setSystems] = useState([]);
  const [currentMeanings, setCurrentMeanings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMeanings, setLoadingMeanings] = useState(false);
  
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch("backend-docker-production-c584.up.railway.app/api/numerology/system", {
          credentials: "include",
        });
        const data = await response.json();
        setSystems(data);
      } catch (err) {
        console.error("Failed to fetch systems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystems();
  }, []);

  // Update currentMeanings when systems change
  useEffect(() => {
    if (systems.length > 0) {
      setCurrentMeanings(Array(systems.length).fill(""));
    }
  }, [systems]);

  const fetchNumberMeanings = async (number) => {
    setLoadingMeanings(true);
    try {
      const response = await fetch(`backend-docker-production-c584.up.railway.app/api/numerology/meanings/${number}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.meanings || [];
      } else {
        console.error("Failed to fetch meanings:", response.statusText);
        return Array(systems.length).fill("");
      }
    } catch (err) {
      console.error("Error fetching number meanings:", err);
      return Array(systems.length).fill("");
    } finally {
      setLoadingMeanings(false);
    }
  };

  const saveNumberMeanings = async (number, meanings) => {
    try {
      const response = await fetch(`backend-docker-production-c584.up.railway.app/api/numerology/meanings/${number}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ meanings }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Meanings saved successfully:", data.message);
        return true;
      } else {
        console.error("Failed to save meanings:", response.statusText);
        return false;
      }
    } catch (err) {
      console.error("Error saving number meanings:", err);
      return false;
    }
  };

  const handleNumberClick = async (number) => {
    setSelectedNumber(number);
    
    // Fetch meanings from database
    const meaningsFromDB = await fetchNumberMeanings(number);
    
    // Ensure we have the right number of meanings (match systems length)
    const meaningsArray = Array(systems.length).fill("").map((_, index) => 
      meaningsFromDB[index] || ""
    );
    
    setCurrentMeanings(meaningsArray);
    
    // Update local state cache
    setNumberMeanings(prev => ({
      ...prev,
      [number]: meaningsArray
    }));
    
    setShowEditMeaning(true);
    
    // Call parent's onNumberClick if provided
    if (onNumberClick) {
      onNumberClick(number);
    }
  };

  const handleMeaningsChange = (index, value) => {
    const newMeanings = [...currentMeanings];
    newMeanings[index] = value;
    setCurrentMeanings(newMeanings);
  };

  const handleSave = async () => {
    // Save to database
    const saveSuccess = await saveNumberMeanings(selectedNumber, currentMeanings);
    
    if (saveSuccess) {
      // Update local state only if save was successful
      setNumberMeanings(prev => ({
        ...prev,
        [selectedNumber]: [...currentMeanings]
      }));
      setShowEditMeaning(false);
    } else {
      // You might want to show an error message to the user here
      alert("Failed to save meanings. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowEditMeaning(false);
    setCurrentMeanings(Array(systems.length).fill(""));
  };

  if (loading) {
    return (
      <section className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
        <h2 className="mb-6 text-xl font-semibold text-white">Number Meanings</h2>
        <p className="text-gray-400">Loading systems...</p>
      </section>
    );
  }

  return (
    <section className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <h2 className="mb-6 text-xl font-semibold text-white">Number Meanings</h2>
      <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
        {numbers.map((number) => (
          <button
            key={number}
            className="p-5 cursor-pointer bg-gray-900 rounded-lg border border-zinc-700 hover:bg-gray-800 transition-colors flex flex-col items-center justify-center text-center"
            onClick={() => handleNumberClick(number)}
            disabled={loadingMeanings}
          >
            <h3 className="mb-3 text-base font-medium text-white flex items-center gap-2">
              {number}
            </h3>
            {loadingMeanings && (
              <p className="text-sm text-blue-400">Loading...</p>
            )}
          </button>
        ))}
      </div>
      {showEditMeaning && (
        <EditMeaning 
          selectedNumber={selectedNumber}
          meanings={currentMeanings}
          systems={systems}
          onMeaningsChange={handleMeaningsChange}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loadingMeanings}
        />
      )}
    </section>
  );
}

export default MeaningsSection;