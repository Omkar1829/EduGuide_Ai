import { useState } from 'react';

const PRIORITIES = [
  { value: 1, label: 'High', color: 'badge-error' },
  { value: 2, label: 'Medium', color: 'badge-warning' },
  { value: 3, label: 'Low', color: 'badge-info' },
];

const CareerGoalsForm = ({ data, onChange }) => {
  const [goals, setGoals] = useState(
    data?.length ? data : [{ title: '', description: '', targetYear: '', priority: 1 }]
  );

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const updateGoal = (index, field, value) => {
    const updated = goals.map((g, i) => (i === index ? { ...g, [field]: value } : g));
    setGoals(updated);
    onChange(updated);
  };

  const addGoal = () => {
    const updated = [...goals, { title: '', description: '', targetYear: '', priority: 1 }];
    setGoals(updated);
    onChange(updated);
  };

  const removeGoal = (index) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated.length ? updated : [{ title: '', description: '', targetYear: '', priority: 1 }]);
    onChange(updated.length ? updated : [{ title: '', description: '', targetYear: '', priority: 1 }]);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Career Goals</h3>
        <p className="text-sm text-base-content/50">Define your career aspirations to guide your journey.</p>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div
            key={index}
            className="card bg-base-200/50 border border-base-300 p-5 space-y-4 animate-slide-up"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="font-medium text-base-content">Goal {index + 1}</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
                    </svg>
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-32">
                    {PRIORITIES.map((p) => (
                      <li key={p.value}>
                        <a onClick={() => updateGoal(index, 'priority', p.value)}>
                          {p.label} Priority
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-1">
              {PRIORITIES.map((p) => (
                <span
                  key={p.value}
                  className={`badge badge-sm cursor-pointer transition-all ${
                    goal.priority === p.value ? p.color : 'badge-outline opacity-50'
                  }`}
                  onClick={() => updateGoal(index, 'priority', p.value)}
                >
                  {p.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Goal Title</label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => updateGoal(index, 'title', e.target.value)}
                  placeholder="e.g. Become a Data Scientist"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Target Year</label>
                <select
                  value={goal.targetYear}
                  onChange={(e) => updateGoal(index, 'targetYear', e.target.value)}
                  className="select select-bordered w-full bg-white/5"
                >
                  <option value="">Select year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-base-content">Description</label>
              <textarea
                value={goal.description}
                onChange={(e) => updateGoal(index, 'description', e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Describe this goal and why it matters to you..."
                className="textarea textarea-bordered w-full bg-white/5 resize-none"
              />
              <p className="text-xs text-base-content/40 text-right">{goal.description.length}/300</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addGoal} className="btn btn-outline btn-sm w-full gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Another Goal
      </button>
    </div>
  );
};

export default CareerGoalsForm;
