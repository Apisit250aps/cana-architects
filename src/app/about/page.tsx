'use client'
import Footer from '@/components/navigate/Footer'
import Navbar from '@/components/navigate/Navbar'
import Image from 'next/image'
import React from 'react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 container mx-auto py-16 px-4 md:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left column - Image */}
          <div className="relative aspect-[4/3] w-full max-w-md mx-auto md:mx-0 overflow-hidden">
            <Image
              src="/assets/profile/bank-88.png"
              alt="Cana Architects"
              fill
              className="object-cover rounded-lg shadow-md transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

          {/* Right column - Text content */}
          <div className="space-y-8">
            <h1 className="text-4xl font-light tracking-tight border-b pb-3">
              ABOUT US
            </h1>

            <div className="space-y-6">
              <p className="text-2xl font-light leading-relaxed text-gray-800">
                CANA is an architectural studio <br />
                and interior design.
              </p>

              <div className="space-y-2 font-extralight text-gray-700">
                <p className="text-lg">บริการออกแบบสถาปัตยกรรม</p>
                <p className="text-lg">และสถาปัตยกรรมภายใน</p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="text-2xl font-medium text-gray-900">
                Pohntanate Boonphaeng
              </h2>
              <p className="text-lg text-gray-700">Founder & Architect</p>
              <div className="pt-4">
                <a
                  href={'/contact'}
                  className="inline-block px-6 py-3 text-sm border border-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        {/* <section className="max-w-6xl mx-auto mt-24 px-4">
          <h2 className="text-3xl font-light tracking-tight mb-8 pb-2 border-b">
            Our Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              <p className="text-lg font-light leading-relaxed">
                At CANA Architects, we believe architecture should harmonize
                with both its environment and the people who inhabit it. We
                approach each project with a focus on creating spaces that
                inspire and facilitate meaningful experiences.
              </p>
              <p className="text-lg font-light leading-relaxed">
                Our design process is collaborative and thoughtful, balancing
                aesthetic vision with practical functionality to create enduring
                architectural solutions.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-light leading-relaxed">
                เรามุ่งเน้นการสร้างสรรค์พื้นที่ที่มีความสมดุลระหว่างความงามทางสถาปัตยกรรมและประโยชน์ใช้สอย
                โดยคำนึงถึงบริบทแวดล้อมและความต้องการเฉพาะของลูกค้า
              </p>
              <p className="text-lg font-light leading-relaxed">
                ด้วยประสบการณ์และความเชี่ยวชาญ
                เราพร้อมที่จะร่วมสร้างโครงการที่มีเอกลักษณ์และคุณค่าทางสถาปัตยกรรมอย่างยั่งยืน
              </p>
            </div>
          </div>
        </section> */}

        {/* Services Section */}
        {/* <section className="max-w-6xl mx-auto mt-24 px-4">
          <h2 className="text-3xl font-light tracking-tight mb-8 pb-2 border-b">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-3">Architectural Design</h3>
              <p className="font-light">
                Complete architectural services from concept development to
                construction documentation.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-3">Interior Design</h3>
              <p className="font-light">
                Thoughtful interior spaces that balance aesthetics with
                functionality and comfort.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-3">Project Management</h3>
              <p className="font-light">
                End-to-end project oversight ensuring designs are executed to
                the highest standards.
              </p>
            </div>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  )
}
