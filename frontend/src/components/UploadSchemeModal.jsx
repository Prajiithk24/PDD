import { useState } from 'react';
import { Award, X, PlusCircle } from 'lucide-react';

export default function UploadSchemeModal({ isOpen, onClose, onSave, defaultDepartment = '' }) {
  const [formData, setFormData] = useState({
    schemeNameTa: '',
    schemeNameEn: '',
    departmentNameTa: defaultDepartment || 'குடிநீர் துறை',
    targetAudienceTa: 'பொதுமக்கள்',
    descriptionTa: '',
    benefitsTa: '',
    minAge: 18,
    maxAge: 70,
    maxAnnualIncome: 250000,
    eligibleGender: 'ALL',
    eligibleOccupation: 'ALL',
    requiredDocumentsTa: 'ஆதார் அட்டை, ரேஷன் அட்டை, வருமான சான்றிதழ்',
    officialUrl: 'https://tnesevai.tn.gov.in',
  });

  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({
        ...formData,
        minAge: Number(formData.minAge),
        maxAge: Number(formData.maxAge),
        maxAnnualIncome: Number(formData.maxAnnualIncome),
      });
      onClose();
    } catch (err) {
      console.error('Failed to upload scheme', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '680px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color, #e2e8f0)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)',
          color: '#ffffff', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} style={{ color: '#6ee7b7' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>புதிய அரசு / NGO நலத்திட்டம் சேர்</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>திட்டம் பெயர் (தமிழில்) *</span>
              <input
                required
                className="உரைப்பெட்டி"
                style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={formData.schemeNameTa}
                onChange={e => setFormData({ ...formData, schemeNameTa: e.target.value })}
                placeholder="எ.கா: மகளிர் சுயஉதவிக் குழு மானியம்"
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>திட்டம் பெயர் (ஆங்கிலத்தில்)</span>
              <input
                className="உரைப்பெட்டி"
                style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={formData.schemeNameEn}
                onChange={e => setFormData({ ...formData, schemeNameEn: e.target.value })}
                placeholder="e.g. Women SHG Subsidy Scheme"
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>துறை பெயர் *</span>
              <input
                required
                className="உரைப்பெட்டி"
                style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={formData.departmentNameTa}
                onChange={e => setFormData({ ...formData, departmentNameTa: e.target.value })}
                placeholder="எ.கா: குடிநீர் துறை / சமூக நலத்துறை"
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>பயனாளிகள் பிரிவு</span>
              <input
                className="உரைப்பெட்டி"
                style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={formData.targetAudienceTa}
                onChange={e => setFormData({ ...formData, targetAudienceTa: e.target.value })}
                placeholder="எ.கா: விவசாயிகள் / மகளிர் / மாணவர்கள்"
              />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>திட்ட நோக்கம் & விவரம் *</span>
            <textarea
              required
              rows={3}
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.descriptionTa}
              onChange={e => setFormData({ ...formData, descriptionTa: e.target.value })}
              placeholder="திட்டத்தின் முக்கிய நோக்கம் பற்றி எழுதவும்..."
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>வழங்கப்படும் பயன்கள் & நிதியுதவி *</span>
            <textarea
              required
              rows={2}
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.benefitsTa}
              onChange={e => setFormData({ ...formData, benefitsTa: e.target.value })}
              placeholder="எ.கா: மாதம் ₹1,000 மானியம் / 50% உபகரண மானியம்"
            />
          </label>

          {/* Eligibility Controls */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#0f766e', fontSize: '0.95rem' }}>தகுதி வரம்புகள் (Eligibility Rules)</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>குறைந்தபட்ச வயது</span>
                <input type="number" min="0" max="100" value={formData.minAge} onChange={e => setFormData({ ...formData, minAge: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>அதிகபட்ச வயது</span>
                <input type="number" min="0" max="100" value={formData.maxAge} onChange={e => setFormData({ ...formData, maxAge: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>அதிகபட்ச வருமானம் (₹)</span>
                <input type="number" step="10000" value={formData.maxAnnualIncome} onChange={e => setFormData({ ...formData, maxAnnualIncome: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>பாலினத் தகுதி</span>
                <select value={formData.eligibleGender} onChange={e => setFormData({ ...formData, eligibleGender: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="ALL">அனைவருக்கும் (All)</option>
                  <option value="FEMALE">பெண்கள் மட்டும் (Female)</option>
                  <option value="MALE">ஆண்கள் மட்டும் (Male)</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>தொழில்/பிரிவு</span>
                <select value={formData.eligibleOccupation} onChange={e => setFormData({ ...formData, eligibleOccupation: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="ALL">அனைத்தும் (All)</option>
                  <option value="FARMER">விவசாயிகள் (Farmer)</option>
                  <option value="STUDENT">மாணவர்கள் (Student)</option>
                  <option value="SENIOR">முதியோர் (Senior)</option>
                </select>
              </label>
            </div>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>தேவையான சான்றிதழ்கள் / ஆவணங்கள்</span>
            <input
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.requiredDocumentsTa}
              onChange={e => setFormData({ ...formData, requiredDocumentsTa: e.target.value })}
              placeholder="எ.கா: ஆதார் அட்டை, ரேஷன் அட்டை, வங்கி கணக்கு புத்தகம்"
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>அரசு இணையதள / விண்ணப்ப இணைப்பு (URL)</span>
            <input
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.officialUrl}
              onChange={e => setFormData({ ...formData, officialUrl: e.target.value })}
              placeholder="https://tnesevai.tn.gov.in"
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="இரண்டாம்" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px' }}>
              ரத்து செய்
            </button>
            <button type="submit" disabled={busy} className="முதல்" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} />
              <span>{busy ? 'பதிவேற்றப்படுகிறது...' : 'நலத்திட்டம் பதிவேற்று'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
