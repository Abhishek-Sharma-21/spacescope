"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MissionDetailPage() {
  const params = useParams();
  const id = params?.slug as string;
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMission() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://ll.thespacedevs.com/2.2.0/launch/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch mission details");
        const json = await res.json();
        setMission(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMission();
  }, [id]);

  if (loading) return <div className="text-center text-gray-400 py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!mission) return <div className="text-center text-gray-400 py-10">Mission not found.</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8 items-start bg-[#101c3a] rounded-xl shadow-lg p-6">
        {/* Left: Details */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{mission.name}</h1>
          <div className="mb-2 text-gray-400">Launch: {mission.net ? new Date(mission.net).toLocaleString() : 'N/A'}</div>
          <div className={`mb-4 text-xs font-semibold ${mission.status?.name === 'Success' ? 'text-green-400' : 'text-gray-400'}`}>{mission.status?.name || 'Unknown'}</div>
          <div className="text-gray-300 text-base mb-4 whitespace-pre-line" style={{lineHeight: '1.7'}}>
            {mission.mission?.description || 'No description available.'}
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={mission.image || `https://placehold.co/600x400?text=${encodeURIComponent(mission.name)}`}
            alt={mission.name}
            className="rounded-lg max-w-full max-h-[400px] object-contain shadow-xl"
            style={{ background: '#222' }}
          />
        </div>
      </div>
    </div>
  );
}
