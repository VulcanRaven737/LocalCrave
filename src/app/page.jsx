'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ParticleBackground from '@/components/particles'
import ReviewsInfiniteScroll from '@/components/reviews'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Redirect chef users to /chefs page
    if (status === 'authenticated' && session?.user?.userType === 'chef') {
      router.push('/chefs')
    }
  }, [status, session, router])

  if (status === 'loading') {
    // Show a loading state while the session is being fetched
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.userType === 'chef') {
    // Avoid rendering the Home page while redirecting
    return null
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      {/* Main Content */}
      <main className="container mx-auto flex items-center justify-center min-h-screen mt-8 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="text-center lg:text-left lg:max-w-[45%]">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight">
              Premium <span> </span>
              <span className="text-[#FC8019] font-bold block sm:inline">
                quality <br className="hidden lg:hidden" />
                home-cooked
              </span>
              <span className="text-black block sm:inline mt-2 sm:mt-0 sm:ml-2">
                meals
              </span>
            </h1>
            <p className="mt-6 lg:mt-8 text-base md:text-lg text-[#404040] leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
              Discover the comfort of fresh, home-cooked meals delivered right
              to your door. Ideal for anyone craving homemade flavors without
              the hassle of cooking, we offer a convenient, delicious way to
              enjoy nourishing meals that feel like home!
            </p>
            <div className="hidden md:hidden lg:block">
              <p className="mt-6 lg:mt-8 text-base md:text-lg text-black leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0 font-bold">
                Popular cities in India
              </p>
              <p className="mt-4 lg:mt-6 text-base md:text-lg text-black leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
                <button
                  onClick={() => router.push('/ourchefs')}
                  className="text-[#404040] hover:text-[#FC8019] transition-colors"
                >
                  Bengaluru
                </button>
                <button
                  onClick={() => router.push('/ourchefs')}
                  className="ml-4 text-[#FC8019] hover:text-[#404040] transition-colors"
                >
                  Chennai
                </button>
                <button
                  onClick={() => router.push('/ourchefs')}
                  className="ml-4 text-[#404040] hover:text-[#FC8019] transition-colors"
                >
                  Hyderabad
                </button>
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div
              className="flex gap-4 md:gap-6 items-end overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 
                          max-w-full scrollbar-hide"
            >
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="images/rectangle1.svg"
                  alt="rect1"
                  width={400}
                  height={600}
                  className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 rounded-2xl shadow-lg"
                />
              </div>
              <div className="relative transform hover:scale-105 transition-transform duration-300 -mt-12">
                <Image
                  src="images/rectangle2.svg"
                  alt="rect2"
                  width={300}
                  height={450}
                  className="w-44 sm:w-48 md:w-56 lg:w-64 flex-shrink-0 rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <ReviewsInfiniteScroll />
    </div>
  )
}
