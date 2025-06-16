import React from "react";

function EditSystemModal({ selectedSystem, onFieldChange, onSaveEdit, onDelete, onCancel }) {
  return (
    <div className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="p-8 rounded-xl bg-zinc-800 max-w-[90%] w-[500px]">
        <h2 className="mb-6 text-xl font-semibold text-white">Edit Numerology System</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-white">
              System Name
            </label>
            <input
              id="edit-name"
              type="text"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
              value={selectedSystem.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="mb-2 block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="edit-description"
              rows="3"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
              value={selectedSystem.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
            />
          </div>

          <div className="flex gap-4 justify-between mt-6">
            <button
              type="button"
              className="px-5 py-2.5 font-medium text-white bg-red-600 rounded-lg"
              onClick={onDelete}
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-5 py-2.5 font-medium text-white bg-transparent rounded-lg border border-zinc-700"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2.5 font-medium text-white bg-green-600 rounded-lg"
                onClick={onSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSystemModal;
