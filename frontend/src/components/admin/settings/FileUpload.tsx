'use client';

interface FileUploadProps {
  label: string;
  value?: string;
  onChange: (file: File | null) => void;
}

export default function FileUpload({ label, value, onChange }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full max-w-xs text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white rounded-md file:cursor-pointer"
        />
        {value && (
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 rounded-full border border-gray-300 object-cover"
          />
        )}
      </div>
    </div>
  );
}
