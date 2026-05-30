import { useState } from 'react';

const ACADEMIC_YEARS = [
  { value: 'FRESHMAN', label: 'Freshman' },
  { value: 'SOPHOMORE', label: 'Sophomore' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'GRADUATE', label: 'Graduate' },
  { value: 'POST_GRADUATE', label: 'Post Graduate' },
];

const emptyRecord = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  year: '',
  startYear: '',
  endYear: '',
  gpa: '',
  isCurrent: false,
  subjects: [],
};

const AcademicRecordsForm = ({ data, onChange }) => {
  const [records, setRecords] = useState(data?.length ? data : [{ ...emptyRecord }]);
  const [newSubject, setNewSubject] = useState('');
  const [activeRecord, setActiveRecord] = useState(0);

  const updateRecord = (index, field, value) => {
    const updated = records.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    setRecords(updated);
    onChange(updated);
  };

  const addRecord = () => {
    const updated = [...records, { ...emptyRecord }];
    setRecords(updated);
    setActiveRecord(updated.length - 1);
    onChange(updated);
  };

  const removeRecord = (index) => {
    if (records.length === 1) return;
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    setActiveRecord(Math.min(activeRecord, updated.length - 1));
    onChange(updated);
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;
    const updated = records.map((r, i) =>
      i === activeRecord ? { ...r, subjects: [...r.subjects, { name: newSubject.trim(), marks: '', grade: '' }] } : r
    );
    setRecords(updated);
    setNewSubject('');
    onChange(updated);
  };

  const removeSubject = (subjectIndex) => {
    const updated = records.map((r, i) =>
      i === activeRecord ? { ...r, subjects: r.subjects.filter((_, si) => si !== subjectIndex) } : r
    );
    setRecords(updated);
    onChange(updated);
  };

  const updateSubject = (subjectIndex, field, value) => {
    const updated = records.map((r, i) =>
      i === activeRecord
        ? {
            ...r,
            subjects: r.subjects.map((s, si) => (si === subjectIndex ? { ...s, [field]: value } : s)),
          }
        : r
    );
    setRecords(updated);
    onChange(updated);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Academic Records</h3>
        <p className="text-sm text-base-content/50">Add your educational background.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {records.map((record, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveRecord(index)}
            className={`badge badge-lg cursor-pointer transition-all ${
              index === activeRecord ? 'badge-primary' : 'badge-outline hover:badge-primary/30'
            }`}
          >
            {record.institution || `Institution ${index + 1}`}
          </button>
        ))}
        <button
          type="button"
          onClick={addRecord}
          className="badge badge-lg badge-dash cursor-pointer hover:badge-primary"
        >
          + Add
        </button>
      </div>

      {records.map((record, index) =>
        index === activeRecord ? (
          <div key={index} className="card bg-base-200/50 border border-base-300 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-base-content">Institution {index + 1}</h4>
              {records.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRecord(index)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Institution Name</label>
                <input
                  type="text"
                  value={record.institution}
                  onChange={(e) => updateRecord(index, 'institution', e.target.value)}
                  placeholder="University of Mumbai"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Degree</label>
                <input
                  type="text"
                  value={record.degree}
                  onChange={(e) => updateRecord(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Technology"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Field of Study</label>
                <input
                  type="text"
                  value={record.fieldOfStudy}
                  onChange={(e) => updateRecord(index, 'fieldOfStudy', e.target.value)}
                  placeholder="Computer Science"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Academic Year</label>
                <select
                  value={record.year}
                  onChange={(e) => updateRecord(index, 'year', e.target.value)}
                  className="select select-bordered w-full bg-white/5"
                >
                  <option value="">Select year</option>
                  {ACADEMIC_YEARS.map((y) => (
                    <option key={y.value} value={y.value}>
                      {y.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Start Year</label>
                <select
                  value={record.startYear}
                  onChange={(e) => updateRecord(index, 'startYear', e.target.value)}
                  className="select select-bordered w-full bg-white/5"
                >
                  <option value="">Select</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">End Year</label>
                <select
                  value={record.endYear}
                  onChange={(e) => updateRecord(index, 'endYear', e.target.value)}
                  disabled={record.isCurrent}
                  className="select select-bordered w-full bg-white/5 disabled:opacity-50"
                >
                  <option value="">Select</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">GPA / Percentage</label>
                <input
                  type="number"
                  value={record.gpa}
                  onChange={(e) => updateRecord(index, 'gpa', e.target.value)}
                  placeholder="8.5"
                  min="0"
                  max="10"
                  step="0.1"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={record.isCurrent}
                    onChange={(e) => {
                      updateRecord(index, 'isCurrent', e.target.checked);
                      if (e.target.checked) updateRecord(index, 'endYear', '');
                    }}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="text-sm text-base-content/70">Currently studying here</span>
                </label>
              </div>
            </div>

            <div className="divider text-sm text-base-content/40">Subjects</div>

            <div className="space-y-3">
              {record.subjects.map((subject, si) => (
                <div key={si} className="flex items-center gap-2 animate-slide-up">
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(si, 'name', e.target.value)}
                    placeholder="Subject name"
                    className="input input-bordered input-sm flex-1 bg-white/5"
                  />
                  <input
                    type="number"
                    value={subject.marks}
                    onChange={(e) => updateSubject(si, 'marks', e.target.value)}
                    placeholder="Marks"
                    min="0"
                    className="input input-bordered input-sm w-24 bg-white/5"
                  />
                  <input
                    type="text"
                    value={subject.grade}
                    onChange={(e) => updateSubject(si, 'grade', e.target.value)}
                    placeholder="Grade"
                    className="input input-bordered input-sm w-20 bg-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubject(si)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  placeholder="Add subject..."
                  className="input input-bordered input-sm flex-1 bg-white/5"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  disabled={!newSubject.trim()}
                  className="btn btn-sm btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default AcademicRecordsForm;
