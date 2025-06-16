"use client";
import React, { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";

// API functions to fetch data from your backend
const fetchAstrologyReadingsFromDatabase = async () => {
  try {
    const response = await fetch('backend-docker-production-c584.up.railway.app/api/astrology/readings', {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch astrology readings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching astrology readings:', error);
    return [];
  }
};

const fetchNumerologyReadingsFromDatabase = async () => {
  try {
    const response = await fetch('backend-docker-production-c584.up.railway.app/api/numerology/readings', {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch numerology readings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching numerology readings:', error);
    return [];
  }
};

// Function to fetch user details
const fetchUserDetails = async (phone) => {
  try {
    const response = await fetch(`backend-docker-production-c584.up.railway.app/api/users/phone/${phone}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

function ReadingManagement() {
  const [activeTab, setActiveTab] = useState("reading");
  const [selectedReading, setSelectedReading] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReadings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both astrology and numerology data
        const [astrologyData, numerologyData] = await Promise.all([
          fetchAstrologyReadingsFromDatabase(),
          fetchNumerologyReadingsFromDatabase()
        ]);
        
        // Get unique phone numbers to fetch user details
        const phoneNumbers = [...new Set([
          ...astrologyData.map(record => record.PhoneNumber),
          ...numerologyData.map(record => record.PhoneNumber)
        ])];
        
        // Fetch user details for all phone numbers
        const userDetailsPromises = phoneNumbers.map(phone => fetchUserDetails(phone));
        const userDetailsResults = await Promise.all(userDetailsPromises);
        
        // Create a map of phone numbers to user details
        const userDetailsMap = {};
        phoneNumbers.forEach((phone, index) => {
          const userDetail = userDetailsResults[index];
          userDetailsMap[phone] = userDetail || {
            fullname: `User ${phone}`,
            phone: phone,
            email: `${phone}@example.com`
          };
        });
        
        // Transform astrology data
        const transformedAstrologyReadings = astrologyData.map(record => {
          const userDetail = userDetailsMap[record.PhoneNumber];
          return {
            id: `astro_${record.ResultID}`,
            user: {
              name: userDetail.fullname,
              phone: userDetail.phone,
              email: userDetail.email
            },
            type: "Astrology",
            subtype: "Birth Chart",
            date: record.date,
            status: "completed",
            results: {
              ascendant: record.ascendant,
              sunSign: record.sun,
              moonSign: record.moon,
              planets: {
                mercury: record.mercury,
                venus: record.venus,
                mars: record.mars,
                jupiter: record.jupiter,
                saturn: record.saturn,
                neptune: record.neptune,
                pluto: record.pluto,
                chiron: record.chiron
              }
            },
            rawData: record
          };
        });

        // Transform numerology data
        const transformedNumerologyReadings = numerologyData.map(record => {
          const userDetail = userDetailsMap[record.PhoneNumber];
          return {
            id: `numero_${record.ResultID}`,
            user: {
              name: userDetail.fullname,
              phone: userDetail.phone,
              email: userDetail.email
            },
            type: "Numerology",
            subtype: "Life Path Analysis",
            date: record.date,
            status: "completed",
            results: {
              lifePath: record.lifepath_number,
              soulUrge: record.soulurge_number,
              personality: record.personality_number,
              naturalAbility: record.naturalability_number,
              maturity: record.maturity_number,
              attitude: record.attitude_number,
              destiny: record.destiny_number,
              challenges: [
                record.challenge_number_1,
                record.challenge_number_2,
                record.challenge_number_3,
                record.challenge_number_4
              ].filter(num => num !== null && num !== undefined)
            },
            rawData: record
          };
        });

        // Combine both types of readings
        const allReadings = [...transformedAstrologyReadings, ...transformedNumerologyReadings];
        
        // Sort by date (most recent first)
        allReadings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setReadings(allReadings);
      } catch (error) {
        console.error('Error loading readings:', error);
        setError('Failed to load readings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadReadings();
  }, []);

  const handleViewDetails = (reading) => {
    setSelectedReading(reading);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const filteredReadings = readings.filter(reading => {
    const matchesSearch = searchQuery === "" || 
      reading.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reading.user.phone.includes(searchQuery) ||
      (reading.type === "Astrology" && reading.results.sunSign?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (reading.type === "Numerology" && reading.results.lifePath?.toString().includes(searchQuery));
    
    const matchesStatusFilter = filterStatus === "all" || reading.status === filterStatus;
    const matchesTypeFilter = filterType === "all" || reading.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  return (
    <main className="flex flex-col min-h-screen text-gray-200 bg-gray-900">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="flex-1 p-8">
        {activeTab === "reading" && (
          <div className="space-y-6">
            <StatisticsCards readings={readings} />
            
            {/* Search and Filter Controls */}
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name, phone, or reading details"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="astrology">Astrology</option>
                <option value="numerology">Numerology</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <div className="ml-3 text-gray-400">Loading readings...</div>
              </div>
            ) : (
              <ReadingTable
                readings={filteredReadings}
                onViewDetails={handleViewDetails}
              />
            )}
            
          </div>
        )}
        
      </section>

      {showDetails && (
        <ReadingDetailsModal
          reading={selectedReading}
          onClose={handleCloseDetails}
        />
      )}
    </main>
  );
}

function StatisticsCards({ readings }) {
  const totalReadings = readings.length;
  const completedReadings = readings.filter(r => r.status === 'completed').length;
  const pendingReadings = readings.filter(r => r.status === 'pending').length;
  const astrologyReadings = readings.filter(r => r.type === 'Astrology').length;
  const numerologyReadings = readings.filter(r => r.type === 'Numerology').length;

  const stats = [
    { title: "Total Readings", value: totalReadings, color: "text-blue-400" },
    { title: "Completed", value: completedReadings, color: "text-green-400" },
    { title: "Pending", value: pendingReadings, color: "text-yellow-400" },
    { title: "Astrology", value: astrologyReadings, color: "text-purple-400" },
    { title: "Numerology", value: numerologyReadings, color: "text-pink-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
          <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function ReadingTable({ readings, onViewDetails }) {
  if (readings.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-gray-400">No readings found matching your criteria.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Primary Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Secondary Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {readings.map((reading) => (
              <tr key={reading.id} className="hover:bg-gray-700">
                {/* User Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{reading.user.name}</div>
                </td>
                
                {/* Phone Number */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{reading.user.phone}</div>
                </td>
                
                {/* Reading Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    reading.type === 'Astrology' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {reading.type}
                  </span>
                </td>
                
                {/* Primary Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {reading.type === 'Astrology' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Sun: {reading.results.sunSign}
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Life Path: {reading.results.lifePath}
                    </span>
                  )}
                </td>
                
                {/* Secondary Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {reading.type === 'Astrology' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      Moon: {reading.results.moonSign}
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      Destiny: {reading.results.destiny}
                    </span>
                  )}
                </td>
                
                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(reading.date).toLocaleDateString()}
                </td>
                
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    reading.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reading.status}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(reading)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReadingDetailsModal({ reading, onClose }) {
  if (!reading) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <section className="overflow-y-auto p-8 rounded-xl bg-zinc-800 max-h-[90vh] max-w-[90%] w-[900px]">
        <header className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-white">
            {reading.type} Reading Details
          </h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close details"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserInfoCard user={reading.user} />
            <ReadingInfoCard reading={reading} />
          </div>

          {reading.type === 'Astrology' ? (
            <AstrologyResultsCard reading={reading} />
          ) : (
            <NumerologyResultsCard reading={reading} />
          )}
        </div>
      </section>
    </div>
  );
}

function UserInfoCard({ user }) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h4 className="mb-3 text-sm font-medium text-gray-400">
        User Information
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Name:</span>
          <span className="text-white">{user.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Phone:</span>
          <span className="text-white">{user.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Email:</span>
          <span className="text-white">{user.email}</span>
        </div>
      </div>
    </div>
  );
}

function ReadingInfoCard({ reading }) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h4 className="mb-3 text-sm font-medium text-gray-400">
        Reading Information
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Type:</span>
          <span className="text-white">{reading.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Subtype:</span>
          <span className="text-white">{reading.subtype}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date:</span>
          <span className="text-white">{new Date(reading.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={`${reading.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
            {reading.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function AstrologyResultsCard({ reading }) {
  const { results } = reading;
  
  const corePlacements = [
    { label: "Sun Sign", value: results.sunSign, color: "bg-yellow-900 text-yellow-200" },
    { label: "Moon Sign", value: results.moonSign, color: "bg-blue-900 text-blue-200" },
    { label: "Ascendant", value: results.ascendant, color: "bg-green-900 text-green-200" },
  ];

  const planetPlacements = [
    { label: "Mercury", value: results.planets.mercury, color: "bg-gray-700 text-gray-200" },
    { label: "Venus", value: results.planets.venus, color: "bg-pink-900 text-pink-200" },
    { label: "Mars", value: results.planets.mars, color: "bg-red-900 text-red-200" },
    { label: "Jupiter", value: results.planets.jupiter, color: "bg-purple-900 text-purple-200" },
    { label: "Saturn", value: results.planets.saturn, color: "bg-indigo-900 text-indigo-200" },
    { label: "Neptune", value: results.planets.neptune, color: "bg-teal-900 text-teal-200" },
    { label: "Pluto", value: results.planets.pluto, color: "bg-orange-900 text-orange-200" },
    { label: "Chiron", value: results.planets.chiron, color: "bg-emerald-900 text-emerald-200" },
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h4 className="mb-6 text-lg font-medium text-white">Birth Chart Analysis</h4>

      <div className="mb-6">
        <h5 className="mb-3 text-md font-medium text-gray-300">Core Placements</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {corePlacements.map((placement, index) => (
            <div key={index} className={`p-4 rounded-lg ${placement.color}`}>
              <div className="text-sm opacity-80">{placement.label}</div>
              <div className="text-lg font-semibold">{placement.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="mb-3 text-md font-medium text-gray-300">Planetary Placements</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {planetPlacements.map((planet, index) => (
            <div key={index} className={`p-3 rounded-lg ${planet.color}`}>
              <div className="text-xs opacity-80">{planet.label}</div>
              <div className="text-sm font-semibold">{planet.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h5 className="mb-2 text-sm font-medium text-gray-300">Quick Interpretation</h5>
        <p className="text-sm text-gray-400">
          This person has their Sun in {results.sunSign}, Moon in {results.moonSign}, and {results.ascendant} rising. 
          This combination suggests a unique blend of {results.sunSign} core identity, {results.moonSign} emotional nature, 
          and {results.ascendant} outward expression.
        </p>
      </div>
    </div>
  );
}

function NumerologyResultsCard({ reading }) {
  const { results } = reading;
  
  const coreNumbers = [
    { label: "Life Path", value: results.lifePath, color: "bg-blue-900 text-blue-200", description: "Your life's journey and lessons" },
    { label: "Destiny", value: results.destiny, color: "bg-purple-900 text-purple-200", description: "Your life's ultimate goal" },
    { label: "Soul Urge", value: results.soulUrge, color: "bg-pink-900 text-pink-200", description: "Your inner desires and motivations" },
  ];

  const personalityNumbers = [
    { label: "Personality", value: results.personality, color: "bg-green-900 text-green-200" },
    { label: "Natural Ability", value: results.naturalAbility, color: "bg-yellow-900 text-yellow-200" },
    { label: "Maturity", value: results.maturity, color: "bg-indigo-900 text-indigo-200" },
    { label: "Attitude", value: results.attitude, color: "bg-red-900 text-red-200" },
  ];

  const challengeNumbers = results.challenges.filter(num => num !== 0 && num !== null && num !== undefined);

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h4 className="mb-6 text-lg font-medium text-white">Numerology Analysis</h4>

      <div className="mb-6">
        <h5 className="mb-3 text-md font-medium text-gray-300">Core Numbers</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coreNumbers.map((number, index) => (
            <div key={index} className={`p-4 rounded-lg ${number.color}`}>
              <div className="text-sm opacity-80">{number.label}</div>
              <div className="text-2xl font-bold mb-2">{number.value}</div>
              <div className="text-xs opacity-70">{number.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h5 className="mb-3 text-md font-medium text-gray-300">Personality Aspects</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {personalityNumbers.map((number, index) => (
            <div key={index} className={`p-3 rounded-lg ${number.color}`}>
              <div className="text-xs opacity-80">{number.label}</div>
              <div className="text-xl font-semibold">{number.value}</div>
            </div>
          ))}
        </div>
      </div>

      {challengeNumbers.length > 0 && (
        <div className="mb-6">
          <h5 className="mb-3 text-md font-medium text-gray-300">Challenge Numbers</h5>
          <div className="flex flex-wrap gap-2">
            {challengeNumbers.map((challenge, index) => (
              <div key={index} className="px-3 py-2 bg-orange-900 text-orange-200 rounded-lg">
                <span className="text-sm font-semibold">{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h5 className="mb-2 text-sm font-medium text-gray-300">Quick Interpretation</h5>
        <p className="text-sm text-gray-400">
          This person's Life Path number is {results.lifePath}, indicating their core life lessons and journey. 
          With a Destiny number of {results.destiny}, they are working toward specific life goals. 
          Their Soul Urge number {results.soulUrge} reveals their inner motivations and deepest desires.
        </p>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default ReadingManagement;