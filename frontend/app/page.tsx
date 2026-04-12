'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">UptimeMonitor</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Monitor Your APIs & Websites
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Real-time uptime monitoring with instant incident detection. Know when your services go down before your users do.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-lg">Real-time Monitoring</h3>
              <p className="text-gray-600 text-sm mt-2">Check every 60 seconds</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="font-bold text-lg">Instant Alerts</h3>
              <p className="text-gray-600 text-sm mt-2">Get notified immediately</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-lg">Detailed Stats</h3>
              <p className="text-gray-600 text-sm mt-2">Uptime % & response times</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 inline-block font-medium"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-md hover:bg-blue-50 inline-block font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>© 2026 UptimeMonitor. All rights reserved.</p>
      </footer>
    </div>
  );
}