const CourseFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  const defaultCategories = [
    { id: 'all', label: 'All Courses' },
    { id: 'programming', label: 'Programming' },
    { id: 'data-science', label: 'Data Science' },
    { id: 'web-development', label: 'Web Development' },
    { id: 'mobile-development', label: 'Mobile Development' },
    { id: 'cloud-computing', label: 'Cloud Computing' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
  ];

  const allCategories = categories || defaultCategories;

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-input w-full pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseFilters;
