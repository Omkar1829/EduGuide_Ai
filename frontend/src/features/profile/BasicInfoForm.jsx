import { useState } from 'react';

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const BasicInfoForm = ({ data, onChange, errors = {} }) => {
  const [formData, setFormData] = useState({
    dateOfBirth: data?.dateOfBirth || '',
    gender: data?.gender || '',
    phoneNumber: data?.phoneNumber || '',
    bio: data?.bio || '',
    city: data?.city || '',
    state: data?.state || '',
    country: data?.country || 'India',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Basic Information</h3>
        <p className="text-sm text-base-content/50">Tell us about yourself to personalize your experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-base-content">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="input input-bordered w-full bg-white/5"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-base-content">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="select select-bordered w-full bg-white/5"
          >
            <option value="">Select gender</option>
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-base-content">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={`input input-bordered w-full bg-white/5 ${errors.phoneNumber ? 'input-error' : ''}`}
          />
          {errors.phoneNumber && <p className="text-xs text-error">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-base-content">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Mumbai"
            className="input input-bordered w-full bg-white/5"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-base-content">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            className="input input-bordered w-full bg-white/5"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-base-content">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="India"
            className="input input-bordered w-full bg-white/5"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-base-content">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          placeholder="Tell us about yourself, your goals, and what drives you..."
          className="textarea textarea-bordered w-full bg-white/5 resize-none"
        />
        <p className="text-xs text-base-content/40 text-right">{formData.bio.length}/500</p>
      </div>
    </div>
  );
};

export default BasicInfoForm;
