'use client';

import { useState } from 'react';
import { IUser } from "@/types/user";
import UserActions from "@/components/admin/users/UserActions";
import { EditUserModal } from './EditUserModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { PromoteUserModal } from './PromoteUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { ToggleActiveStatusModal } from './ToggleActiveStatusModal';
import { ViewUserModal } from './ViewUserModal';

export default function UserRow({ user }: { user: IUser }) {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isPromoteModalOpen, setPromoteModalOpen] = useState(false);
    const [isResetModalOpen, setResetModalOpen] = useState(false);
    const [isToggleModalOpen, setToggleModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);


    const handleUserAction = (action: string, u: IUser) => {
        setSelectedUser(u);
        switch (action) {
            case "edit":
                setEditModalOpen(true);
                break;
            case "delete":
                setDeleteModalOpen(true);
                break;
            case "promote":
                setPromoteModalOpen(true);
                break;
            case "resetPassword":
                setResetModalOpen(true);
                break;
            case "toggleActive":
                setToggleModalOpen(true);
                break;
            case "view":
                // console.log("View user", u);
                setViewModalOpen(true);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role.replace("_", " ")}</td>
                <td className="p-3">
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                    >
                        {user.isActive ? "Active" : "Deactivated"}
                    </span>
                </td>
                <td className="p-3 text-right">
                    <UserActions user={user} onUserAction={handleUserAction} />
                </td>
            </tr>

            {/* Modals */}
            <EditUserModal
                user={selectedUser}
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={(updatedUser) => {
                    console.log("Updated user", updatedUser);
                }}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    console.log("Deleted user", selectedUser);
                }}
                message={`Are you sure you want to delete ${selectedUser?.name}?`}
            />

            <PromoteUserModal
                isOpen={isPromoteModalOpen}
                onClose={() => setPromoteModalOpen(false)}
                user={selectedUser}
                onPromote={() => {
                    console.log("Promoted user", selectedUser);
                }}
            />

            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setResetModalOpen(false)}
                user={selectedUser}
                onReset={() => {
                    console.log("Password reset triggered for", selectedUser);
                }}
            />

            <ToggleActiveStatusModal
                isOpen={isToggleModalOpen}
                onClose={() => setToggleModalOpen(false)}
                user={selectedUser}
                onToggle={() => {
                    console.log("Toggled active status for", selectedUser);
                }}
            />

            <ViewUserModal
                isOpen={isViewModalOpen}
                onClose={() => setViewModalOpen(false)}
                user={selectedUser}
            />

        </>
    );
}
