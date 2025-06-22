
  // heroMedia.ts
export const HERO_MEDIA = [
  // { type: 'video', src: '/hero-images/connect.mov' },
  { type: 'video', src: '/hero-images/globe.mp4' },
  { type: 'image', src: '/hero-images/antenna.jpg' },
  { type: 'video', src: '/hero-images/GlobeEarth.mp4' },
  { type: 'image', src: '/hero-images/antenna1.jpg' },
  { type: 'video', src: '/hero-images/mars.mp4' },
  { type: 'image', src: '/hero-images/mic.jpg' },
  { type: 'image', src: '/hero-images/musical.jpg' },
  // { type: 'video', src: '/hero-images/waveglobe.mov' },
] as const

// gridHelpers.ts
export const GRID_SIZE = 5
export const DIRECTIONS = ['top', 'bottom', 'left', 'right'] as const
export const FROM_DIR: Record<typeof DIRECTIONS[number], { x?: number; y?: number }> = {
  top: { y: -50 },
  bottom: { y: 50 },
  left: { x: -50 },
  right: { x: 50 },
}
