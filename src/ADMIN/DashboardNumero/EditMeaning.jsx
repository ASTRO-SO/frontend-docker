import React from "react";

function EditMeaning({ 
  selectedNumber, 
  meanings, 
  systems, 
  onMeaningsChange, 
  onSave, 
  onCancel 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-white mb-6">
          Edit Meanings for Number {selectedNumber}
        </h3>
        
        <div className="space-y-4">
          {systems.map((system, index) => (
            <div key={system.id} className="flex flex-col">
              <label className="text-3xl font-medium text-gray-300 mb-2">
                {system.name}
              </label>
              <textarea
                value={meanings[index] || ""}
                onChange={(e) => onMeaningsChange(index, e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
                placeholder={`Enter meaning for ${system.name}...`}
                rows={3}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMeaning;