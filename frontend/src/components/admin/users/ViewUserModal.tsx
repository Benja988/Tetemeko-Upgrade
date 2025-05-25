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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user.role.replace("_", " ")}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span className={user.isActive ? "text-green-600" : "text-red-600"}>
              {user.isActive ? "Active" : "Deactivated"}
            </span>
          </div>
          {user.createdAt && (
            <div>
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </div>
          )}
          {user.updatedAt && (
            <div>
              <span className="font-semibold">Last Updated:</span>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
