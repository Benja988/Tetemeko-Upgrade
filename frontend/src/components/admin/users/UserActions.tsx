'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Mail, Trash2, Download, MoreVertical } from 'lucide-react';
import { IUser } from '@/types/user';

// Button Component
function Button({
  children,
  onClick,
  className = '',
  variant = 'default',
  ariaLabel,
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive';
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) {
  const base = 'inline-flex items-center px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Define union type for user actions
type UserAction = 'view' | 'edit' | 'resetPassword' | 'promote' | 'toggleActive' | 'delete';

// Props interface
interface UserActionsProps {
  onAddUser?: () => void;
  onInviteUser?: () => void;
  onExport?: () => void;
  onDeleteSelected?: () => void;
  user?: IUser;
  onUserAction?: (action: UserAction, user: IUser) => void;
}

export default function UserActions({
  onAddUser,
  onInviteUser,
  onExport,
  onDeleteSelected,
  user,
  onUserAction,
}: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left?: number; right?: number }>({ top: 0 });

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  // Dynamic positioning for dropdown
  useEffect(() => {
    if (open && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // 48 * 4 (w-48 = 12rem = 192px)
      const spaceRight = window.innerWidth - buttonRect.left;
      const spaceLeft = buttonRect.right;

      if (spaceRight < dropdownWidth && spaceLeft >= dropdownWidth) {
        // Show to the left
        setDropdownStyle({
          top: buttonRect.bottom + window.scrollY + 4,
          right: window.innerWidth - buttonRect.right + window.scrollX,
        });
      } else {
        // Show to the right (default)
        setDropdownStyle({
          top: buttonRect.bottom + window.scrollY + 4,
          left: buttonRect.left + window.scrollX,
        });
      }
    }
  }, [open]);

  const renderAdminButtons = () => {
    const show = onAddUser || onInviteUser || onExport || onDeleteSelected;
    if (!show) return null;

    return (
      <div className="flex flex-wrap gap-3 items-center mb-6">
        {onAddUser && (
          <Button onClick={onAddUser} ariaLabel="Add new user">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
        {onInviteUser && (
          <Button onClick={onInviteUser} variant="outline" ariaLabel="Invite user by email">
            <Mail className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        )}
        {onExport && (
          <Button onClick={onExport} variant="outline" ariaLabel="Export user list">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        {onDeleteSelected && (
          <Button onClick={onDeleteSelected} variant="destructive" ariaLabel="Delete selected users">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>
    );
  };

  const renderUserDropdown = () => {
    if (!user) return null;

    const actions = [
      { label: 'View', action: 'view' as UserAction },
      { label: 'Edit', action: 'edit' as UserAction },
      { label: 'Reset Password', action: 'resetPassword' as UserAction },
      { label: 'Promote to Manager', action: 'promote' as UserAction },
      {
        label: user.isActive ? 'Deactivate' : 'Reactivate',
        action: 'toggleActive' as UserAction,
        destructive: user.isActive,
      },
      {
        label: 'Delete',
        action: 'delete' as UserAction,
        destructive: true,
      },
    ];

    return (
      <>
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-md focus:outline-none focus:ring"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="User actions dropdown"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {open &&
          createPortal(
            <ul
              ref={dropdownRef}
              role="menu"
              className="bg-white border shadow-lg rounded-md w-48 py-1 animate-fadeIn"
              style={{
                position: 'absolute',
                top: dropdownStyle.top,
                left: dropdownStyle.left,
                right: dropdownStyle.right,
                zIndex: 50,
              }}
            >
              {actions.map(({ label, action, destructive }, i) => (
                <li
                  key={i}
                  role="menuitem"
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    destructive ? 'text-red-600' : 'text-gray-800'
                  }`}
                  onClick={() => {
                    onUserAction?.(action, user);
                    setOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>,
            document.body,
          )}
      </>
    );
  };

  return (
    <>
      {renderAdminButtons()}
      {renderUserDropdown()}
    </>
  );
}
