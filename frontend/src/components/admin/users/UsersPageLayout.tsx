'use client';

import { useState } from "react";
import UserFilterBar from "@/components/admin/users/UserFilterBar";
import UserSearchBar from "@/components/admin/users/UserSearchBar";
import UsersTabs from "@/components/admin/users/UsersTabs";
import UserTable from "@/components/admin/users/UserTable";
import { mockUsers } from "@/data/users";
import UserActions from "@/components/admin/users/UserActions";
import { IUser } from "@/types/user";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { EditUserModal } from "./EditUserModal";
import { InviteUserModal } from "./InviteUserModal";
import { ExportUsersModal } from "./ExportUsersModal";
import AddUserModal from "./AddUserModal";

interface UsersPageLayoutProps {
    heading: string;
    defaultFilter?: string;
}

export default function UsersPageLayout({
    heading,
    defaultFilter = "",
}: UsersPageLayoutProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOption, setFilterOption] = useState("");
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

    const handleSearch = (query: string) => setSearchQuery(query);
    const handleFilter = (filter: string) => setFilterOption(filter);
    const combinedFilter = filterOption || defaultFilter;

    return (
        <section className="min-h-screen bg-[var(--color-light)] p-6">
            <header className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">{heading}</h1>
                </div>

                <div className="mt-4">
                    <UsersTabs />
                </div>
            </header>

            <div className="flex flex-wrap gap-2 mb-4">
                <UserSearchBar onSearch={handleSearch} />
                <UserFilterBar onFilter={handleFilter} />
            </div>

            <main>
                <UserActions
                    onAddUser={() => setAddUserModalOpen(true)}
                    onInviteUser={() => setInviteModalOpen(true)}
                    onExport={() => setExportModalOpen(true)}
                    onDeleteSelected={() => setDeleteModalOpen(true)}
                />

                <UserTable users={mockUsers} search={searchQuery} filter={combinedFilter} />
            </main>

            {/* Modals */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    console.log("Confirmed delete selected users");
                }}
                message="Are you sure you want to delete selected users?"
            />

            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                onInvite={(emails: string[]) => {
                    console.log("Invited users:", emails);
                }}
            />

            <ExportUsersModal
                isOpen={isExportModalOpen}
                onClose={() => setExportModalOpen(false)}
                onExport={() => {
                    console.log("Exported user list");
                }}
            />


            {/* Optional: Add User Modal - could be a custom modal like EditUserModal */}
            <AddUserModal
  isOpen={isAddUserModalOpen}
  onClose={() => setAddUserModalOpen(false)}
  onAdd={(newUser: IUser) => {
    console.log("Added new user", newUser);
  }}
/>

        </section>
    );
}
