'use client'

export default function Home() {
  return (
    <nav className="p-3 bg-black max-w-auto flex relative">
      <img src='icons/main-logo.svg' width={150} height={150} onClick={() => window.location.href='/'}/>
      <button className="text-white absolute left-10 ml-32 pl-32 mt-7">Features</button>
      <button className="text-white absolute left-20 ml-32 pl-48 mt-7">Customers</button>
      <button className="text-white absolute right-10 mr-8 mt-6  rounded-xl bg-blueish-100 w-14 h-8">Login</button>
      <button className="text-white absolute right-20 mr-16 mt-6  rounded-xl bg-blueish-100 w-16 h-8 md:hidden">Signup</button>
    </nav>
  );
}
