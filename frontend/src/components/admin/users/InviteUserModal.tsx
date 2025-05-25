import React, { useState } from "react";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [emails, setEmails] = useState("");

  const handleSubmit = () => {
    const emailList = emails.split(",").map(email => email.trim()).filter(Boolean);
    onInvite(emailList);
    setEmails("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="px-4 py-3 border-b font-semibold text-lg">Invite Users</div>
        <div className="p-4">
          <label className="block text-sm font-medium mb-2">Email addresses (comma separated)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </div>
        <div className="flex justify-end p-4 border-t gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:underline">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
        </div>
      </div>
    </div>
  );
};
