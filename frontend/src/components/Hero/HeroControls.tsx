'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroControls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <div className="absolute inset-y-0 left-0 z-30 flex items-center pl-2 sm:pl-4">
        <button onClick={onPrev} className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition">
          <ChevronLeft size={28} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 z-30 flex items-center pr-2 sm:pr-4">
        <button onClick={onNext} className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition">
          <ChevronRight size={28} />
        </button>
      </div>
    </>
  )
}
