import { useState } from 'react';

const STRENGTH_CATEGORIES = [
  'Technical',
  'Communication',
  'Leadership',
  'Analytical',
  'Creative',
  'Interpersonal',
  'Organizational',
  'Problem Solving',
];

const StrengthsWeaknessesForm = ({ data, onChange }) => {
  const [strengths, setStrengths] = useState(
    data?.strengths?.length ? data.strengths : [{ name: '', category: '', evidence: '' }]
  );
  const [weaknesses, setWeaknesses] = useState(
    data?.weaknesses?.length ? data.weaknesses : [{ name: '', category: '', evidence: '' }]
  );

  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');

  const updateItem = (list, setList, index, field, value) => {
    const updated = list.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setList(updated);
    emitChange(updated, list === strengths ? 'strengths' : 'weaknesses');
  };

  const addItem = (list, setList, name = '') => {
    const trimmed = name || (list === strengths ? newStrength : newWeakness).trim();
    if (!trimmed) return;
    const updated = [...list, { name: trimmed, category: '', evidence: '' }];
    setList(updated);
    if (list === strengths) setNewStrength('');
    else setNewWeakness('');
    emitChange(updated, list === strengths ? 'strengths' : 'weaknesses');
  };

  const removeItem = (list, setList, index) => {
    const updated = list.filter((_, i) => i !== index);
    const final = updated.length ? updated : [{ name: '', category: '', evidence: '' }];
    setList(final);
    emitChange(final, list === strengths ? 'strengths' : 'weaknesses');
  };

  const emitChange = (data, type) => {
    if (type === 'strengths') {
      onChange({ strengths: data, weaknesses });
    } else {
      onChange({ strengths, weaknesses: data });
    }
  };

  const renderSection = (title, items, setItems, icon, color) => (
    <div className="space-y-3">
      <h4 className={`flex items-center gap-2 font-medium ${color}`}>
        {icon}
        {title}
      </h4>

      {items.map((item, index) => (
        <div key={index} className="card bg-base-200/50 border border-base-300 p-4 space-y-3 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(items, setItems, index, 'name', e.target.value)}
                  placeholder={title === 'Strengths' ? 'e.g. Python Programming' : 'e.g. Public Speaking'}
                  className="input input-bordered input-sm w-full bg-white/5"
                />
                <select
                  value={item.category}
                  onChange={(e) => updateItem(items, setItems, index, 'category', e.target.value)}
                  className="select select-bordered select-sm w-full bg-white/5"
                >
                  <option value="">Category</option>
                  {STRENGTH_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={item.evidence}
                onChange={(e) => updateItem(items, setItems, index, 'evidence', e.target.value)}
                rows={2}
                placeholder="Brief evidence or example..."
                className="textarea textarea-bordered textarea-sm w-full bg-white/5 resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(items, setItems, index)}
              className="btn btn-ghost btn-xs text-error mt-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          type="text"
          value={title === 'Strengths' ? newStrength : newWeakness}
          onChange={(e) =>
            title === 'Strengths' ? setNewStrength(e.target.value) : setNewWeakness(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem(items, setItems);
            }
          }}
          placeholder={`Add ${title.toLowerCase().slice(0, -1)}...`}
          className="input input-bordered input-sm flex-1 bg-white/5"
        />
        <button
          type="button"
          onClick={() => addItem(items, setItems)}
          disabled={title === 'Strengths' ? !newStrength.trim() : !newWeakness.trim()}
          className="btn btn-sm btn-secondary"
        >
          + Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Strengths & Weaknesses</h3>
        <p className="text-sm text-base-content/50">Identify your strengths and areas for improvement.</p>
      </div>

      {renderSection(
        'Strengths',
        strengths,
        setStrengths,
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>,
        'text-green-400'
      )}

      <div className="divider" />

      {renderSection(
        'Weaknesses',
        weaknesses,
        setWeaknesses,
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>,
        'text-amber-400'
      )}
    </div>
  );
};

export default StrengthsWeaknessesForm;
