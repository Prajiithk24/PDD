import { useState } from 'react';
import { Building2, X, PlusCircle } from 'lucide-react';

export default function UploadPublicWorkModal({ isOpen, onClose, onSave, defaultDepartmentCode = 'WATER', defaultDepartmentName = 'குடிநீர் துறை' }) {
  const [formData, setFormData] = useState({
    titleTa: '',
    descriptionTa: '',
    categoryCode: 'WATER_SHORTAGE',
    departmentCode: defaultDepartmentCode,
    departmentNameTa: defaultDepartmentName,
    villageNameTa: 'சோழவந்தான்',
    districtNameTa: 'மதுரை',
    specificLocationTa: 'பிரதான வீதி',
    allocatedBudgetLakhs: 15.50,
    spentBudgetLakhs: 5.00,
    progressPercentage: 25,
    status: 'IN_PROGRESS',
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: '2026-12-31',
    contractorNameTa: 'மதுரை உள்கட்டமைப்பு நிறுவனம்',
  });

  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({
        ...formData,
        allocatedBudgetLakhs: Number(formData.allocatedBudgetLakhs),
        spentBudgetLakhs: Number(formData.spentBudgetLakhs),
        progressPercentage: Number(formData.progressPercentage),
      });
      onClose();
    } catch (err) {
      console.error('Failed to upload public work project', err);
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
          padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: '#ffffff', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building2 size={24} style={{ color: '#93c5fd' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>புதிய பொதுப் பணி திட்டம் சேர்</h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>திட்டத்தின் தலைப்பு (தமிழில்) *</span>
            <input
              required
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.titleTa}
              onChange={e => setFormData({ ...formData, titleTa: e.target.value })}
              placeholder="எ.கா: மேற்கு தெரு புதிய குடிநீர் தொட்டி அமைத்தல்"
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>திட்ட விவரங்கள் *</span>
            <textarea
              required
              rows={3}
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.descriptionTa}
              onChange={e => setFormData({ ...formData, descriptionTa: e.target.value })}
              placeholder="திட்டத்தின் எல்லை மற்றும் பணிகள் பற்றிய விளக்கம்..."
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>துறை பெயர் *</span>
              <input
                required
                className="உரைப்பெட்டி"
                style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={formData.departmentNameTa}
                onChange={e => setFormData({ ...formData, departmentNameTa: e.target.value })}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>பணி வகை</span>
              <select
                value={formData.categoryCode}
                onChange={e => setFormData({ ...formData, categoryCode: e.target.value })}
                style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="WATER_SHORTAGE">குடிநீர் திட்டம்</option>
                <option value="ELECTRICITY_OUTAGE">மின்சார பணி</option>
                <option value="ROAD_DAMAGE">சாலை பணி</option>
                <option value="SANITATION">சுத்தம்/கழிவுநீர் பணி</option>
                <option value="STREETLIGHT">தெருவிளக்கு பணி</option>
                <option value="GENERAL">பொது சேவை பணி</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
              <span>ஊர் / கிராமம்</span>
              <input value={formData.villageNameTa} onChange={e => setFormData({ ...formData, villageNameTa: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
              <span>மாவட்டம்</span>
              <input value={formData.districtNameTa} onChange={e => setFormData({ ...formData, districtNameTa: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
              <span>குறிப்பிட்ட இடம்</span>
              <input value={formData.specificLocationTa} onChange={e => setFormData({ ...formData, specificLocationTa: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </label>
          </div>

          {/* Budget & Progress */}
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e40af', fontSize: '0.95rem' }}>நிதி ஒதுக்கீடு & பணி முன்னேற்றம் (Budget & Progress)</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>ஒதுக்கப்பட்ட நிதி (₹ லட்சம்)</span>
                <input type="number" step="0.1" value={formData.allocatedBudgetLakhs} onChange={e => setFormData({ ...formData, allocatedBudgetLakhs: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>பயன்படுத்திய நிதி (₹ லட்சம்)</span>
                <input type="number" step="0.1" value={formData.spentBudgetLakhs} onChange={e => setFormData({ ...formData, spentBudgetLakhs: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>முன்னேற்றம் (%)</span>
                <input type="number" min="0" max="100" value={formData.progressPercentage} onChange={e => setFormData({ ...formData, progressPercentage: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>பணி நிலை</span>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="PROPOSED">முன்மொழியப்பட்டது (Proposed)</option>
                  <option value="IN_PROGRESS">நடைபெறுகிறது (In Progress)</option>
                  <option value="COMPLETED">நிறைவு பெற்றது (Completed)</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>தொடக்க நாள்</span>
                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span>இலக்கு நாள்</span>
                <input type="date" value={formData.targetCompletionDate} onChange={e => setFormData({ ...formData, targetCompletionDate: e.target.value })} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </label>
            </div>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>ஒப்பந்ததாரர் / நிறுவனம்</span>
            <input
              className="உரைப்பெட்டி"
              style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              value={formData.contractorNameTa}
              onChange={e => setFormData({ ...formData, contractorNameTa: e.target.value })}
              placeholder="எ.கா: ஸ்ரீ குமரன் இன்ஃப்ரா லிமிடெட்"
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="இரண்டாம்" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px' }}>
              ரத்து செய்
            </button>
            <button type="submit" disabled={busy} className="முதல்" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} />
              <span>{busy ? 'பதிவேற்றப்படுகிறது...' : 'பொதுப் பணி சேர்'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
