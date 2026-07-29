import { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, FileCheck, ExternalLink, RefreshCw, ChevronRight, UserCheck, Shield } from 'lucide-react';
import { தொடக்க_நலத்திட்டங்கள் } from '../lib/mockData';

export default function WelfareSchemeWizard({ schemesList = [] }) {
  const allSchemes = schemesList.length > 0 ? schemesList : தொடக்க_நலத்திட்டங்கள்;

  // Wizard state
  const [formData, setFormData] = useState({
    age: 30,
    annualIncome: 150000,
    gender: 'FEMALE',
    occupation: 'FARMER',
    community: 'BC',
  });

  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEligibility = (e) => {
    if (e) e.preventDefault();
    const evaluated = allSchemes.map((scheme) => {
      let score = 0;
      const total = 4;
      const matchReasons = [];
      const gaps = [];

      // 1. Age check
      if (formData.age >= scheme.minAge && formData.age <= scheme.maxAge) {
        score++;
        matchReasons.push(`வயது தகுதி பொருந்தது (${scheme.minAge} - ${scheme.maxAge} வயது)`);
      } else {
        gaps.push(`வயது வரம்பு: ${scheme.minAge} முதல் ${scheme.maxAge} வரை`);
      }

      // 2. Income check
      if (formData.annualIncome <= scheme.maxAnnualIncome) {
        score++;
        matchReasons.push(`ஆண்டு வருமான வரம்பிற்குள் உள்ளது (அதிகபட்சம் ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')})`);
      } else {
        gaps.push(`அதிகபட்ச ஆண்டு வருமானம்: ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}`);
      }

      // 3. Gender check
      if (scheme.eligibleGender === 'ALL' || formData.gender === scheme.eligibleGender) {
        score++;
        matchReasons.push('பாலினத் தகுதி பொருந்தது');
      } else {
        gaps.push(`பாலினத் தகுதி: ${scheme.eligibleGender === 'FEMALE' ? 'பெண்கள் மட்டும்' : 'ஆண்கள் மட்டும்'}`);
      }

      // 4. Occupation check
      if (scheme.eligibleOccupation === 'ALL' || formData.occupation === scheme.eligibleOccupation) {
        score++;
        matchReasons.push('தொழில்/பிரிவு தகுதி பொருந்தது');
      } else {
        gaps.push(`குறிப்பிட்ட பிரிவு: ${scheme.eligibleOccupation}`);
      }

      const matchPercentage = Math.round((score / total) * 100);

      return {
        scheme,
        matchPercentage,
        isEligible: matchPercentage >= 75,
        matchReasons,
        gaps,
      };
    });

    evaluated.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setResults(evaluated);
    setHasCalculated(true);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)',
        color: '#fff',
        padding: '1.75rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ffffff22', color: '#6ee7b7', padding: '0.65rem', borderRadius: '12px' }}>
            <Award size={30} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>அரசு & NGO நலத்திட்ட தகுதி சரிபார்ப்பு</h2>
            <p style={{ margin: 0, color: '#a7f3d0', fontSize: '0.925rem' }}>
              உங்கள் வயது, வருமானம் மற்றும் தொழில் விவரங்களை உள்ளிட்டு தகுதியான நலத்திட்டங்களைக் கண்டறியுங்கள்
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form wizard on left, Results list on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Form Wizard Box */}
        <form onSubmit={calculateEligibility} style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="#059669" />
            <span>உங்கள் விவரங்களை உள்ளிடவும்</span>
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
              வயது (Age): {formData.age} ஆண்டுகள்
            </label>
            <input
              type="range"
              min="15"
              max="90"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#059669' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
              ஆண்டு வருமானம் (Annual Income): ₹ {formData.annualIncome.toLocaleString('en-IN')}
            </label>
            <select
              value={formData.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', parseFloat(e.target.value))}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value={75000}>₹ 75,000 வரை (குறைந்த வருமானம் / BPL)</option>
              <option value={150000}>₹ 1.5 லட்சம் வரை</option>
              <option value={250000}>₹ 2.5 லட்சம் வரை</option>
              <option value={500000}>₹ 5.0 லட்சம் வரை</option>
              <option value={800000}>₹ 8.0 லட்சத்திற்கு மேல்</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
              பாலினம் (Gender)
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'FEMALE'}
                  onChange={() => handleInputChange('gender', 'FEMALE')}
                  style={{ accentColor: '#059669' }}
                />
                பெண்
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'MALE'}
                  onChange={() => handleInputChange('gender', 'MALE')}
                  style={{ accentColor: '#059669' }}
                />
                ஆண்
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
              தொழில் / தற்போதைய நிலை (Occupation)
            </label>
            <select
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="FARMER">விவசாயி / விவசாயத் தொழிலாளி</option>
              <option value="STUDENT">மாணவி / மாணவர்</option>
              <option value="SENIOR">முதியோர் (60+)</option>
              <option value="WOMEN_ENTREPRENEUR">சுயஉதவிக் குழு / பெண் தொழில்முனைவோர்</option>
              <option value="WORKER">அமைப்பில்லா கூலித் தொழிலாளி</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.8rem',
              borderRadius: '10px',
              background: '#059669',
              color: '#fff',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}
          >
            <Shield size={18} />
            <span>தகுதியான திட்டங்களைக் காண்க</span>
          </button>
        </form>

        {/* Results List Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!hasCalculated ? (
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              border: '2px dashed #cbd5e1',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <Award size={48} style={{ opacity: 0.4, margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.5rem' }}>தகுதி அறிய படிவத்தைப் பூர்த்தி செய்யுங்கள்</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>இடதுபுறத்தில் உங்கள் தகவல்களைத் தேர்ந்தெடுத்து "தகுதியான திட்டங்களைக் காண்க" பொத்தானை அழுத்தவும்.</p>
            </div>
          ) : (
            results.map(({ scheme, matchPercentage, isEligible, matchReasons, gaps }) => (
              <div
                key={scheme.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: isEligible ? '2px solid #10b981' : '1px solid #e2e8f0',
                  padding: '1.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Match Banner Ribbon */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: matchPercentage === 100 ? '#dcfce7' : matchPercentage >= 75 ? '#dbeafe' : '#f1f5f9',
                  color: matchPercentage === 100 ? '#15803d' : matchPercentage >= 75 ? '#1d4ed8' : '#64748b',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={14} />
                  <span>{matchPercentage}% பொருத்தம்</span>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {scheme.categoryTa}
                </span>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0.5rem 0 0.25rem', paddingRight: '100px' }}>
                  {scheme.titleTa}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.75rem' }}>{scheme.departmentNameTa}</p>

                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                  {scheme.descriptionTa}
                </p>

                {/* Benefits highlight box */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.825rem', color: '#166534', display: 'block', marginBottom: '2px' }}>🎁 திட்ட நன்மைகள்:</strong>
                  <span style={{ fontSize: '0.85rem', color: '#14532d' }}>{scheme.benefitsTa}</span>
                </div>

                {/* Required Documents */}
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <FileCheck size={16} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>தேவையான ஆவணங்கள்:</strong> {scheme.requiredDocumentsTa}</span>
                </div>

                {/* Official Application Portal Link */}
                {scheme.officialPortalUrl && (
                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#2563eb',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>அரசு அதிகாரப்பூர்வ இணையதளத்தில் விண்ணப்பிக்க</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
