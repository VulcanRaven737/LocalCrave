'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings, ChevronDown, ShoppingBag } from 'lucide-react'

async function fetchCartData() {
  try {
    const response = await fetch('/api/cart');
    const cartData = await response.json();
    return cartData;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    return [];
  }
}

const NavBar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchAndSetCartItemCount = async () => {
      const cartData = await fetchCartData();
      setCartItemCount(cartData.length);
    };

    fetchAndSetCartItemCount();

    const socket = new WebSocket('/api/cart/');
    socket.addEventListener('message', () => {
      fetchAndSetCartItemCount();
    });

    return () => {
      socket.close();
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    closeDropdown();
  };

  return (
    <nav className="w-full p-3 fixed top-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 bg-white/10 backdrop-blur-sm">
      <div className="flex items-center">
        <Image
          src="icons/main-logo.svg"
          alt="logo"
          width={150}
          height={150}
          className="cursor-pointer w-28 md:w-36 lg:w-44 transition-transform hover:scale-105"
          onClick={() => router.push('/')}
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Render the cart icon only if userType is not 'chef' */}
        {session?.user?.userType !== 'chef' && (
          <div className="relative">
            <Image
              src="icons/bag.svg"
              alt="bag"
              width={23}
              height={23}
              className="w-5 md:w-6 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/cart')}
            />
            {cartItemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {cartItemCount}
              </div>
            )}
          </div>
        )}

        {status === 'loading' ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : session?.user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        router.push('/orders');
                        closeDropdown();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Your Orders
                    </button>

                    <button
                      onClick={() => {
                        router.push('/profile');
                        closeDropdown();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            className="bg-[#FC8019] hover:bg-black text-white px-5 py-2.5 rounded text-xs md:text-sm font-thin transition-all hover:shadow-lg"
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
