'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ParticleBackground from '@/components/particles'
import { MapPin, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Minus, Plus } from 'lucide-react';

// Demo data remains the same
const demoMenuItems = [
    {
      _id: "1",
      name: "Home-style Dal Makhani",
      description: "Creamy black lentils slow-cooked overnight with authentic spices",
      price: 249,
      image: "/images/dal-makhani.jpeg",
      category: "Main Course",
      cookingTime: "45 mins",
      isVegetarian: true,
      rating: 4.8,
      availableQuantity: 20,
      city: "Bengaluru"
    },
    {
      _id: "2",
      name: "Hyderabadi Chicken Biryani",
      description: "Aromatic basmati rice cooked with tender chicken and signature spices",
      price: 299,
      image: "/images/biriyani.jpeg",
      category: "Main Course",
      cookingTime: "50 mins",
      isVegetarian: false,
      rating: 4.9,
      availableQuantity: 15,
      city: "Hyderabad"
    },
    {
      _id: "3",
      name: "Chennai Style Chettinad Curry",
      description: "Authentic South Indian curry with ground spices and coconut",
      price: 279,
      image: "/images/chettinad.jpeg",
      category: "Main Course",
      cookingTime: "40 mins",
      isVegetarian: false,
      rating: 4.7,
      availableQuantity: 18,
      city: "Chennai"
    },
    {
      _id: "4",
      name: "Paneer Butter Masala",
      description: "Soft paneer cubes in a rich, creamy tomato-based gravy",
      price: 269,
      image: "/images/paneer-butter-masala.jpeg",
      category: "Main Course",
      cookingTime: "35 mins",
      isVegetarian: true,
      rating: 4.6,
      availableQuantity: 25,
      city: "Bengaluru"
    },
    {
      _id: "5",
      name: "Masala Dosa",
      description: "Crispy dosa filled with spiced potato mixture, served with chutney and sambar",
      price: 149,
      image: "/images/masala-dosa.jpeg",
      category: "Snacks",
      cookingTime: "20 mins",
      isVegetarian: true,
      rating: 4.7,
      availableQuantity: 30,
      city: "Chennai"
    },
    {
      _id: "6",
      name: "Hyderabadi Dum Ka Murgh",
      description: "Tender chicken cooked in traditional Hyderabadi style with slow-cooked spices",
      price: 319,
      image: "/images/hyderabadi-dum-ka-murgh.jpeg",
      category: "Main Course",
      cookingTime: "55 mins",
      isVegetarian: false,
      rating: 4.9,
      availableQuantity: 12,
      city: "Hyderabad"
    },
    {
      _id: "7",
      name: "Mysore Masala Dosa",
      description: "Crispy dosa with a spicy chutney spread, served with sambar and coconut chutney",
      price: 169,
      image: "/images/mysore-dosa.jpeg",
      category: "Snacks",
      cookingTime: "20 mins",
      isVegetarian: true,
      rating: 4.6,
      availableQuantity: 20,
      city: "Bengaluru"
    },
    {
      _id: "8",
      name: "Idli with Sambar and Chutney",
      description: "Soft idlis served with sambar and a variety of chutneys",
      price: 129,
      image: "/images/idli-sambar.jpeg",
      category: "Snacks",
      cookingTime: "15 mins",
      isVegetarian: true,
      rating: 4.8,
      availableQuantity: 25,
      city: "Chennai"
    },
    {
      _id: "9",
      name: "Chicken 65",
      description: "Spicy deep-fried chicken bites with a flavorful curry leaf and chili tempering",
      price: 259,
      image: "/images/chicken-65.jpeg",
      category: "Starters",
      cookingTime: "30 mins",
      isVegetarian: false,
      rating: 4.7,
      availableQuantity: 20,
      city: "Chennai"
    },
    {
      _id: "10",
      name: "Pongal",
      description: "Comforting dish made with rice and lentils, tempered with cumin and black pepper",
      price: 179,
      image: "/images/pongal.jpeg",
      category: "Main Course",
      cookingTime: "20 mins",
      isVegetarian: true,
      rating: 4.5,
      availableQuantity: 25,
      city: "Chennai"
    },
    {
      _id: "11",
      name: "Bangalore Beetroot Salad",
      description: "Fresh beetroot salad with coconut, green chili, and tempered mustard seeds",
      price: 129,
      image: "/images/beetroot-salad.jpeg",
      category: "Salads",
      cookingTime: "10 mins",
      isVegetarian: true,
      rating: 4.6,
      availableQuantity: 15,
      city: "Bengaluru"
    },
    {
      _id: "12",
      name: "Bagara Baingan",
      description: "Baby eggplants cooked in a rich, spicy peanut and sesame curry",
      price: 239,
      image: "/images/bagara-baingan.jpeg",
      category: "Main Course",
      cookingTime: "35 mins",
      isVegetarian: true,
      rating: 4.7,
      availableQuantity: 18,
      city: "Hyderabad"
    },
    {
      _id: "13",
      name: "Keema Samosa",
      description: "Crispy samosas filled with spiced minced meat, served with mint chutney",
      price: 199,
      image: "/images/keema-samosa.jpeg",
      category: "Starters",
      cookingTime: "20 mins",
      isVegetarian: false,
      rating: 4.8,
      availableQuantity: 20,
      city: "Hyderabad"
    },
    {
      _id: "14",
      name: "Vegetable Biryani",
      description: "Aromatic basmati rice cooked with fresh vegetables and mild spices",
      price: 229,
      image: "/images/vegetable-biryani.jpeg",
      category: "Main Course",
      cookingTime: "40 mins",
      isVegetarian: true,
      rating: 4.5,
      availableQuantity: 30,
      city: "Bengaluru"
    },
    {
      _id: "15",
      name: "Andhra Pepper Chicken",
      description: "Spicy chicken cooked with crushed black pepper, garlic, and curry leaves",
      price: 299,
      image: "/images/andhra-pepper-chicken.jpeg",
      category: "Main Course",
      cookingTime: "35 mins",
      isVegetarian: false,
      rating: 4.7,
      availableQuantity: 12,
      city: "Chennai"
    },
    {
      _id: "16",
      name: "Hyderabadi Mirchi Ka Salan",
      description: "Green chilies in a creamy, spicy peanut-based gravy",
      price: 209,
      image: "/images/mirchi-salan.jpeg",
      category: "Main Course",
      cookingTime: "30 mins",
      isVegetarian: true,
      rating: 4.6,
      availableQuantity: 18,
      city: "Hyderabad"
    },
    {
      _id: "17",
      name: "Karnataka Style Lemon Rice",
      description: "Rice tempered with mustard seeds, curry leaves, and lemon for a tangy flavor",
      price: 159,
      image: "/images/lemon-rice.jpeg",
      category: "Main Course",
      cookingTime: "15 mins",
      isVegetarian: true,
      rating: 4.5,
      availableQuantity: 25,
      city: "Bengaluru"
    },
    {
      _id: "18",
      name: "Chicken Sukka",
      description: "Dry chicken preparation with coconut, spices, and curry leaves",
      price: 269,
      image: "/images/chicken-sukka.jpeg",
      category: "Main Course",
      cookingTime: "35 mins",
      isVegetarian: false,
      rating: 4.7,
      availableQuantity: 15,
      city: "Chennai"
    },
    {
      _id: "19",
      name: "Paneer Ghee Roast",
      description: "Paneer roasted in ghee with a blend of Mangalorean spices",
      price: 259,
      image: "/images/paneer-ghee-roast.jpeg",
      category: "Starters",
      cookingTime: "25 mins",
      isVegetarian: true,
      rating: 4.8,
      availableQuantity: 20,
      city: "Bengaluru"
    },
];
  

// Available cities and their coordinates (approximate city centers)
const CITY_COORDINATES = {
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 }
};

export default function MenuOfDay() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState(demoMenuItems);
  const [selectedCity, setSelectedCity] = useState("all");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [showQuantityFor, setShowQuantityFor] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});

  // Calculate distance between two coordinates
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  // Find nearest city from coordinates
  const findNearestCity = (latitude, longitude) => {
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

  // Detect user's location
  const detectLocation = async () => {
    setDetectingLocation(true);
    setLocationError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const nearestCity = findNearestCity(latitude, longitude);
      
      if (nearestCity) {
        setSelectedCity(nearestCity);
        fetchMenuItems(nearestCity);
      }
    } catch (error) {
      setLocationError(
        error.code === 1 
          ? "Location access denied. Please enable location services."
          : "Couldn't detect location. Please select city manually."
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  const fetchMenuItems = async (city = "all") => {
    try {
      // When implementing MongoDB, replace this with actual API call:
      // const response = await fetch(`/api/menu?city=${city}`);
      // const data = await response.json();
      // setMenuItems(data);
      
      if (city === "all") {
        setMenuItems(demoMenuItems);
      } else {
        setMenuItems(demoMenuItems.filter(item => item.city === city));
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    if (itemId in itemQuantities) {
      if (itemQuantities[itemId] + change >= 1 && itemQuantities[itemId] + change <= menuItems.find(item => item._id === itemId).availableQuantity) {
        setItemQuantities(prevQuantities => ({...prevQuantities, [itemId]: prevQuantities[itemId] + change }));
      }
    } else {
      if (1 + change >= 1 && 1 + change <= menuItems.find(item => item._id === itemId).availableQuantity) {
        setItemQuantities(prevQuantities => ({...prevQuantities, [itemId]: 1 + change }));
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      <main className="container mx-auto py-8 px-4 relative z-10 mt-32">
        <div className="text-center lg:text-left mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            Our <span className="text-[#FC8019] font-bold">Menu </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#404040] leading-relaxed max-w-2xl">
            Discover our selection of premium home-cooked meals, prepared with love by our expert home chefs.
          </p>
        </div>

        {/* City Filter with Location Detection */}
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

          <div className="flex gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-48">
                <Image 
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="text-[#FC8019] font-bold">₹{item.price}</span>
                </div>
                <p className="text-[#404040] mb-4">{item.description}</p>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center text-sm text-[#404040]">
                      <span className="mr-4">{item.cookingTime}</span>
                      <span>{item.isVegetarian ? "🥬 Veg" : "🍖 Non-veg"}</span>
                   </div>
                   <div className="flex justify-between items-center">
                    {showQuantityFor === item._id && (
                    <div className="flex items-center mr-4 bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="p-1 hover:text-[#FC8019] transition-colors"
                        disabled={(itemQuantities[item._id] || 1) <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-3 min-w-[20px] text-center">
                        {itemQuantities[item._id] || 1}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="p-1 hover:text-[#FC8019] transition-colors"
                        disabled={(itemQuantities[item._id] || 1) >= item.availableQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button 
                    className="bg-[#FC8019] hover:bg-[#e67316] text-white px-6 py-2 rounded transition-colors"
                    onClick={() => {
                      if (showQuantityFor === item._id) {
                        // Proceed to cart logic
                        const selectedItem = menuItems.find(menuItem => menuItem._id === item._id);
                        const quantity = itemQuantities[item._id] || 1;
                        // For demo, simply log the selection; implement actual cart addition logic
                        console.log(`Proceeding to cart with: ${selectedItem.name} x ${quantity}`);
                        router.push('/cart'); // Navigate to cart
                      } else {
                        setShowQuantityFor(item._id);
                      }
                    }}
                  >
                    {showQuantityFor === item._id? 'Proceed' : 'Order Now'}
                  </button>
              </div>
                </div>
                <div className="mt-4 text-sm text-[#404040]">
                  {item.availableQuantity} portions available
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}