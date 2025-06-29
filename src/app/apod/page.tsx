'use client'

import React, { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

interface ApodData {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export default function ApodPage() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApod() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch APOD');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchApod();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[60vh] py-10 px-4">
      <div className="bg-[#0a1733] rounded-2xl shadow-xl flex flex-col md:flex-row max-w-6xl w-full overflow-hidden">
        {loading && <div className="w-full text-center text-gray-400 py-12">Loading...</div>}
        {error && <div className="w-full text-center text-red-500 py-12">{error}</div>}
        {data && (
          <>
            {/* Left: Text */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="text-gray-300 text-sm mb-1">Astronomy Picture of the Day</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{data.title}</h2>
              <div className="text-gray-400 text-sm mb-4">{data.date}</div>
              <div className="text-gray-200 mb-6">
                {data.explanation}
              </div>
              {data.hdurl && (
                <a
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-400 hover:underline mt-2"
                >
                  View HD Image
                </a>
              )}
            </div>
            {/* Right: Image */}
            <div className="flex-1 flex items-stretch justify-center bg-[#101c3a]">
              {data.media_type === 'image' ? (
                <img
                  src={data.url}
                  alt={data.title}
                  className="h-full w-full object-cover rounded-none md:rounded-r-2xl"
                />
              ) : (
                <iframe
                  src={data.url}
                  title={data.title}
                  className="w-full h-full rounded-none md:rounded-r-2xl"
                  allowFullScreen
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
