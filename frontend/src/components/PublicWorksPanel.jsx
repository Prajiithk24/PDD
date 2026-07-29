import { useState } from 'react';
import { Building2, IndianRupee, CheckCircle2, Clock, Calendar, User, Search, TrendingUp, ShieldCheck } from 'lucide-react';

const DEFAULT_PUBLIC_WORKS = [
  {
    id: 1,
    projectTitleTa: 'சென்னை அண்ணா நகர் 2-வது அவென்யூ மழைநீர் வடிகால் கட்டமைப்பு பணி',
    departmentNameTa: 'சென்னை மாநகராட்சி (GCC)',
    contractorName: 'தமிழ்நாடு உள்கட்டமைப்பு மேம்பாட்டு நிறுவனம்',
    allocatedBudgetLakhs: 45.0,
    spentBudgetLakhs: 32.5,
    completionPercentage: 75,
    locationTa: 'அண்ணா நகர், சென்னை',
    village: 'அண்ணா நகர்',
    district: 'சென்னை',
    status: 'IN_PROGRESS',
    statusTa: 'நடைபெறுகிறது',
    startDate: '2026-02-10',
    expectedEndDate: '2026-08-30',
    descriptionTa: 'மழைக்கால வெள்ளநீரைத் தடுக்க 2.5 கி.மீ நீள மழைநீர் வடிகால் சீரமைப்பு மற்றும் தார் சாலை புதுப்பித்தல் பணி.',
  },
  {
    id: 2,
    projectTitleTa: 'சென்னை சிந்தாதிரிப்பேட்டை மெட்ரோ குடிநீர் குழாய் மறுசீரமைப்பு',
    departmentNameTa: 'சென்னை குடிநீர் வாரியம் (CMWSSB)',
    contractorName: 'சென்னை மெட்ரோ வாட்டர் இன்ஃபுரா',
    allocatedBudgetLakhs: 28.0,
    spentBudgetLakhs: 28.0,
    completionPercentage: 100,
    locationTa: 'சிந்தாதிரிப்பேட்டை, சென்னை',
    village: 'சிந்தாதிரிப்பேட்டை',
    district: 'சென்னை',
    status: 'COMPLETED',
    statusTa: 'நிறைவு பெற்றது',
    startDate: '2026-01-15',
    expectedEndDate: '2026-05-20',
    descriptionTa: '10,000 குடும்பங்களுக்கு தடங்கலற்ற குடிநீர் விநியோகம் வழங்க புதிய பிரதான குடிநீர் குழாய் அமைக்கும் பணி நிறைவடைந்தது.',
  },
  {
    id: 3,
    projectTitleTa: 'கிண்டி - அண்ணா சாலை ஸ்மார்ட் எல்.இ.டி தெருவிளக்குகள் அமைத்தல்',
    departmentNameTa: 'மின்சார வாரியம் (TANGEDCO)',
    contractorName: 'ஸ்மார்ட் சிட்டி சென்னை லிமிடெட்',
    allocatedBudgetLakhs: 18.5,
    spentBudgetLakhs: 14.0,
    completionPercentage: 80,
    locationTa: 'கிண்டி & சைதாப்பேட்டை, சென்னை',
    village: 'கிண்டி',
    district: 'சென்னை',
    status: 'IN_PROGRESS',
    statusTa: 'நடைபெறுகிறது',
    startDate: '2026-03-01',
    expectedEndDate: '2026-07-15',
    descriptionTa: '500+ புதிய எல்.இ.டி தெருவிளக்குகள் மற்றும் தானியங்கி மின் கட்டுப்பாட்டு அமைப்புகள் நிறுவும் பணி.',
  },
  {
    id: 4,
    projectTitleTa: 'கூவம் ஆற்றங்கரை பூங்கா மற்றும் நடைபாதை நிலப்பரப்பு மேம்பாடு',
    departmentNameTa: 'சென்னை நதிகள் சீரமைப்பு அறக்கட்டளை (CRRT)',
    contractorName: 'கிரீன் சென்னை கன்ஸ்ட்ரக்ஷன்ஸ்',
    allocatedBudgetLakhs: 60.0,
    spentBudgetLakhs: 10.0,
    completionPercentage: 20,
    locationTa: 'சேப்பாக்கம் & சிந்தாதிரிப்பேட்டை, சென்னை',
    village: 'சேப்பாக்கம்',
    district: 'சென்னை',
    status: 'PROPOSED',
    statusTa: 'முன்மொழியப்பட்டது',
    startDate: '2026-06-01',
    expectedEndDate: '2026-12-31',
    descriptionTa: 'பொதுமக்கள் நடைபயிற்சி மற்றும் சிறுவர் விளையாட்டு பூங்கா வசதிகளுடன் ஆற்றங்கரை சீரமைப்பு திட்டம்.',
  },
  {
    id: 5,
    projectTitleTa: 'சோழவந்தான் மேலத் தெரு சிமெண்ட் சாலை மற்றும் வடிகால் பணி',
    departmentNameTa: 'ஊராட்சி ஒன்றிய அலுவலகம்',
    contractorName: 'கிராம வளர்ச்சி முகமை',
    allocatedBudgetLakhs: 12.0,
    spentBudgetLakhs: 12.0,
    completionPercentage: 100,
    locationTa: 'மேலத் தெரு, சோழவந்தான், மதுரை',
    village: 'சோழவந்தான்',
    district: 'மதுரை',
    status: 'COMPLETED',
    statusTa: 'நிறைவு பெற்றது',
    startDate: '2026-01-10',
    expectedEndDate: '2026-04-15',
    descriptionTa: '1.2 கி.மீ நீளத்திற்கு உயர்தர சிமெண்ட் தளம் மற்றும் மூடிய வடிகால் கட்டமைப்பு நிறைவுற்றது.',
  },
];

export default function PublicWorksPanel({ worksList = [] }) {
  const data = worksList && worksList.length > 0 ? [...worksList, ...DEFAULT_PUBLIC_WORKS] : DEFAULT_PUBLIC_WORKS;
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorks = data.filter((item) => {
    let matchesStatus = true;
    if (activeStatusFilter === 'IN_PROGRESS') {
      matchesStatus = item.status === 'IN_PROGRESS' || item.statusTa?.includes('நடைபெறுகிறது');
    } else if (activeStatusFilter === 'COMPLETED') {
      matchesStatus = item.status === 'COMPLETED' || item.statusTa?.includes('நிறைவு');
    } else if (activeStatusFilter === 'PROPOSED') {
      matchesStatus = item.status === 'PROPOSED' || item.statusTa?.includes('முன்மொழிய');
    }

    const matchesSearch = !searchTerm ||
      (item.projectTitleTa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.district || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.contractorName || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalAllocated = data.reduce((sum, item) => sum + (item.allocatedBudgetLakhs || 0), 0);
  const totalSpent = data.reduce((sum, item) => sum + (item.spentBudgetLakhs || 0), 0);
  const completedCount = data.filter((item) => item.status === 'COMPLETED' || item.statusTa?.includes('நிறைவு')).length;
  const inProgressCount = data.filter((item) => item.status === 'IN_PROGRESS' || item.statusTa?.includes('நடைபெறுகிறது')).length;

  const getStatusBadge = (item) => {
    if (item.status === 'COMPLETED' || item.statusTa?.includes('நிறைவு')) {
      return <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> நிறைவு பெற்றது</span>;
    }
    if (item.status === 'IN_PROGRESS' || item.statusTa?.includes('நடைபெறுகிறது')) {
      return <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> நடைபெறுகிறது</span>;
    }
    return <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> முன்மொழியப்பட்டது</span>;
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#fff',
        padding: '1.75rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: '#818cf822', color: '#818cf8', padding: '0.65rem', borderRadius: '12px' }}>
            <Building2 size={30} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>பொதுப் பணிகள் & நிதி வெளிப்படைத்தன்மை</h2>
            <p style={{ margin: 0, color: '#a5b4fc', fontSize: '0.925rem' }}>
              மாநகராட்சி & கிராம உள்ளாட்சி வளர்ச்சி பணிகள், ஒதுக்கப்பட்ட நிதி மற்றும் தற்போதைய பணி நிலவரம்
            </p>
          </div>
        </div>

        {/* Summary Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.25rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>மொத்த திட்டங்கள்</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{data.length} பணிகள்</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>மொத்த நிதி ஒதுக்கீடு</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>₹ {totalAllocated.toFixed(2)} லட்சம்</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>பயன்படுத்தப்பட்ட நிதி</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4ade80', marginTop: '4px' }}>₹ {totalSpent.toFixed(2)} லட்சம்</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>நிறைவு / நடைபெறுபவை</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24', marginTop: '4px' }}>{completedCount} / {inProgressCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'ALL', label: 'அனைத்தும்' },
            { key: 'IN_PROGRESS', label: 'நடைபெறுபவை' },
            { key: 'COMPLETED', label: 'நிறைவு பெற்றவை' },
            { key: 'PROPOSED', label: 'முன்மொழியப்பட்டவை' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatusFilter(tab.key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeStatusFilter === tab.key ? '#2563eb' : '#f1f5f9',
                color: activeStatusFilter === tab.key ? '#fff' : '#475569',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="திட்டம் / நகரம் / ஒப்பந்ததாரர் தேடு..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.5rem 0.5rem 2.2rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {/* Works Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredWorks.map((work) => {
          const budgetPercent = Math.min(100, Math.round(((work.spentBudgetLakhs || 0) / (work.allocatedBudgetLakhs || 1)) * 100));

          return (
            <div
              key={work.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6366f1', background: '#eef2ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {work.departmentNameTa || 'மாநகராட்சி / ஊராட்சி'}
                  </span>
                  {getStatusBadge(work)}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {work.projectTitleTa}
                </h3>

                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {work.descriptionTa}
                </p>

                {/* Progress Bar Component */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>
                    <span>பணி முன்னேற்றம்:</span>
                    <span>{work.completionPercentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${work.completionPercentage}%`,
                      background: work.completionPercentage === 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* Financial details box */}
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748b' }}>ஒதுக்கப்பட்ட நிதி:</span>
                    <strong style={{ color: '#0f172a' }}>₹ {work.allocatedBudgetLakhs} லட்சம்</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ color: '#64748b' }}>பயன்படுத்தப்பட்ட நிதி:</span>
                    <strong style={{ color: '#16a34a' }}>₹ {work.spentBudgetLakhs} லட்சம் ({budgetPercent}%)</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer details */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.775rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#6366f1" />
                  <span><strong>ஒப்பந்ததாரர்:</strong> {work.contractorName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#f59e0b" />
                  <span><strong>கால அளவு:</strong> {work.startDate} முதல் {work.expectedEndDate || work.estimatedCompletionDate || '2026-10-30'} வரை</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
