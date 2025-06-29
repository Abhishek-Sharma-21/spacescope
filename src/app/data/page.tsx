'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  date: string;
}

interface Photo {
  id: number;
  img_src: string;
  earth_date: string;
  camera: { full_name: string; name: string };
  rover: { name: string };
}

interface Mission {
  id: string;
  name: string;
  net: string;
  status: { name: string };
  mission?: { description: string };
  image?: string;
  url: string;
}

type TabType = 'apod' | 'asteroids' | 'earth' | 'mars' | 'missions';

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<TabType>('apod');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // APOD Data
  const [apodData, setApodData] = useState<ApodData | null>(null);
  
  // Asteroids Data
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  
  // Earth Data
  const [earthImages, setEarthImages] = useState<EpicImage[]>([]);
  
  // Mars Data
  const [marsPhotos, setMarsPhotos] = useState<Photo[]>([]);
  
  // Missions Data
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch APOD
      const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
      if (apodRes.ok) {
        const apodJson = await apodRes.json();
        setApodData(apodJson);
      }

      // Fetch Asteroids
      const today = new Date().toISOString().slice(0, 10);
      const asteroidsRes = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`
      );
      if (asteroidsRes.ok) {
        const asteroidsJson = await asteroidsRes.json();
        const asteroidsToday = asteroidsJson.near_earth_objects[today] || [];
        setAsteroids(asteroidsToday);
      }

      // Fetch Earth Images
      const earthRes = await fetch(`https://api.nasa.gov/EPIC/api/natural/images?api_key=${API_KEY}`);
      if (earthRes.ok) {
        const earthJson = await earthRes.json();
        const sorted = earthJson.sort((a: EpicImage, b: EpicImage) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEarthImages(sorted.slice(0, 10)); // Limit to 10 most recent
      }

      // Fetch Mars Photos
      const marsRes = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${API_KEY}`);
      if (marsRes.ok) {
        const marsJson = await marsRes.json();
        setMarsPhotos(marsJson.photos.slice(0, 10)); // Limit to 10 photos
      }

      // Fetch Missions
      const missionsRes = await fetch("https://ll.thespacedevs.com/2.2.0/launch/?search=NASA&limit=10&ordering=-net");
      if (missionsRes.ok) {
        const missionsJson = await missionsRes.json();
        setMissions(missionsJson.results);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(image: string, date: string) {
    const [year, month, day] = date.split(" ")[0].split("-");
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image}.png`;
  }

  const tabs = [
    { id: 'apod', label: 'APOD', count: apodData ? 1 : 0 },
    { id: 'asteroids', label: 'Asteroids', count: asteroids.length },
    { id: 'earth', label: 'Earth', count: earthImages.length },
    { id: 'mars', label: 'Mars', count: marsPhotos.length },
    { id: 'missions', label: 'Missions', count: missions.length },
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">All API Data</h1>
      <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        Comprehensive view of all space data from NASA APIs and The Space Devs API
      </p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-[#101c3a] text-gray-300 hover:bg-[#14224a]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          Loading all data...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-12">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* APOD Tab */}
      {activeTab === 'apod' && apodData && (
        <div className="bg-[#101c3a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Astronomy Picture of the Day</h2>
            <Link 
              href="/apod" 
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View Full APOD Page →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{apodData.title}</h3>
              <p className="text-gray-400 mb-2">Date: {apodData.date}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{apodData.explanation}</p>
            </div>
            <div className="flex justify-center">
              {apodData.media_type === 'image' ? (
                <img
                  src={apodData.url}
                  alt={apodData.title}
                  className="max-w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <iframe
                  src={apodData.url}
                  title={apodData.title}
                  className="w-full h-64 rounded-lg"
                  allowFullScreen
                />
              )}
            </div>
          </div>
          <div className="mt-6 p-4 bg-[#14224a] rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>For more details:</strong> Visit our dedicated{' '}
              <Link href="/apod" className="text-purple-400 hover:text-purple-300 underline">
                APOD page
              </Link>{' '}
              to explore the complete Astronomy Picture of the Day archive with enhanced viewing options and detailed explanations.
            </p>
          </div>
        </div>
      )}

      {/* Asteroids Tab */}
      {activeTab === 'asteroids' && (
        <div className="bg-[#101c3a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Near-Earth Asteroids (Today)</h2>
            <Link 
              href="/asteroids" 
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View Full Asteroids Page →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Diameter (m)</th>
                  <th className="py-2 px-4 text-left">Miss Distance (km)</th>
                  <th className="py-2 px-4 text-left">Hazardous</th>
                </tr>
              </thead>
              <tbody>
                {asteroids.map((ast) => {
                  const approach = ast.close_approach_data[0];
                  return (
                    <tr key={ast.id} className="border-b border-gray-800">
                      <td className="py-2 px-4">{ast.name}</td>
                      <td className="py-2 px-4">
                        {ast.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - {ast.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}
                      </td>
                      <td className="py-2 px-4">
                        {approach?.miss_distance.kilometers ? parseFloat(approach.miss_distance.kilometers).toLocaleString() : "-"}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          ast.is_potentially_hazardous_asteroid 
                            ? 'bg-red-900 text-red-200' 
                            : 'bg-green-900 text-green-200'
                        }`}>
                          {ast.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-[#14224a] rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>For more details:</strong> Explore our comprehensive{' '}
              <Link href="/asteroids" className="text-purple-400 hover:text-purple-300 underline">
                Asteroids page
              </Link>{' '}
              featuring detailed asteroid information, hazard assessments, and real-time tracking data from NASA's Near-Earth Object program.
            </p>
          </div>
        </div>
      )}

      {/* Earth Tab */}
      {activeTab === 'earth' && (
        <div className="bg-[#101c3a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Latest Earth Images (EPIC)</h2>
            <Link 
              href="/earth" 
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View Full Earth Page →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earthImages.map((img) => (
              <div key={img.identifier} className="bg-[#14224a] rounded-lg p-3">
                <img
                  src={getImageUrl(img.image, img.date)}
                  alt={img.caption}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-white text-xs font-semibold mb-1">
                  {new Date(img.date).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-xs line-clamp-2">{img.caption}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-[#14224a] rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>For more details:</strong> Visit our dedicated{' '}
              <Link href="/earth" className="text-purple-400 hover:text-purple-300 underline">
                Earth page
              </Link>{' '}
              to explore the complete collection of Earth images captured by NASA's EPIC camera on the DSCOVR satellite, with enhanced viewing options and detailed captions.
            </p>
          </div>
        </div>
      )}

      {/* Mars Tab */}
      {activeTab === 'mars' && (
        <div className="bg-[#101c3a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Mars Rover Photos (Curiosity)</h2>
            <Link 
              href="/mars-rover" 
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View Full Mars Page →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {marsPhotos.map((photo) => (
              <div key={photo.id} className="bg-[#14224a] rounded-lg p-3">
                <img
                  src={photo.img_src}
                  alt={`Mars Rover - ${photo.rover.name}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-white text-xs font-semibold mb-1">{photo.rover.name}</p>
                <p className="text-gray-400 text-xs mb-1">{photo.camera.name}</p>
                <p className="text-gray-500 text-xs">{photo.earth_date}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-[#14224a] rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>For more details:</strong> Explore our comprehensive{' '}
              <Link href="/mars-rover" className="text-purple-400 hover:text-purple-300 underline">
                Mars Rover page
              </Link>{' '}
              featuring the latest images from NASA's Curiosity rover, with detailed camera information, mission updates, and high-resolution viewing options.
            </p>
          </div>
        </div>
      )}

      {/* Missions Tab */}
      {activeTab === 'missions' && (
        <div className="bg-[#101c3a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">NASA Missions</h2>
            <Link 
              href="/missions" 
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View Full Missions Page →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <div key={mission.id} className="bg-[#14224a] rounded-lg p-4">
                <img
                  src={mission.image || `https://placehold.co/300x200?text=${encodeURIComponent(mission.name)}`}
                  alt={mission.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{mission.name}</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Launch: {mission.net ? new Date(mission.net).toLocaleDateString() : 'N/A'}
                </p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  mission.status?.name === 'Success' 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {mission.status?.name || 'Unknown'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-[#14224a] rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>For more details:</strong> Visit our comprehensive{' '}
              <Link href="/missions" className="text-purple-400 hover:text-purple-300 underline">
                Missions page
              </Link>{' '}
              to explore NASA's complete mission portfolio, including detailed mission descriptions, launch schedules, status updates, and mission-specific information.
            </p>
          </div>
        </div>
      )}

      {/* Data Summary */}
      <div className="mt-8 bg-[#101c3a] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {tabs.map((tab) => (
            <div key={tab.id} className="text-center">
              <div className="text-2xl font-bold text-purple-400">{tab.count}</div>
              <div className="text-gray-400 text-sm">{tab.label}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-300 text-sm text-center">
            <strong>Note:</strong> This page provides a quick overview of all available space data. 
            For detailed information, enhanced viewing options, and comprehensive data sets, 
            please visit the respective dedicated pages linked above.
          </p>
        </div>
      </div>
    </div>
  );
} 