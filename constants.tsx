
import type { AspectRatio, InstagramAspectRatio, Tool } from './types';

export const VEO_LOADING_MESSAGES = [
  "Summoning digital muses...",
  "Teaching pixels to dance...",
  "This can take a few minutes, time for a coffee?",
  "Composing a cinematic masterpiece for you...",
  "Rendering your vision into reality...",
  "Hold tight, the AI is working its magic...",
];

export const INSTAGRAM_ASPECT_RATIOS: { name: InstagramAspectRatio; value: AspectRatio }[] = [
    { name: 'Post (1:1)', value: '1:1' },
    { name: 'Story (9:16)', value: '9:16' },
    { name: 'Landscape (16:9)', value: '16:9' },
];

export const IMAGEN_ASPECT_RATIOS: { name: string; value: AspectRatio }[] = [
    { name: 'Square (1:1)', value: '1:1' },
    { name: 'Portrait (9:16)', value: '9:16' },
    { name: 'Landscape (16:9)', value: '16:9' },
    { name: 'Portrait (3:4)', value: '3:4' },
    { name: 'Landscape (4:3)', value: '4:3' },
];

export const VEO_ASPECT_RATIOS: { name: string; value: '16:9' | '9:16' }[] = [
    { name: 'Landscape (16:9)', value: '16:9' },
    { name: 'Portrait (9:16)', value: '9:16' },
];

export const MODELS = {
  IMAGE_GENERATION: 'imagen-4.0-generate-001',
  IMAGE_EDITING: 'gemini-2.5-flash-image',
  VIDEO_GENERATION: 'veo-3.1-fast-generate-preview',
  CHAT: 'gemini-2.5-flash',
  COMPLEX_WRITING: 'gemini-2.5-pro',
};
