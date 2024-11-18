'use client'
import { ChevronDown, HelpCircle, Search } from 'lucide-react'
import ParticleBackground from '@/components/particles'
import { useState } from 'react'

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeIndex, setActiveIndex] = useState(null)

  const faqCategories = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What is LocalCrave?",
          answer: "LocalCrave is a platform that connects you with local home chefs who prepare and deliver fresh, home-cooked meals directly to your doorstep. Founded by college students, we aim to provide convenient access to quality, homestyle cooking."
        },
        {
          question: "How does LocalCrave work?",
          answer: "Simply browse our selection of local chefs, view their menus, and place your order through our platform. The chef will prepare your meal fresh and it will be delivered to your specified location within the delivery timeframe."
        },
        {
          question: "What areas do you serve?",
          answer: "We currently operate in major Indian cities including Bengaluru, Chennai, and Hyderabad. We're continuously expanding to new areas to serve more communities."
        }
      ]
    },
    {
      title: "Ordering & Delivery",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "You can place an order through our website or mobile app. Simply select your location, choose a chef, select your meals, and proceed to checkout. You'll receive updates about your order status via email and SMS."
        },
        {
          question: "What are the delivery hours?",
          answer: "Delivery hours vary by location and chef availability. Most chefs offer delivery during standard meal times: 11:30 AM - 2:30 PM for lunch and 6:30 PM - 9:30 PM for dinner."
        },
        {
          question: "Is there a minimum order value?",
          answer: "Minimum order values may vary by chef and location. This information is clearly displayed when you select a chef and begin your order."
        }
      ]
    },
    {
      title: "Payment & Pricing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI payments, net banking, and popular digital wallets. All payments are processed securely through our platform."
        },
        {
          question: "How is the pricing determined?",
          answer: "Prices are set by individual chefs based on ingredients, portion sizes, and preparation complexity. All prices are clearly displayed on the menu, including any applicable delivery charges."
        }
      ]
    }
  ]

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      <main className="container mx-auto flex flex-col items-center justify-start min-h-screen mt-8 md:pt-24 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            Frequently Asked <span className="text-[#FC8019] font-bold">Questions</span>
          </h1>
          <p className="mt-6 lg:mt-8 text-base md:text-lg text-[#404040] leading-relaxed">
            Find answers to common questions about LocalCrave's services, ordering process, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FC8019]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                <span className="text-[#FC8019]">{category.title}</span>
              </h2>
              
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <div
                    key={faqIndex}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                      onClick={() => toggleAccordion(categoryIndex * 100 + faqIndex)}
                    >
                      <div className="flex items-center gap-4">
                        <HelpCircle className="w-5 h-5 text-[#FC8019] flex-shrink-0" />
                        <span className="font-semibold text-lg">{faq.question}</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#FC8019] transform transition-transform duration-200 ${
                          activeIndex === categoryIndex * 100 + faqIndex ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <div
                      className={`px-6 pb-4 transition-all duration-200 ${
                        activeIndex === categoryIndex * 100 + faqIndex
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      <p className="text-[#404040] pl-9">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="w-full max-w-2xl mx-auto text-center mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-[#404040] mb-6">
              Can't find the answer you're looking for? Please feel free to reach out to our friendly team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#FC8019] text-white px-6 py-3 rounded hover:bg-[#e67316] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}