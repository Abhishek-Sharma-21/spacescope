"use client";

import React, { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

interface Asteroid {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    miss_distance: { kilometers: string };
    orbiting_body: string;
  }>;
}

export default function AsteroidsPage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAsteroids() {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch asteroid data");
        const json = await res.json();
        // Flatten the asteroids for today
        const asteroidsToday = json.near_earth_objects[today] || [];
        setAsteroids(asteroidsToday);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchAsteroids();
  }, []);

  function SkeletonRow() {
    return (
      <tr className="animate-pulse">
        <td className="py-2 px-4"><div className="h-5 w-20 bg-gray-700 rounded" /></td>
        <td className="py-2 px-4"><div className="h-5 w-24 bg-gray-700 rounded" /></td>
        <td className="py-2 px-4"><div className="h-5 w-24 bg-gray-700 rounded" /></td>
        <td className="py-2 px-4"><div className="h-5 w-24 bg-gray-700 rounded" /></td>
        <td className="py-2 px-4"><div className="h-5 w-16 bg-gray-700 rounded" /></td>
      </tr>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Near-Earth Asteroids (Today)</h1>
      <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        This table shows asteroids that are passing close to Earth today, as detected by NASA's Near-Earth Object program. <br />
        <span className="font-semibold">Potentially Hazardous Asteroids</span> are highlighted in red. Hover over the column headers for more info.
      </p>
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2 mr-6">
          <span className="w-4 h-4 inline-block bg-red-400 rounded-full"></span>
          <span className="text-gray-200 text-sm">Potentially Hazardous</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 inline-block bg-green-400 rounded-full"></span>
          <span className="text-gray-200 text-sm">Not Hazardous</span>
        </div>
      </div>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#101c3a] rounded-xl text-white">
            <thead>
              <tr>
                <th className="py-2 px-4" title="The asteroid's official NASA name.">Name 🛈</th>
                <th className="py-2 px-4" title="The date the asteroid will pass closest to Earth.">Close Approach Date 🛈</th>
                <th className="py-2 px-4" title="Estimated minimum and maximum diameter in meters.">Diameter (m) 🛈</th>
                <th className="py-2 px-4" title="The closest distance the asteroid will come to Earth, in kilometers.">Miss Distance (km) 🛈</th>
                <th className="py-2 px-4" title="Is this asteroid considered potentially hazardous by NASA?">Hazardous? 🛈</th>
              </tr>
            </thead>
            <tbody>
              {asteroids.map((ast, idx) => {
                const approach = ast.close_approach_data[0];
                const isHazard = ast.is_potentially_hazardous_asteroid;
                return (
                  <tr
                    key={ast.id}
                    className={`text-center border-t border-gray-700 ${idx % 2 === 0 ? 'bg-[#14224a]' : ''} ${isHazard ? 'bg-red-950' : ''}`}
                  >
                    <td className="py-2 px-4 font-semibold">{ast.name}</td>
                    <td className="py-2 px-4">{approach?.close_approach_date || "-"}</td>
                    <td className="py-2 px-4">
                      {ast.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - {ast.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}
                    </td>
                    <td className="py-2 px-4">{approach?.miss_distance.kilometers ? parseFloat(approach.miss_distance.kilometers).toLocaleString() : "-"}</td>
                    <td className="py-2 px-4">
                      {isHazard ? (
                        <span className="flex items-center gap-1 text-red-400 font-bold"><span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>Yes</span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-400"><span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>No</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {asteroids.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-gray-400">No asteroids found for today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#101c3a] rounded-xl text-white">
            <thead>
              <tr>
                <th className="py-2 px-4" title="The asteroid's official NASA name.">Name 🛈</th>
                <th className="py-2 px-4" title="The date the asteroid will pass closest to Earth.">Close Approach Date 🛈</th>
                <th className="py-2 px-4" title="Estimated minimum and maximum diameter in meters.">Diameter (m) 🛈</th>
                <th className="py-2 px-4" title="The closest distance the asteroid will come to Earth, in kilometers.">Miss Distance (km) 🛈</th>
                <th className="py-2 px-4" title="Is this asteroid considered potentially hazardous by NASA?">Hazardous? 🛈</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
