interface SearchBarProps {
  placeholder?: string;
  buttonText?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Pesquisar no repositório SoilData...',
  buttonText = 'Buscar',
  onSearch,
  className = '',
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 w-full max-w-[614px] lg:max-w-[784px] ${className}`}>
      <div className="flex-1 relative">
        <input
          type="text"
          name="search"
          placeholder={placeholder}
          className="input input-bordered w-full bg-white border-orange-300 text-gray-700 placeholder:text-gray-400 pl-10 text-left focus:outline-none focus:ring-0 focus:border-[#EA580C] focus:bg-white"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button type="submit" className="btn bg-orange-700 hover:bg-orange-800 text-white border-none">
        {buttonText}
      </button>
    </form>
  );
}
