import React, { useState, useEffect } from 'react';
import { generateVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { useVeoApiKey } from '../hooks/useVeoApiKey';
import { VEO_LOADING_MESSAGES, VEO_ASPECT_RATIOS } from '../constants';
import { Button } from './common/Button';
import { PromptInput } from './common/PromptInput';
import { FileUpload } from './common/FileUpload';

export const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(VEO_LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { isKeyReady, isChecking, promptForKey, handleApiError } = useVeoApiKey();

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = VEO_LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % VEO_LOADING_MESSAGES.length;
          return VEO_LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileSelect = (file: File) => {
    setImage(file);
    setVideoUrl(null);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() && !image) {
      setError('Please enter a prompt or upload an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      let imagePayload;
      if (image) {
        const base64 = await fileToBase64(image);
        imagePayload = { base64, mimeType: image.type };
      }
      // Fix: Update function call to match new signature with aspectRatio before image.
      const url = await generateVideo(prompt, aspectRatio, imagePayload);
      setVideoUrl(url);
    } catch (err) {
      handleApiError(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return <div className="text-center p-8">Checking for API key...</div>;
  }

  if (!isKeyReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-semibold mb-4">API Key Required for Video Generation</h2>
        <p className="text-gray-400 mb-6 max-w-md">Veo video generation requires a user-selected API key. Please select a key to continue. Ensure your project has billing enabled.</p>
        <Button onClick={promptForKey}>Select API Key</Button>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="mt-4 text-sm text-indigo-400 hover:underline">
          Learn more about billing
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Video Generator</h2>
        <p className="text-gray-400 mb-6">Animate an image or create a video from scratch with a text prompt.</p>

        {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}

        <div className="space-y-6">
          <FileUpload onFileSelect={handleFileSelect} accept="image/*" label="Upload starting image (optional)" />

          <div className="text-gray-300">
              <label htmlFor="aspect-ratio-video" className="block text-sm font-medium mb-2">Aspect Ratio</label>
              <select
                  id="aspect-ratio-video"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                  {VEO_ASPECT_RATIOS.map(ratio => (
                      <option key={ratio.value} value={ratio.value}>{ratio.name}</option>
                  ))}
              </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg mt-6">
              <div className="text-center">
                  <svg className="animate-spin mx-auto h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p className="mt-4 text-gray-300 animate-pulse">{loadingMessage}</p>
              </div>
          </div>
        )}
        
        {videoUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Generated Video</h3>
            <div className="bg-gray-800 rounded-lg p-2">
              <video src={videoUrl} controls autoPlay loop className="w-full rounded-md" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pt-4 border-t border-gray-700">
        <PromptInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="e.g., A majestic eagle soaring over mountains..."
        />
      </div>
    </div>
  );
};