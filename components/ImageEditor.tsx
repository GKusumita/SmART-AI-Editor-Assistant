
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { PromptInput } from './common/PromptInput';
import { FileUpload } from './common/FileUpload';

export const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [originalImage, setOriginalImage] = useState<{ file: File; preview: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const preview = URL.createObjectURL(file);
    setOriginalImage({ file, preview });
    setEditedImage(null);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter instructions for the edit.');
      return;
    }
    if (!originalImage) {
      setError('Please upload an image to edit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const imageBase64 = await fileToBase64(originalImage.file);
      const result = await editImage(prompt, imageBase64, originalImage.file.type);
      setEditedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Image Editor</h2>
        <p className="text-gray-400 mb-6">Upload an image and describe your desired changes. Add filters, remove objects, and more.</p>

        {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}

        <div className="mb-6">
          <FileUpload onFileSelect={handleFileSelect} accept="image/*" label="Upload an Image" />
        </div>

        {isLoading && (
            <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
                <div className="text-center">
                    <svg className="animate-spin mx-auto h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-2 text-gray-300">Editing in progress...</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {originalImage && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Original</h3>
                    <div className="bg-gray-800 rounded-lg p-2">
                      <img src={originalImage.preview} alt="Original" className="rounded-md w-full" />
                    </div>
                </div>
            )}
            {editedImage && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Edited</h3>
                    <div className="bg-gray-800 rounded-lg p-2">
                      <img src={editedImage} alt="Edited" className="rounded-md w-full" />
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="flex-shrink-0 pt-4 border-t border-gray-700">
        <PromptInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="e.g., Add a retro filter, make it black and white..."
        />
      </div>
    </div>
  );
};
