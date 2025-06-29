"use client"

import React, { useEffect, useState } from 'react';
import ImageModal from "../../components/ui/ImageModal";

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

interface Photo {
  id: number;
  img_src: string;
  earth_date: string;
  camera: { full_name: string; name: string };
  rover: { name: string };
}

export default function MarsRoverPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch Mars Rover photos');
        const json = await res.json();
        setPhotos(json.photos);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [page]);

  function SkeletonCard() {
    return (
      <div className="bg-[#101c3a] rounded-xl shadow-lg p-4 flex flex-col items-center animate-pulse">
        <div className="rounded-lg mb-4 w-full h-48 bg-gray-700" />
        <div className="h-5 w-2/3 bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
        <div className="h-3 w-1/3 bg-gray-700 rounded mb-2" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Mars Rover Photos</h1>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="flex justify-center mb-6 gap-4">
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span className="text-white self-center">Page {page}</span>
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={loading || photos.length === 0}
        >
          Next
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {photos.map(photo => (
            <div key={photo.id} className="bg-[#101c3a] rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer"
              onClick={() => { setSelectedPhoto(photo); setModalOpen(true); }}>
              <img
                src={photo.img_src}
                alt={`Mars Rover - ${photo.rover.name}`}
                className="rounded-lg mb-4 w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="text-white font-semibold mb-1">{photo.rover.name}</div>
              <div className="text-gray-400 text-sm mb-1">{photo.camera.full_name} ({photo.camera.name})</div>
              <div className="text-gray-500 text-xs">{photo.earth_date}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6 gap-4">
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span className="text-white self-center">Page {page}</span>
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={loading || photos.length === 0}
        >
          Next
        </button>
      </div>
      {!loading && photos.length === 0 && !error && (
        <div className="text-center text-gray-400 mt-8">No photos found for this sol and page.</div>
      )}
      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedPhoto?.img_src || ''}
        alt={selectedPhoto ? `Mars Rover - ${selectedPhoto.rover.name}` : ''}
        caption={selectedPhoto ? `${selectedPhoto.camera.full_name} (${selectedPhoto.camera.name})` : ''}
        date={selectedPhoto?.earth_date || ''}
      />
    </div>
  );
}
