'use client';

import { Station } from "@/interfaces/Station";

interface StationsTableProps {
  stations: Station[];
}

export default function StationsTable({ stations }: StationsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left text-sm font-semibold">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Genre</th>
            <th className="p-3">Location</th>
            <th className="p-3">Listeners</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id} className="border-t text-sm hover:bg-gray-50">
              <td className="p-3">
                <img src={station.imageUrl} alt={station.name} className="h-10 w-10 rounded object-cover" />
              </td>
              <td className="p-3 font-medium">{station.name}</td>
              <td className="p-3">{station.genre}</td>
              <td className="p-3">{station.location}</td>
              <td className="p-3">{station.listeners}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    station.status === "Live" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {station.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
