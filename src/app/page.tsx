'use client'
import './globals.css'
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <nav className="p-3 bg-[#ffff] flex relative">
          <Image src='icons/main-logo.svg' alt='logo' width={200} height={200} className='ml-28 mt-2' onClick={() => window.location.href='/'}/>
          <Image src='icons/bag.svg' alt='bag' width={23} height={23} className='absolute right-40 mt-6 pt-1 mr-3'/>
          <button className="text-[#ffff] bg-black absolute font-thin text-xs right-20 mt-6 rounded w-16 h-8" onClick={() => window.location.href='/features'}>Sign In</button>
      </nav>
      <div className='mt-24 flex font-poppins text-6xl subpixel-antialiased font-normal flex'>
        <Image src='images/semicylinder.svg' width={182} height={366} alt='semi'/>
        <div className='mt-12 pl-3'>
          <span>Premium<span className='ml-4 text-[#FC8019] font-bold'>quality<br/>home-cooked</span><span className='ml-3 text-black'>meals</span></span><br/><br/>
          <span className='text-lg font-poppins text-[#404040]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br/> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim,<br/> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo</span>
        </div>
        <Image src='images/rectangle1.svg' alt='rect1' width={400} height={600} className='ml-60'/>
        <Image src='images/rectangle2.svg' alt='rect2' width={300} height={450} className='ml-20'/>
        <Image src='images/rectangle3.svg' alt='rect3' width={49} height={450} className='ml-20'/>
      </div>
    </>
  );
}
