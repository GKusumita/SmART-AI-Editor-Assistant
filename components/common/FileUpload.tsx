
import React, { useRef, useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept, label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith(accept.split('/')[0])) {
      setFileName(file.name);
      onFileSelect(file);
       const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect, accept]);

  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        htmlFor="file-upload"
        className="relative block w-full border-2 border-gray-600 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
      >
        {preview ? (
          <>
            {accept.startsWith('image/') && <img src={preview} alt="Preview" className="mx-auto h-32 rounded-lg" />}
            {accept.startsWith('video/') && <video src={preview} controls className="mx-auto h-32 rounded-lg" />}
            <p className="mt-2 text-sm text-gray-400">{fileName}</p>
          </>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="mt-2 block text-sm font-semibold text-indigo-400">{label}</span>
            <span className="mt-1 block text-xs text-gray-500">or drag and drop</span>
          </>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
        />
      </label>
    </div>
  );
};
