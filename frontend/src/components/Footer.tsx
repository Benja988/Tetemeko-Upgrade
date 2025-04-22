// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-dark text-light section-padding mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Tetemeko Media Group</h2>
            <p className="text-sm text-gray-300">Streaming | News | Podcasts | Marketplace</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/stations" className="hover:underline">Stations</a></li>
              <li><a href="/news" className="hover:underline">News</a></li>
              <li><a href="/podcasts" className="hover:underline">Podcasts</a></li>
              <li><a href="/marketplace" className="hover:underline">Marketplace</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Contact Us</h3>
            <p className="text-sm">info@tetemeko.com</p>
            <p className="text-sm">+255-XXX-XXXXXX</p>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
        </div>
      </footer>
    )
  }
  