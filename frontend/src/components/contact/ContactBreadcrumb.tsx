import Link from "next/link";

export default function ContactBreadcrumb() {
  return (
    <section className="bg-gray-100 py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <nav className="text-sm text-blue-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[#3d62c1] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="text-[#07131F] font-medium">Contact Us</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
