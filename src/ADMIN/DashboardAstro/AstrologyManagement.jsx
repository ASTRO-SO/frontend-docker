"use client";
import React, { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import SystemsSection from "./SystemsSection";
import MeaningsSection from "./MeaningsSection";
import AddSystemModal from "./AddSystemModal";
import EditSystemModal from "./EditSystemModal";

function AstrologyManagement() {
  const [activeSection, setActiveSection] = useState("systems");
  const [editMode, setEditMode] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch("https://backend-docker-production-c584.up.railway.app/api/Astrology/system", {
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSystem, setNewSystem] = useState({
    name: "",
    description: "",
  });

  const handleShow = () => {
    setShowAddModal(true);
  };

  // Fixed handleAddSystem to actually save to database
  const handleAddSystem = async () => {
    try {
      const response = await fetch("https://backend-docker-production-c584.up.railway.app/api/Astrology", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newSystem.name,
          description: newSystem.description,
        }),
      });

      if (!response.ok) throw new Error("Failed to add system");

      const result = await response.json();
      
      // Add the new system to local state with the ID from database
      setSystems([
        ...systems,
        {
          id: result.id,
          name: newSystem.name,
          description: newSystem.description,
        },
      ]);

      // Reset form and close modal
      setNewSystem({
        name: "",
        description: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add system:", err);
      // You might want to show an error message to the user here
    }
  };

  const handleToggleActive = (id, isActive) => {
    setSystems(
      systems.map((system) =>
        system.id === id ? { ...system, active: isActive } : system,
      ),
    );
  };

  const handleEditSystem = (system) => {
    setSelectedSystem({ ...system });
    setShowEditModal(true);
  };

  const handleEditFieldChange = (field, value) => {
    setSelectedSystem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteSystem = async () => {
    try {
      const response = await fetch(`https://backend-docker-production-c584.up.railway.app/api/Astrology/${selectedSystem.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete system");

      setSystems((prev) => prev.filter((s) => s.id !== selectedSystem.id));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`https://backend-docker-production-c584.up.railway.app/api/Astrology/${selectedSystem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: selectedSystem.name,
          description: selectedSystem.description,
        }),
      });

      if (!response.ok) throw new Error("Failed to update system");

      // Update local state
      setSystems((prev) =>
        prev.map((s) => (s.id === selectedSystem.id ? selectedSystem : s))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewSystemChange = (field, value) => {
    setNewSystem({
      ...newSystem,
      [field]: value,
    });
  };

  return (
    <>
      <div className="flex flex-col text-gray-200 bg-gray-900">
        <TabNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className=" flex-1 p-8">
          {activeSection === "systems" && (
            <SystemsSection
              systems={systems}
              onToggleActive={handleToggleActive}
              onEditSystem={handleEditSystem}
              onAddModel={handleShow}
            />
          )}
          {activeSection === "meanings" && <MeaningsSection />}
        </main>

        {showAddModal && (
          <AddSystemModal
            newSystem={newSystem}
            onNewSystemChange={handleNewSystemChange}
            onAddSystem={handleAddSystem}
            onCancel={() => setShowAddModal(false)}
          />
        )}
        {showEditModal && (
          <EditSystemModal
            selectedSystem={selectedSystem}
            onFieldChange={handleEditFieldChange}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteSystem}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </div>
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<link href=&quot;https://fonts.googleapis.com/css2?family=Inter&display=swap&quot; rel=&quot;stylesheet&quot;>",
          }}
        />
      </div>
    </>
  );
}

export default AstrologyManagement;