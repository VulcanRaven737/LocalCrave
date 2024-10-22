'use client'
import Head from 'next/head';
import './globals.css'

export default function Home() {
  return (
    <>
      <nav className="p-3 bg-[#d3d3ff] rounded-b-3xl max-w-auto flex relative">
        <img src='icons/main-logo.svg' width={150} height={150} onClick={() => window.location.href='/'}/>
        <button className="text-[#090933] font-bold relative ml-16" onClick={() => window.location.href='/features'}>Features</button>
        <button className="text-[#090933] font-bold relative ml-16" onClick={() => window.location.href='/customer'}>Customers</button>
        <button className="text-[#090933] absolute font-bold right-20 mt-6  rounded-xl text-blueish-100 w-16 h-8" onClick={() => window.location.href='/features'}>Signup</button>
      </nav>
      <h1 className='mt-48 font-mono text-6xl antialiased font-bold flex items-center justify-center'>Local Crave</h1>
      <div className='mt-8 font-mono text-2xl antialiased font-bold flex items-center justify-center'>
        <h1>Discover the best homecooked meals in Bengaluru</h1>
      </div>
    </>
  );
}
