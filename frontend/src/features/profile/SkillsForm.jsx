import { useState, useMemo } from 'react';

const PROFICIENCY_LEVELS = [
  { value: 1, label: 'Beginner', color: 'text-red-400' },
  { value: 2, label: 'Elementary', color: 'text-orange-400' },
  { value: 3, label: 'Intermediate', color: 'text-yellow-400' },
  { value: 4, label: 'Advanced', color: 'text-green-400' },
  { value: 5, label: 'Expert', color: 'text-emerald-400' },
];

const COMMON_SKILLS = [
  { name: 'JavaScript', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'SQL', category: 'Database' },
  { name: 'Git', category: 'Tools' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Machine Learning', category: 'AI/ML' },
  { name: 'Data Analysis', category: 'Data' },
  { name: 'Communication', category: 'Soft Skills' },
  { name: 'Leadership', category: 'Soft Skills' },
  { name: 'Problem Solving', category: 'Soft Skills' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'HTML/CSS', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'TensorFlow', category: 'AI/ML' },
  { name: 'Project Management', category: 'Soft Skills' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Figma', category: 'Design' },
];

const SkillsForm = ({ data, onChange }) => {
  const [skills, setSkills] = useState(
    data?.length
      ? data
      : [{ name: '', category: '', level: 1, yearsExp: '' }]
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return COMMON_SKILLS.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !skills.some((sk) => sk.name === s.name)
    ).slice(0, 8);
  }, [searchQuery, skills]);

  const addSkill = (name = '', category = '', level = 1) => {
    if (!name && !searchQuery.trim()) return;
    const skillName = name || searchQuery.trim();
    if (skills.some((s) => s.name === skillName)) return;
    const updated = [...skills, { name: skillName, category, level, yearsExp: '' }];
    setSkills(updated);
    setSearchQuery('');
    onChange(updated);
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated.length ? updated : [{ name: '', category: '', level: 1, yearsExp: '' }]);
    onChange(updated.length ? updated : [{ name: '', category: '', level: 1, yearsExp: '' }]);
  };

  const updateSkill = (index, field, value) => {
    const updated = skills.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    setSkills(updated);
    onChange(updated);
  };

  const popularSkills = COMMON_SKILLS.filter((s) => !skills.some((sk) => sk.name === s.name)).slice(0, 6);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Skills</h3>
        <p className="text-sm text-base-content/50">Add your technical and soft skills.</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="Search and add skills..."
          className="input input-bordered w-full pl-10 bg-white/5"
        />

        {filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-base-200 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((skill) => (
              <button
                key={skill.name}
                type="button"
                onClick={() => addSkill(skill.name, skill.category)}
                className="w-full px-4 py-2.5 text-left hover:bg-base-300 flex items-center justify-between transition-colors"
              >
                <span className="text-sm text-base-content">{skill.name}</span>
                <span className="badge badge-sm badge-outline">{skill.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-base-content/50 mb-2">Popular skills:</p>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => (
            <button
              key={skill.name}
              type="button"
              onClick={() => addSkill(skill.name, skill.category)}
              className="badge badge-outline cursor-pointer hover:badge-primary/30 transition-all text-xs"
            >
              + {skill.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="card bg-base-200/50 border border-base-300 p-4 animate-slide-up"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div>
                  <span className="font-medium text-sm text-base-content">{skill.name || 'Unnamed Skill'}</span>
                  {skill.category && (
                    <span className="badge badge-xs badge-primary ml-2">{skill.category}</span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/50 w-16">Level:</span>
                    <div className="flex gap-1 flex-1">
                      {PROFICIENCY_LEVELS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => updateSkill(index, 'level', p.value)}
                          className={`flex-1 h-6 rounded text-xs font-medium transition-all ${
                            p.value <= skill.level
                              ? 'bg-primary-500 text-white'
                              : 'bg-base-300 text-base-content/50 hover:bg-base-300/80'
                          }`}
                        >
                          {p.value}
                        </button>
                      ))}
                    </div>
                    <span className={`text-xs font-medium w-20 text-right ${PROFICIENCY_LEVELS[skill.level - 1]?.color || ''}`}>
                      {PROFICIENCY_LEVELS[skill.level - 1]?.label || ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={skill.yearsExp}
                    onChange={(e) => updateSkill(index, 'yearsExp', e.target.value)}
                    placeholder="Yrs"
                    min="0"
                    max="50"
                    className="input input-bordered input-sm w-20 bg-white/5"
                  />
                  <span className="text-xs text-base-content/50">yrs</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="btn btn-ghost btn-xs text-error"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
