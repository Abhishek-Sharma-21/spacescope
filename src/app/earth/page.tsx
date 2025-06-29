"use client";

import React, { useEffect, useState } from "react";
import ImageModal from "../../components/ui/ImageModal";

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  date: string;
}

function getImageUrl(image: string, date: string) {
  // date: "2019-05-30 00:39:19"
  const [year, month, day] = date.split(" ")[0].split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image}.png`;
}

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

export default function EarthPage() {
  const [images, setImages] = useState<EpicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const IMAGES_PER_PAGE = 9;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<EpicImage | null>(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.nasa.gov/EPIC/api/natural/images?api_key=${API_KEY}`);
        if (!res.ok) throw new Error("Failed to fetch Earth images");
        const json = await res.json();
        // Sort by date descending (latest first)
        const sorted = json.sort((a: EpicImage, b: EpicImage) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setImages(sorted);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const pagedImages = images.slice((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE);

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Latest Earth Images (NASA EPIC)</h1>
      <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        These images are captured by NASA's EPIC camera on the DSCOVR satellite, showing the sunlit side of Earth as seen from space.
      </p>
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
        <span className="text-white self-center">Page {page} of {totalPages}</span>
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={loading || page === totalPages}
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
          {pagedImages.map(img => (
            <div key={img.identifier} className="bg-[#101c3a] rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer"
              onClick={() => { setSelectedImage(img); setModalOpen(true); }}>
              <img
                src={getImageUrl(img.image, img.date)}
                alt={img.caption}
                className="rounded-lg mb-4 w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="text-white font-semibold mb-1">{new Date(img.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
              <div className="text-gray-400 text-sm text-center">{img.caption}</div>
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
        <span className="text-white self-center">Page {page} of {totalPages}</span>
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={loading || page === totalPages}
        >
          Next
        </button>
      </div>
      {!loading && pagedImages.length === 0 && !error && (
        <div className="text-center text-gray-400 mt-8">No images found.</div>
      )}
      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedImage ? getImageUrl(selectedImage.image, selectedImage.date) : ''}
        alt={selectedImage?.caption || ''}
        caption={selectedImage?.caption}
        date={selectedImage ? new Date(selectedImage.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST' : ''}
      />
    </div>
  );
}
