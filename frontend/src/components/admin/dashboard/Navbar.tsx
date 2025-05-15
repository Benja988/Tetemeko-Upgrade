export default function Navbar() {
    return (
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold">Admin Dashboard</div>
          <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium">
            Logout
          </button>
        </div>
      </nav>
    );
  }
  