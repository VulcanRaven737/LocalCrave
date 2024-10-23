'use client'
import './globals.css'
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Playwrite+GB+S:ital,wght@0,100..400;1,100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        </style>
      </Head>
      <nav className="p-3 bg-[#ffff] flex relative">
          <img src='icons/main-logo.svg' width={200} height={200} className='ml-28 mt-2' onClick={() => window.location.href='/'}/>
          <img src='icons/bag.svg' width={23} height={23} className='absolute right-40 mt-6 pt-1 mr-3'/>
          <button className="text-[#ffff] bg-black absolute font-thin text-xs right-20 mt-6 rounded w-16 h-8" onClick={() => window.location.href='/features'}>Sign In</button>
      </nav>
      <div className='mt-24 flex font-poppins text-6xl subpixel-antialiased font-normal flex'>
        <img src='images/semicylinder.svg'/>
        <div className='mt-12 pl-3'>
          <span>Premium<span className='ml-4 text-[#FC8019] font-bold'>quality<br/>home-cooked</span><span className='ml-3 text-black'>meals</span></span><br/><br/>
          <span className='text-lg font-poppins text-[#404040]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br/> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim,<br/> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo</span>
        </div>
        <img src='images/rectangle1.svg' className='ml-48'/>
        <img src='images/rectangle2.svg' className='ml-20'/>
        <img src='images/rectangle3.svg' className='ml-20 pl-2'/>
      </div>
    </>
  );
}
