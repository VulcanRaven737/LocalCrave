'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ParticleBackground from '@/components/particles'
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      setCartItems(prevItems =>
        prevItems.filter(item => item._id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      <main className="container mt-32 mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-[#404040] hover:text-[#FC8019] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Ordering
          </button>
        </div>

        <div className="text-center lg:text-left mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            Your <span className="text-[#FC8019] font-bold">Cart</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#404040] leading-relaxed max-w-2xl">
            Review and modify your selected home-cooked meals
          </p>
        </div>

        {/* Cart Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-xl text-[#404040]">Your cart is empty</p>
                <button
                  onClick={() => router.push('/menu')}
                  className="mt-4 text-[#FC8019] hover:text-[#e67316] transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div 
                    key={item._id}
                    className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex gap-6">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <span className="text-[#FC8019] font-bold">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                        
                        <p className="text-[#404040] text-sm mt-2">{item.description}</p>
                        
                        <div className="flex items-center text-sm text-[#404040] mt-2">
                          <span>{item.cookingTime}</span>
                          <span className="mx-2">•</span>
                          <span>By {item.chefName}</span>
                          <span className="mx-2">•</span>
                          <span>{item.isVegetarian ? "🥬 Veg" : "🍖 Non-veg"}</span>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-1">
                              <span className="w-8 text-center">{item.quantity}</span>
                            </div>
                            
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="text-[#404040] hover:text-[#FC8019] transition-colors"
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                            
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="text-sm text-[#404040]">
                            ₹{item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[#404040]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#404040]">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <button 
                className="w-full bg-[#FC8019] hover:bg-[#e67316] text-white py-3 rounded-full mt-6 transition-colors"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 text-sm text-[#404040] text-center">
                Free delivery on orders above ₹999
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}