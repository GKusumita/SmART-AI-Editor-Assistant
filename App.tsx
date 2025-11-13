
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageEditor } from './components/ImageEditor';
import { VideoGenerator } from './components/VideoGenerator';
import { Chatbot } from './components/Chatbot';
import { ContentWriter } from './components/ContentWriter';
import type { Tool } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('image-generator');

  const renderTool = () => {
    switch (activeTool) {
      case 'image-generator':
        return <ImageGenerator />;
      case 'image-editor':
        return <ImageEditor />;
      case 'video-generator':
        return <VideoGenerator />;
      case 'chatbot':
        return <Chatbot />;
      case 'content-writer':
        return <ContentWriter />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderTool()}
      </main>
    </div>
  );
};

export default App;
