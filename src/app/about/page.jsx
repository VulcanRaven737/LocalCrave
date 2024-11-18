'use client'
import { Utensils, Users } from 'lucide-react'
import ParticleBackground from '@/components/particles'

export default function AboutUs() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      <main className="container mx-auto flex flex-col items-center justify-start min-h-screen mt-8 md:pt-24 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            About <span className="text-[#FC8019] font-bold">LocalCrave</span>
          </h1>
          <p className="mt-6 lg:mt-8 text-base md:text-lg text-[#404040] leading-relaxed">
            Born from a college student's vision to bridge the gap between
            busy lives and wholesome home-cooked meals. We understand the
            challenges of balancing academics, work, and healthy eating.
          </p>
        </div>

        {/* Mission Section */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our <span className="text-[#FC8019]">Mission</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FC8019] rounded-full flex items-center justify-center mb-6">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Fresh Home Cooking</h3>
                <p className="text-[#404040] text-lg">
                  We connect you with skilled home chefs who prepare fresh,
                  delicious meals just like you'd make at home.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FC8019] rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Supporting Community</h3>
                <p className="text-[#404040] text-lg">
                  We provide opportunities for talented home chefs while serving
                  busy students and professionals with quality meals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="w-full max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Our <span className="text-[#FC8019]">Story</span>
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <p className="text-[#404040] text-lg leading-relaxed mb-6">
                Started by a group of college students who understood the challenges of
                maintaining a healthy diet while juggling studies, LocalCrave was
                born from a simple idea: connecting busy students with local home
                chefs who could provide nutritious, home-style meals.
              </p>
              <p className="text-[#404040] text-lg leading-relaxed">
                What began as a solution for college students has grown into a
                platform that serves everyone who craves the comfort of home-cooked
                meals but lacks the time to prepare them. We're proud to support
                both our customers and our community of talented home chefs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}