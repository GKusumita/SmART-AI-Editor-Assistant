import React, { useState } from 'react';
import type { Tool } from '../types';

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

// Fix: Moved icon definitions before they are used to prevent block-scoped variable errors.
// Icons
const IconImage = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const IconVideo = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const IconChat = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const IconSparkle = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L12 12l-1.293-1.293a1 1 0 010-1.414L13 7m0 0l2.293 2.293a1 1 0 010 1.414L12 12l-1.293-1.293a1 1 0 010-1.414L13 7zM5 21v-4m-2 2h4m5-16l2.293 2.293a1 1 0 010 1.414L12 12l-1.293-1.293a1 1 0 010-1.414L13 7m0 0l2.293 2.293a1 1 0 010 1.414L12 12l-1.293-1.293a1 1 0 010-1.414L13 7z" /></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>

const tools: { id: Tool; name: string; icon: React.ReactNode }[] = [
  { id: 'image-generator', name: 'Image Generator', icon: <IconImage /> },
  { id: 'image-editor', name: 'Image Editor', icon: <IconEdit /> },
  { id: 'video-generator', name: 'Video Generator', icon: <IconVideo /> },
  { id: 'chatbot', name: 'Chat Assistant', icon: <IconChat /> },
  { id: 'content-writer', name: 'Content Writer', icon: <IconSparkle /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <nav className="flex-1 space-y-2 px-2 py-4">
      {tools.map((tool) => (
        <a
          key={tool.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTool(tool.id);
            setIsOpen(false);
          }}
          className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTool === tool.id
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {tool.icon}
          <span className="ml-3">{tool.name}</span>
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700">
            <span className="sr-only">Open menu</span>
            <IconMenu />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-10 flex transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="h-16 flex-shrink-0 flex items-center justify-center px-4 bg-gray-900">
              <h1 className="text-xl font-bold text-white">Creator's Co-Pilot</h1>
            </div>
            <NavItems />
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Creator's Co-Pilot</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-gray-800 border-r border-gray-700">
            <NavItems />
          </div>
        </div>
      </div>
    </>
  );
};