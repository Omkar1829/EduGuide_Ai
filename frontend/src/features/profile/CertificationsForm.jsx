import { useState } from 'react';

const CertificationsForm = ({ data, onChange }) => {
  const [certs, setCerts] = useState(
    data?.length
      ? data
      : [{ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' }]
  );

  const updateCert = (index, field, value) => {
    const updated = certs.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    setCerts(updated);
    onChange(updated);
  };

  const addCert = () => {
    const updated = [...certs, { name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' }];
    setCerts(updated);
    onChange(updated);
  };

  const removeCert = (index) => {
    const updated = certs.filter((_, i) => i !== index);
    setCerts(
      updated.length
        ? updated
        : [{ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' }]
    );
    onChange(
      updated.length
        ? updated
        : [{ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' }]
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-1">Certifications</h3>
        <p className="text-sm text-base-content/50">Add your professional certifications and credentials.</p>
      </div>

      <div className="space-y-4">
        {certs.map((cert, index) => (
          <div
            key={index}
            className="card bg-base-200/50 border border-base-300 p-5 space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="font-medium text-base-content">Certification {index + 1}</h4>
              </div>
              {certs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCert(index)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCert(index, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCert(index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Issue Date</label>
                <input
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) => updateCert(index, 'issueDate', e.target.value)}
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={cert.expiryDate}
                  onChange={(e) => updateCert(index, 'expiryDate', e.target.value)}
                  min={cert.issueDate || ''}
                  className="input input-bordered w-full bg-white/5"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-base-content">Credential URL (optional)</label>
                <input
                  type="url"
                  value={cert.credentialUrl}
                  onChange={(e) => updateCert(index, 'credentialUrl', e.target.value)}
                  placeholder="https://www.credential-url.com/verify/..."
                  className="input input-bordered w-full bg-white/5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addCert} className="btn btn-outline btn-sm w-full gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Another Certification
      </button>
    </div>
  );
};

export default CertificationsForm;
