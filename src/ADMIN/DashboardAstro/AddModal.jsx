import React from "react";

function AddModal({ isVisible, activeSection, onCancel, onAdd }) {
  if (!isVisible) return null;

  const sectionTitle =
    activeSection.charAt(0).toUpperCase() + activeSection.slice(1, -1);

  return (
    <div className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="p-8 rounded-xl bg-zinc-800 max-w-[90%] w-[500px]">
        <h3 className="mb-6 text-xl font-semibold text-white">
          Add New {sectionTitle}
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
            />
          </div>

          <div>
            <label
              htmlFor="symbol"
              className="mb-2 block text-sm font-medium text-white"
            >
              Symbol
            </label>
            <input
              id="symbol"
              type="text"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              className="px-4 py-2.5 w-full text-white bg-gray-900 rounded-lg border border-zinc-700"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <button
              className="px-5 py-2.5 font-medium text-white bg-transparent rounded-lg border border-zinc-700"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 font-medium text-white bg-indigo-700 rounded-lg"
              onClick={onAdd}
            >
              Add Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddModal;
