'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function CustomerCareChat() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-300"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Simple Chat Box (you can integrate a full chat later) */}
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-white text-black p-4 rounded-lg shadow-xl border border-gray-300">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Customer Support</span>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-600 hover:text-black">✕</button>
          </div>
          <p className="text-sm mb-2">Hi! How can we help you today?</p>
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}
