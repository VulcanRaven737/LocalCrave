 'use client'
 import Image from 'next/image'
 import { useRouter } from 'next/navigation'

 const NavBar = () => {
    const router = useRouter()
 
    return(
        <nav className="w-full p-3 fixed top-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center">
        <Image 
            src='icons/main-logo.svg' 
            alt='logo' 
            width={150} 
            height={150} 
            className='cursor-pointer w-28 md:w-36 lg:w-44 transition-transform hover:scale-105'
            onClick={() => router.push('/')}
        />
        </div>
        
        <div className="flex items-center gap-6">
        <Image 
            src='icons/bag.svg' 
            alt='bag' 
            width={23} 
            height={23} 
            className='w-5 md:w-6 cursor-pointer hover:opacity-80 transition-opacity'
        />
        <button 
            className="bg-black/80 hover:bg-black text-white px-5 py-2.5 rounded text-xs md:text-sm font-thin transition-all hover:shadow-lg"
            onClick={() => router.push('/signin')}
        >
            Sign In
        </button>
        </div>
        </nav>
    );
 };
 
 export default NavBar;
