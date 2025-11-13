
import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createChat, sendMessageWithGrounding } from '../services/geminiService';
import type { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createChat());
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async () => {
    if (!message.trim() || !chat || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
    setHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageWithGrounding(chat, message);
      const modelMessage: ChatMessage = { 
        role: 'model', 
        parts: [{ text: response.text }],
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
      setHistory(prev => [...prev, modelMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-100 mb-4 flex-shrink-0">Chat Assistant</h2>
      <p className="text-gray-400 mb-6 flex-shrink-0">Ask questions, brainstorm ideas, or get help with your content. Powered by Google Search for up-to-date info.</p>

      <div ref={chatContainerRef} className="flex-grow bg-gray-800 rounded-lg p-4 space-y-4 overflow-y-auto">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              {msg.role === 'model' && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <h4 className="text-xs font-semibold text-gray-400 mb-1">Sources:</h4>
                  <ul className="text-xs space-y-1">
                    {msg.groundingChunks.map((chunk, i) => (
                      chunk.web && <li key={i}><a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline break-all">{chunk.web.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
            <div className="max-w-lg p-3 rounded-lg bg-gray-700 text-gray-200">
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2 delay-150"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-700">
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 px-5 pr-12 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button onClick={handleSubmit} disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 hover:text-indigo-300 disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
