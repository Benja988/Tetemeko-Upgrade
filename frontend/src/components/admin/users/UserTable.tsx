'use client';

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import UserRow from "./UserRow";
import UserDetailBox from "./UserDetailBox";
import { UserTableProps, IUser as User } from "@/types/user";

export default function UserTable({ users, search, filter }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
      );
    }

    if (filter && filter !== "all") {
      switch (filter) {
        case "admin":
        case "manager":
        case "web_user":
          result = result.filter((user) => user.role === filter);
          break;
        case "active":
          result = result.filter((user) => user.isActive);
          break;
        case "inactive":
          result = result.filter((user) => !user.isActive);
          break;
        case "verified":
          result = result.filter((user) => user.isVerified);
          break;
        case "unverified":
          result = result.filter((user) => !user.isVerified);
          break;
        default:
          break;
      }
    }

    return result;
  }, [users, search, filter]);

  return (
    <div className="flex gap-6">
      {/* Table container */}
      <div
        className={`custom-scrollbar
          overflow-x-auto bg-white rounded-lg shadow
          flex-1
          max-w-full
        `}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="p-3 text-left whitespace-nowrap">Name</th>
              <th className="p-3 text-left whitespace-nowrap">Email</th>
              <th className="p-3 text-left whitespace-nowrap">Role</th>
              <th className="p-3 text-left whitespace-nowrap">Account Status</th>
              <th className="p-3 text-left whitespace-nowrap">Verified</th>
              <th className="p-3 text-center whitespace-nowrap">Login Attempts</th>
              <th className="p-3 text-center whitespace-nowrap">Locked?</th>
              <th className="p-3 text-left whitespace-nowrap">Created</th>
              <th className="p-3 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isLocked =
                  user.lockUntil && new Date(user.lockUntil) > new Date();

                return (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition cursor-default"
                  >
                    {/* Only name cell is clickable to open detail box */}
                    <td
                      className="p-3 text-left whitespace-nowrap cursor-pointer text-blue-600 hover:underline"
                      onClick={() => setSelectedUser(user)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedUser(user);
                        }
                      }}
                      aria-label={`View details for ${user.name}`}
                    >
                      {user.name}
                    </td>

                    <td className="p-3 text-left whitespace-nowrap">{user.email}</td>
                    <td className="p-3 text-left capitalize whitespace-nowrap">{user.role}</td>
                    <td className="p-3 text-left whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-left whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {user.failedLoginAttempts ?? 0}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {isLocked ? (
                        <span className="text-red-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-green-600">No</span>
                      )}
                    </td>
                    <td className="p-3 text-left whitespace-nowrap">
                      {user.createdAt
                        ? dayjs(user.createdAt).format("MMM D, YYYY")
                        : "-"}
                    </td>
                    <td className="p-3 text-left whitespace-nowrap">
                      <UserRow user={user} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-6">
                  No users match the current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User detail box only shows when user selected */}
      {selectedUser && (
        <UserDetailBox user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
