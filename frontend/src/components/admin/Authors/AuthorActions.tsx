'use client';

interface AuthorActionsProps {
  onCreate: () => void;
  onExport: () => void;
  onUpdateSelected: () => void;
  onVerifySelected: () => void;
  onDeleteSelected: () => void;
  disableUpdate?: boolean;
  disableVerify?: boolean;
  disableDelete?: boolean;
}

const buttonBaseClasses = `flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition 
  focus:outline-none focus:ring-2 focus:ring-offset-1`;

export default function AuthorActions({
  onCreate,
  onExport,
  onUpdateSelected,
  onVerifySelected,
  onDeleteSelected,
  disableUpdate = false,
  disableVerify = false,
  disableDelete = false,
}: AuthorActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-3 mb-6">
      
      <button
        onClick={onCreate}
        title="Create a new author"
        className={`${buttonBaseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`}
        type="button"
      >
        {/* Plus icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Create
      </button>

      <button
        onClick={onUpdateSelected}
        disabled={disableUpdate}
        title={disableUpdate ? "No authors selected" : "Update selected authors"}
        className={`${buttonBaseClasses} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        type="button"
      >
        {/* Pencil/edit icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-7-7l7 7" />
        </svg>
        Update Selected
      </button>

      <button
        onClick={onVerifySelected}
        disabled={disableVerify}
        title={disableVerify ? "No authors selected" : "Verify selected authors"}
        className={`${buttonBaseClasses} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        type="button"
      >
        {/* Check icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Verify Selected
      </button>

      <button
        onClick={onExport}
        title="Export authors data"
        className={`${buttonBaseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`}
        type="button"
      >
        {/* Download icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-6-4v6m0 0l-3-3m3 3l3-3M12 12V4" />
        </svg>
        Export
      </button>

      <button
        onClick={onDeleteSelected}
        disabled={disableDelete}
        title={disableDelete ? "No authors selected" : "Delete selected authors"}
        className={`${buttonBaseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        type="button"
      >
        {/* Trash icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
        </svg>
        Delete Selected
      </button>
    </div>
  );
}
