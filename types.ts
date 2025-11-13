export type Tool = 'image-generator' | 'image-editor' | 'video-generator' | 'chatbot' | 'content-writer';

export type AspectRatio = '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
export type InstagramAspectRatio = 'Post (1:1)' | 'Story (9:16)' | 'Landscape (16:9)';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  groundingChunks?: any[];
}

// Fix: Moved global type declaration here to prevent re-declaration errors.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}