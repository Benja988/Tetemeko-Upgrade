'use client';

interface Props {
  heading: string;
  onCreate: () => void;
  showForm: boolean;
}

export default function NewsHeader({ heading, onCreate, showForm }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-primary">{heading}</h1>
        <p className="text-gray-600">Manage all your news content</p>
      </div>
      <button
        onClick={onCreate}
        className="bg-primary hover:bg-primary-dark transition px-5 py-2 rounded-md text-white font-medium"
      >
        {showForm ? 'Cancel' : 'Create News'}
      </button>
    </div>
  );
}
