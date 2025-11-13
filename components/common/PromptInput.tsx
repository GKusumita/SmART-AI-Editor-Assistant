
import React from 'react';
import { Button } from './Button';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, isLoading, placeholder }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Describe your vision..."}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 pr-12 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>
      <Button onClick={onSubmit} isLoading={isLoading} className="self-end">
        Generate
      </Button>
    </div>
  );
};
