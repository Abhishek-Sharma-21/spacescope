"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Mission {
  id: string;
  name: string;
  net: string; // launch date
  status: { name: string };
  mission?: { description: string };
  image?: string;
  url: string;
}

export default function MissionsPage() {
  const BASE_URL = "https://ll.thespacedevs.com/2.2.0/launch/?search=NASA&limit=18&ordering=-net";
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState(BASE_URL);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchMissions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch missions");
        const json = await res.json();
        setMissions(json.results);
        setNextUrl(json.next);
        setPrevUrl(json.previous);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchMissions();
  }, [apiUrl, retryCount]);

  // Filter missions by name (client-side)
  const filteredMissions = search.trim()
    ? missions.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    : missions;

  function Pagination({ className = "" }: { className?: string }) {
    return (
      <div className={`flex justify-center mb-6 gap-4 ${className}`}>
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => prevUrl && setApiUrl(prevUrl)}
          disabled={!prevUrl || loading}
        >
          Previous
        </button>
        <button
          className="bg-[#101c3a] text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => nextUrl && setApiUrl(nextUrl)}
          disabled={!nextUrl || loading}
        >
          Next
        </button>
      </div>
    );
  }

  function SkeletonCard() {
    return (
      <div className="bg-[#101c3a] rounded-xl shadow-lg p-4 flex flex-col items-center animate-pulse">
        <div className="rounded-lg mb-4 w-full h-48 bg-gray-700" />
        <div className="h-5 w-2/3 bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
        <div className="h-3 w-1/3 bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">NASA Missions</h1>
      <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        Explore NASA's recent and upcoming missions, with images curated for each mission.
      </p>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search missions by name..."
          className="w-full max-w-md px-4 py-2 rounded bg-[#101c3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {error && (
        <div className="text-center text-red-500 flex flex-col items-center gap-2 mb-4">
          <span>Sorry, we couldn't load the missions. Please check your connection or try again later.</span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setRetryCount(c => c + 1)}
          >
            Retry
          </button>
        </div>
      )}
      <Pagination />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-2 gap-8">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-2 gap-8">
          {filteredMissions.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400">No missions found.</div>
          ) : (
            filteredMissions.map(mission => (
              <Link key={mission.id} href={`/missions/${mission.id}`} className="bg-[#101c3a] rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
                <img
                  src={mission.image || `https://placehold.co/600x400?text=${encodeURIComponent(mission.name)}`}
                  alt={mission.name}
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                  loading="lazy"
                  style={{ background: '#222', objectFit: 'cover' }}
                />
                <div className="text-white font-bold text-lg mb-1 text-center">{mission.name}</div>
                <div className="text-gray-400 text-sm mb-1">Launch: {mission.net ? new Date(mission.net).toLocaleDateString() : 'N/A'}</div>
                <div className={`text-xs font-semibold mb-2 ${mission.status?.name === 'Success' ? 'text-green-400' : 'text-gray-400'}`}>{mission.status?.name || 'Unknown'}</div>
                <span className="mt-auto text-blue-400 hover:underline text-sm font-semibold">View details</span>
              </Link>
            ))
          )}
        </div>
      )}
      <Pagination className="mt-8" />
    </div>
  );
}
