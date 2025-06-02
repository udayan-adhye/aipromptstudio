import React from 'react';

const ExamplePair = ({ id, idx, input, output, onChange, onRemove, disableRemove }) => {
  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700">Example Pair {idx + 1}</span>
        {!disableRemove && (
          <button
            onClick={() => onRemove(id)}
            className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
            aria-label={`Remove example pair ${idx + 1}`}
          >
            Remove
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <label htmlFor={`example-input-${id}`} className="text-sm font-medium text-gray-700 block mb-1">
            📝 Sample question or input:
          </label>
          <input
            type="text"
            id={`example-input-${id}`}
            value={input}
            onChange={(e) => onChange(id, 'input', e.target.value)}
            placeholder='e.g., "How good is this product: The battery lasts all day!"'
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        
        <div>
          <label htmlFor={`example-output-${id}`} className="text-sm font-medium text-gray-700 block mb-1">
            ✅ Perfect response you want:
          </label>
          <input
            type="text"
            id={`example-output-${id}`}
            value={output}
            onChange={(e) => onChange(id, 'output', e.target.value)}
            placeholder='e.g., "Positive review - mentions good battery life"'
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ExamplePair;