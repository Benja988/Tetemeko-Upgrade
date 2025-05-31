import { useState, useEffect, ChangeEvent } from 'react';
import Modal from './Modal';
import { IUser, UserRole } from '@/types/user';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface EditUserModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: IUser) => void;
}

const roles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER, UserRole.WEB_USER];

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: UserRole.WEB_USER,
    isActive: true,
    isVerified: false,
    profilePictureUrl: '',
  });

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        profilePictureUrl: user.profilePictureUrl || '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file upload and convert to base64 for preview
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Option 1: Convert to base64 string for preview (simple, no upload)
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('profilePictureUrl', reader.result as string);
    };
    reader.readAsDataURL(file);

    // Option 2: Upload the file to your server/cloud here
    // After upload, set the returned URL to profilePictureUrl
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onSave({ ...user, ...formState });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Preview */}
        <div className="flex flex-col items-center space-y-2">
          {formState.profilePictureUrl ? (
            <img
              src={formState.profilePictureUrl}
              alt="Profile"
              onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.png'; }}
              className="w-24 h-24 rounded-full object-cover border shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border shadow-md flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
          {/* Upload button */}
          <label
            htmlFor="profilePictureFile"
            className="cursor-pointer px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Upload New Picture
          </label>
          <input
            id="profilePictureFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            value={formState.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formState.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Profile Picture URL (readonly) */}
        <div>
          <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700">
            Profile Picture URL
          </label>
          <input
            id="profilePictureUrl"
            type="url"
            value={formState.profilePictureUrl}
            readOnly
            className="mt-1 block w-full rounded border bg-gray-100 px-3 py-2 shadow-sm focus:outline-none"
            placeholder="Uploaded image URL will appear here"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={formState.role}
            onChange={(e) => handleChange('role', e.target.value as UserRole)}
            className="mt-1 block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* isActive & isVerified */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <Switch
              checked={formState.isActive}
              onChange={(val) => handleChange('isActive', val)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                formState.isActive ? 'bg-green-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  formState.isActive ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Verified</span>
            <Switch
              checked={formState.isVerified}
              onChange={(val) => handleChange('isVerified', val)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                formState.isVerified ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  formState.isVerified ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </Switch>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
