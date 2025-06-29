import React from "react";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
  caption?: string;
  date?: string;
}

export default function ImageModal({ open, onClose, imageUrl, alt, caption, date }: ImageModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div
        className="bg-[#101c3a] rounded-xl shadow-2xl p-6 max-w-lg w-full relative flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-red-400"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <img src={imageUrl} alt={alt} className="rounded-lg mb-4 max-h-[60vh] w-auto object-contain" />
        {date && <div className="text-white font-semibold mb-1">{date}</div>}
        {caption && <div className="text-gray-400 text-sm text-center">{caption}</div>}
      </div>
    </div>
  );
} 