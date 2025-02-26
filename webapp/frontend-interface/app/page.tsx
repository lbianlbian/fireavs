"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/topbar";

export default function Page() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Parallax */}
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Create%20a%20background%20image%20for%20my%20website,%20want%20the%20image%20to%20be%20a%20simple%20mesh%20globe%20with%20location%20pin%2025-02-2025%20at%2015-25-32-wOnm7nayEWONBg37Ppq0se9q6aYYCJ.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: `center ${scrollY * 0.5}px`,
          backgroundRepeat: "no-repeat",
          opacity: 0.6,
        }}
      />

      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Navbar />
        {/* Hero Section */}
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">BlazeSentry AVS</h1>
          <p className="max-w-2xl text-gray-200 mb-8 text-lg">
            Powering Verifiable and Trustless Fire Insurance with an Eigenlayer AVS. 
          </p>
          <button
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium 
                     hover:bg-orange-400 transform hover:scale-105 transition-all
                     shadow-lg hover:shadow-orange-500/25"
            onClick={window.open("/form", "_self")}
          >
            Verify Fire Data
          </button>
        </main>
      </div>
    </div>
  )
}