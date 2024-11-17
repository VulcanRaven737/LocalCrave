'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ParticleBackground from '@/components/particles'
import { MapPin, Loader2, Star, Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChefCard } from '@/components/ChefCard'

const CITY_COORDINATES = {
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 }
};

interface Chef {
  _id: string;
  email: string;
  name: string;
  image: string | null;
  createdAt: string;
  rating?: number;
  specialities?: string[];
  city?: string;
}

export default function ChefsPage() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [selectedCity, setSelectedCity] = useState("all");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status } = useSession();

  const fetchChefs = async (city = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL('/api/ourchefs', window.location.origin);
      if (city !== 'all') url.searchParams.append('city', city);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chefs: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setChefs(data);
    } catch (error) {
      console.error('Error fetching chefs:', error);
      setError('Failed to load chefs. Please try again later.');
      toast.error('Failed to load chefs. Please try again later.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchChefs(selectedCity);
    }
  }, [selectedCity, status, session?.user?.id]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestCity = (latitude: number, longitude: number) => {
    let nearestCity = null;
    let shortestDistance = Infinity;
  
    Object.entries(CITY_COORDINATES).forEach(([city, coords]) => {
      const distance = getDistance(latitude, longitude, coords.lat, coords.lng);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity;
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    setLocationError("");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const nearestCity = findNearestCity(latitude, longitude);
      
      if (nearestCity) {
        setSelectedCity(nearestCity);
      }
    } catch (error: any) {
      setLocationError(
        error.code === 1 
          ? "Location access denied. Please enable location services."
          : "Couldn't detect location. Please select city manually."
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FC8019]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please log in to view our chefs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      <ToastContainer />
      
      <main className="container mx-auto py-8 px-4 relative z-10 mt-32">
        <div className="text-center lg:text-left mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            Our <span className="text-[#FC8019] font-bold">Chefs </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#404040] leading-relaxed max-w-2xl">
            Meet our talented home chefs who bring their passion and expertise to your table.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-black font-bold">Select City</p>
            <button
              onClick={detectLocation}
              disabled={detectingLocation}
              className="flex items-center gap-2 text-[#FC8019] hover:text-[#e67316] transition-colors"
            >
              {detectingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {detectingLocation ? "Detecting..." : "Detect my location"}
            </button>
          </div>
          
          {locationError && (
            <p className="text-red-500 text-sm mb-4">{locationError}</p>
          )}

          <div className="flex gap-4 mb-4">
            {["all", "Bengaluru", "Chennai", "Hyderabad"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-base transition-colors ${
                  selectedCity === city 
                    ? 'text-[#FC8019]' 
                    : 'text-[#404040] hover:text-[#FC8019]'
                }`}
              >
                {city === "all" ? "All Cities" : city}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FC8019]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchChefs(selectedCity)}
              className="px-4 py-2 bg-[#FC8019] text-white rounded-md hover:bg-[#e67316] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : chefs.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-[#404040]">No chefs found in this area yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map((chef) => (
              <ChefCard 
                key={chef._id} 
                chef={chef} 
                userId={session?.user?.id || ''} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
