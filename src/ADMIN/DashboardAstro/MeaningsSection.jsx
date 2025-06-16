import React, { useState, useEffect } from "react";
import EditMeaning from "./EditMeaning";

function MeaningsSection({ onZodiacClick, zodiacMeanings: propZodiacMeanings }) {
  const zodiacs = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

  // Zodiac emoji mapping
  const zodiacEmojis = {
    "Aries": "♈",
    "Taurus": "♉",
    "Gemini": "♊",
    "Cancer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓"
  };

  const [showEditMeaning, setShowEditMeaning] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [zodiacMeanings, setZodiacMeanings] = useState(propZodiacMeanings || {});
  const [systems, setSystems] = useState([]);
  const [currentMeanings, setCurrentMeanings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMeanings, setLoadingMeanings] = useState(false);
  
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/astrology/system", {
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

  const fetchZodiacMeanings = async (zodiac, planet) => {
    setLoadingMeanings(true);
    try {
      const response = await fetch(`http://localhost:3000/api/astrology/meanings/${zodiac}`, {
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
      console.error("Error fetching zodiac meanings:", err);
      return Array(systems.length).fill("");
    } finally {
      setLoadingMeanings(false);
    }
  };

  const saveZodiacMeanings = async (zodiac, meanings) => {
    try {
      const response = await fetch(`http://localhost:3000/api/astrology/meanings/${zodiac}`, {
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
      console.error("Error saving zodiac meanings:", err);
      return false;
    }
  };

  const handleZodiacClick = async (zodiac) => {
    setSelectedZodiac(zodiac);
    
    // Fetch meanings from database
    const meaningsFromDB = await fetchZodiacMeanings(zodiac);
    
    // Ensure we have the right number of meanings (match systems length)
    const meaningsArray = Array(systems.length).fill("").map((_, index) => 
      meaningsFromDB[index] || ""
    );
    
    setCurrentMeanings(meaningsArray);
    
    // Update local state cache
    setZodiacMeanings(prev => ({
      ...prev,
      [zodiac]: meaningsArray
    }));
    
    setShowEditMeaning(true);
    
    // Call parent's onZodiacClick if provided
    if (onZodiacClick) {
      onZodiacClick(zodiac);
    }
  };

  const handleMeaningsChange = (index, value) => {
    const newMeanings = [...currentMeanings];
    newMeanings[index] = value;
    setCurrentMeanings(newMeanings);
  };

  const handleSave = async () => {
    // Save to database
    const saveSuccess = await saveZodiacMeanings(selectedZodiac, currentMeanings);
    
    if (saveSuccess) {
      // Update local state only if save was successful
      setZodiacMeanings(prev => ({
        ...prev,
        [selectedZodiac]: [...currentMeanings]
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
        <h2 className="mb-6 text-xl font-semibold text-white">Zodiac Meanings</h2>
        <p className="text-gray-400">Loading systems...</p>
      </section>
    );
  }

  return (
    <section className="p-6 rounded-xl border bg-zinc-800 border-zinc-700">
      <h2 className="mb-6 text-xl font-semibold text-white">Zodiac Meanings</h2>
      <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
        {zodiacs.map((zodiac) => (
          <button
            key={zodiac}
            className="p-5 cursor-pointer bg-gray-900 rounded-lg border border-zinc-700 hover:bg-gray-800 transition-colors flex flex-col items-center justify-center text-center"
            onClick={() => handleZodiacClick(zodiac)}
            disabled={loadingMeanings}
          >
            <h3 className="mb-3 text-base font-medium text-white flex items-center gap-2">
              <span className="text-lg">{zodiacEmojis[zodiac]}</span>
              {zodiac}
            </h3>
            {loadingMeanings && (
              <p className="text-sm text-blue-400">Loading...</p>
            )}
          </button>
        ))}
      </div>
      {showEditMeaning && (
        <EditMeaning 
          selectedZodiac={selectedZodiac}
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