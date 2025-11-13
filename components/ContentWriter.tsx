
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { PromptInput } from './common/PromptInput';
import ReactMarkdown from 'react-markdown';

export const ContentWriter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>('');

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedText('');
    try {
      const response = await generateText(prompt, useThinkingMode);
      setGeneratedText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Content Writer</h2>
        <p className="text-gray-400 mb-6">Generate captions, scripts, or any other text content. Enable "Thinking Mode" for complex tasks that require deeper reasoning.</p>
        
        <div className="flex items-center justify-end mb-4">
          <label htmlFor="thinking-mode" className="mr-3 text-sm font-medium text-gray-300">Thinking Mode</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                  type="checkbox" 
                  name="thinking-mode" 
                  id="thinking-mode"
                  checked={useThinkingMode}
                  onChange={() => setUseThinkingMode(!useThinkingMode)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label htmlFor="thinking-mode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
          </div>
          <style>{`.toggle-checkbox:checked { right: 0; border-color: #4f46e5; } .toggle-checkbox:checked + .toggle-label { background-color: #4f46e5; }`}</style>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 bg-gray-800 rounded-lg p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
              <div className="text-center">
                  <svg className="animate-spin mx-auto h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p className="mt-2 text-gray-300">Generating content...</p>
              </div>
          </div>
        ) : (
          <article className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-gray-100 prose-strong:text-white">
            <ReactMarkdown>{generatedText}</ReactMarkdown>
          </article>
        )}
      </div>

      <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-700">
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <PromptInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="e.g., Write a 5-part Instagram carousel post about the benefits of..."
        />
      </div>
    </div>
  );
};
