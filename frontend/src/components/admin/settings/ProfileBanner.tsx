'use client';

interface ProfileBannerProps {
  imageUrl?: string;
  title: string;
  subtitle?: string;
}

export default function ProfileBanner({ imageUrl, title, subtitle }: ProfileBannerProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-16 h-16 rounded-full border border-gray-300 object-cover"
        />
      )}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
