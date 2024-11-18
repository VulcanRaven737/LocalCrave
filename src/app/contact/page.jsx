'use client'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import ParticleBackground from '@/components/particles'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      <main className="container mx-auto flex flex-col items-center justify-start min-h-screen mt-8 md:pt-24 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            Get in <span className="text-[#FC8019] font-bold">Touch</span>
          </h1>
          <p className="mt-6 lg:mt-8 text-base md:text-lg text-[#404040] leading-relaxed">
            Have questions about LocalCrave? We're here to help!
            Reach out to us through any of the following channels or fill out the contact form below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="w-full max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#FC8019] rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Us</h3>
              <p className="text-[#404040]">support@localcrave.com</p>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#FC8019] rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Call Us</h3>
              <p className="text-[#404040]">(080)-132-7546</p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#FC8019] rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Location</h3>
              <p className="text-[#404040]">Bengaluru, India</p>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#FC8019] rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Hours</h3>
              <p className="text-[#404040]">24/7 Support</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Send us a <span className="text-[#FC8019]">Message!</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-[#404040] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FC8019]"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[#404040] mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FC8019]"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-[#404040] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FC8019]"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-[#404040] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FC8019]"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#FC8019] text-white px-8 py-3 rounded flex items-center gap-2 hover:bg-[#e67316] transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}