'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useRouter } from 'next/navigation'

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="bg-white/10 backdrop-blur-sm text-black py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo */}
          <div className="w-full md:w-auto mb-6 md:mb-0">
            <Image 
              src='/icons/main-logo.svg' 
              alt='logo' 
              width={150} 
              height={150} 
              className='w-28 md:w-36 lg:w-44 transition-transform hover:scale-105'
              onClick={()=>router.push('/')}
            />
          </div>

          {/* Navigation Links */}
          <nav className="w-full md:w-auto mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-end gap-6">
              <li>
                <Link href="/about" className="text-sm hover:text-[#FC8019] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ourchefs" className="text-sm hover:text-[#FC8019] transition-colors">
                  Our Chefs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-[#FC8019] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-[#FC8019] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Media Icons */}
          <div className="w-full md:w-auto flex justify-center md:justify-end gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#FC8019] transition-colors">
              <Facebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#FC8019] transition-colors">
              <Instagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#FC8019] transition-colors">
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center justify-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} LocalCrave. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
