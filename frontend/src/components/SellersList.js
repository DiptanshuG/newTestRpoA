import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Sellers from './Sellers'

const SellersList = () => {
    const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar></Sidebar>
        <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">6</span>
                <span>🔔</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                AU
              </div>
              <div className="flex items-center">
                <span className="font-medium">Admin User</span>
                <span className="ml-1">▼</span>
              </div>
            </div>
          </div>
        </header>
        <Sellers/>
        </div>
        </div>
  )
}

export default SellersList