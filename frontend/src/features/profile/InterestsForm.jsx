import { useState } from 'react';

const INTEREST_CATEGORIES = [
  'Technology',
  'Science',
  'Arts',
  'Business',
  'Healthcare',
  'Engineering',
  'Education',
  'Finance',
  'Marketing',
  'Design',
  'Sports',
  'Other',
];

const InterestsForm = ({ data, onChange }) => {
  const [interests, setInterests] = useState(
    data?.length
      ? data
      : [{ name: '', category: '', level: 1 }]
  );
  const [newInterest, setNewInterest] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const updateInterest = (index, field, value) => {
    const updated = interests.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setInterests(updated);
    onChange(updated);
  };

  const addInterest = (name = '', category = '') => {
    if (!name && !newInterest.trim()) return;
    const updated = [
      ...interests,
      { name: name || newInterest.trim(), category: category || newCategory, level: 1 },
    ];
    setInterests(updated);
    setNewInterest('');
    setNewCategory('');
    onChange(updated);
  };

  const removeInterest = (index) => {
    const updated = interests.filter((_, i) => i !== index);
    setInterests(updated.length ? updated : [{ name: '', category: '', level: 1 }]);
    onChange(updated.length ? updated : [{ name: '', category: '', level: 1 }]);
  };

  const handleQuickAdd = (interestName) => {
    if (interests.some((i) => i.name === interestName)) return;
    addInterest(interestName, 'Technology');
  };

  const SUGGESTED_INTERESTS = [
    'Machine Learning',
    'Web Development',
    'Data Science',
    'Mobile Apps',
    'Cloud Computing',
    'Cybersecurity',
    'AI Research',
    'Blockchain',
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Interests</h3>
        <p className="text-sm text-base-content/50">Add your interests to get personalized recommendations.</p>
      </div>

      <div>
        <p className="text-xs text-base-content/50 mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleQuickAdd(interest)}
              disabled={interests.some((i) => i.name === interest)}
              className={`badge badge-outline cursor-pointer transition-all text-xs ${
                interests.some((i) => i.name === interest)
                  ? 'badge-primary opacity-50 cursor-not-allowed'
                  : 'hover:badge-primary/30'
              }`}
            >
              + {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {interests.map((interest, index) => (
          <div
            key={index}
            className="card bg-base-200/50 border border-base-300 p-4 animate-slide-up"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-base-content/70">Interest</label>
                  <input
                    type="text"
                    value={interest.name}
                    onChange={(e) => updateInterest(index, 'name', e.target.value)}
                    placeholder="e.g. Machine Learning"
                    className="input input-bordered input-sm w-full bg-white/5"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-base-content/70">Category</label>
                  <select
                    value={interest.category}
                    onChange={(e) => updateInterest(index, 'category', e.target.value)}
                    className="select select-bordered select-sm w-full bg-white/5"
                  >
                    <option value="">Select</option>
                    {INTEREST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-base-content/70">
                    Level: {interest.level}/5
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={interest.level}
                      onChange={(e) => updateInterest(index, 'level', parseInt(e.target.value))}
                      className="range range-sm range-primary flex-1"
                    />
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((l) => (
                        <div
                          key={l}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            l <= interest.level ? 'bg-primary-500' : 'bg-base-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeInterest(index)}
                className="btn btn-ghost btn-xs text-error mt-4"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-200/30 border border-dashed border-base-300 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            placeholder="Type an interest..."
            className="input input-bordered input-sm flex-1 bg-white/5"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="select select-bordered select-sm bg-white/5"
          >
            <option value="">Category</option>
            {INTEREST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => addInterest()}
            disabled={!newInterest.trim()}
            className="btn btn-sm btn-primary"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestsForm;
