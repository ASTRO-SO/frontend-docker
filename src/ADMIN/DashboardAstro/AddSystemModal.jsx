import React from "react";

function AddSystemModal({
  newSystem,
  onNewSystemChange,
  onAddSystem,
  onCancel,
}) {
  return (
    <div className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="p-8 rounded-xl bg-zinc-800 max-w-[90%] w-[500px]">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Add New Astrology System
        </h2>
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="system-name"
              className="mb-2 block text-sm font-medium text-white"
            >
              System Name
            </label>
            <input
              id="system-name"
              type="text"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
              value={newSystem.name}
              onChange={(e) => onNewSystemChange("name", e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="system-description"
              className="mb-2 block text-sm font-medium text-white"
            >
              Description
            </label>
            <textarea
              id="system-description"
              rows="3"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
              value={newSystem.description}
              onChange={(e) => onNewSystemChange("description", e.target.value)}
            />
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              className="px-5 py-2.5 font-medium text-white bg-transparent rounded-lg border border-zinc-700"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2.5 font-medium text-white bg-indigo-700 rounded-lg"
              onClick={onAddSystem}
            >
              Add System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSystemModal;
