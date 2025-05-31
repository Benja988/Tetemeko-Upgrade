import React from "react";
import { IUser } from "@/types/user";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2
            id="user-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            User Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close user details modal"
            className="text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 space-y-6">
          {/* User Avatar or Placeholder */}
          <div className="flex justify-center">
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={`${user.name} avatar`}
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-semibold text-blue-600 select-none border border-blue-300 shadow-md">
                {user.name?.[0].toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="font-semibold text-gray-900">Name:</span> {user.name}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Verified:</span> {user.isVerified ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Role:</span> {user.role.replace("_", " ")}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Status:</span>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive ? "Active" : "Deactivated"}
              </span>
            </div>
            {user.createdAt && (
              <div>
                <span className="font-semibold text-gray-900">Created At:</span>{" "}
                {new Date(user.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
            {user.updatedAt && (
              <div>
                <span className="font-semibold text-gray-900">Last Updated:</span>{" "}
                {new Date(user.updatedAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="inline-flex justify-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};
