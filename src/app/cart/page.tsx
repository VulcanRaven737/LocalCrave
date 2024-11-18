'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ParticleBackground from '@/components/particles'
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface CartItem {
  userId: string;
  chefId: string;
  chefName: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  image: string;
  addedAt: string;
}

export default function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage when component mounts
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Filter cart items for current user
      const userCartItems = parsedCart.filter(
        (item: CartItem) => item.userId === session?.user?.id
      );
      setCartItems(userCartItems);
    }
    setLoading(false);
  }, [session]);

  const updateLocalStorage = (updatedItems: CartItem[]) => {
    // Get all existing cart items
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Remove items for this user
    const filteredCart = existingCart.filter(
      (item: CartItem) => item.userId !== session?.user?.id
    );

    // Add updated items back
    const newCart = [...filteredCart, ...updatedItems];
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(updatedItems);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      const updatedItems = cartItems.filter(item => item.itemId !== itemId);
      updateLocalStorage(updatedItems);
    } else {
      // Update quantity
      const updatedItems = cartItems.map(item => 
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      );
      updateLocalStorage(updatedItems);
    }
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.itemId !== itemId);
    updateLocalStorage(updatedItems);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 999 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to view your cart</h2>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-[#FC8019] hover:bg-[#e67316] text-white px-6 py-2 rounded-full transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      <main className="container mt-32 mx-auto py-8 px-4 relative z-10">
        {/* Rest of the existing component remains the same */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC8019] mx-auto"></div>
          </div>
        ) : (
          // Existing rendering logic
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items section */}
            <div className="lg:col-span-2">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                  <p className="text-xl text-[#404040]">Your cart is empty</p>
                  <button
                    onClick={() => router.push('/ourchefs')}
                    className="mt-4 text-[#FC8019] hover:text-[#e67316] transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                // Existing cart items rendering
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div 
                      key={item.itemId}
                      className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300"
                    >
                      {/* Existing item rendering logic */}
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image
                            src={item.image || '/images/food.jpeg'}
                            alt={item.itemName}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="text-xl font-semibold">{item.itemName}</h3>
                            <span className="text-[#FC8019] font-bold">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              
                              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-1">
                                <span className="w-8 text-center">{item.quantity}</span>
                              </div>
                              
                              <button
                                onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                                className="text-[#404040] hover:text-[#FC8019] transition-colors"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                              
                              <button
                                onClick={() => removeItem(item.itemId)}
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

            {/* Order Summary section - remains the same */}
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
                  onClick={() => router.push('/checkout')}
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
        )}
      </main>
    </div>
  );
}

