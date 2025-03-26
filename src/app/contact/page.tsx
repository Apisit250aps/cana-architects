'use client'
import Footer from '@/components/navigate/Footer'
import Navbar from '@/components/navigate/Navbar'
import Image from 'next/image'
import React from 'react'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 container mx-auto py-16 px-6 lg:px-8 flex flex-col items-center">
        {/* <h1 className="text-4xl font-light tracking-tight text-gray-800 mb-16 text-center border-b pb-4 px-8">
          Get in Touch
        </h1> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl w-full">
          {/* Left column - Image */}
          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto">
            <Image
              src="/assets/logo/cana-architects-logo.png"
              alt="Cana Architects Logo"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          {/* Right column - Contact information */}
          <div className="space-y-10 text-center md:text-left">
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-800 border-b pb-2 inline-block">
                Contact Information
              </h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-gray-800">Email</span>
                  <a
                    href="mailto:canaarchitects.works@gmail.com"
                    className="hover:text-gray-900 transition-colors"
                  >
                    canaarchitects.works@gmail.com
                  </a>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-gray-800">Phone</span>
                  <a
                    href="tel:+66 11492444"
                    className="hover:text-gray-900 transition-colors"
                  >
                    +66 11492444
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-800 border-b pb-2 inline-block">
                Social Media
              </h2>
              <div className="flex justify-center md:justify-start space-x-6">
                <a
                  href="https://facebook.com"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex flex-col items-center">
                    <i className="bx bxl-facebook text-2xl"></i>
                    <span className="text-sm mt-1">Facebook</span>
                  </span>
                </a>
                <a
                  href="https://instagram.com"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex flex-col items-center">
                    <i className="bx bxl-instagram text-2xl"></i>
                    <span className="text-sm mt-1">Instagram</span>
                  </span>
                </a>
                <a
                  href="https://tiktok.com"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex flex-col items-center">
                    <i className="bx bxl-tiktok text-2xl"></i>
                    <span className="text-sm mt-1">TikTok</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-800 border-b pb-2 inline-block">
                Business Hours
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: By appointment</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        
      </main>

      <Footer />
    </div>
  )
}
