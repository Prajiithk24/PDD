import { useState, useEffect, useRef } from 'react';
import { MapPin, Info, AlertTriangle, Layers, CheckCircle2, Clock, User, Phone, Map, ShieldAlert, ArrowRight } from 'lucide-react';
import { நிலைப்பெயர், முன்னுரிமைப்பெயர் } from '../lib/mockData';

export default function DepartmentMapPanel({
  complaints = [],
  userDepartmentCode = '',
  userDepartmentName = '',
  isAdmin = false,
  onUpdateStatus,
}) {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(userDepartmentCode || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [modalComplaint, setModalComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  // Default Map center: Sholavandan / Madurai
  const defaultLat = 9.9800;
  const defaultLng = 78.0800;

  // Filter complaints strictly for the officer's department if not admin
  const effectiveDepartmentCode = isAdmin ? selectedDeptFilter : (userDepartmentCode || 'ALL');

  const deptFilteredComplaints = complaints.filter((item) => {
    // 1. Department match check
    if (effectiveDepartmentCode !== 'ALL') {
      const codeMatch = item.departmentCode === effectiveDepartmentCode;
      const labelMatch = (item.departmentLabelTa || '').toLowerCase().includes(effectiveDepartmentCode.toLowerCase());
      if (!codeMatch && !labelMatch) return false;
    }

    // 2. Status match check
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;

    // 3. Priority match check
    if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;

    // 4. Search term match
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchSub = (item.subjectTa || '').toLowerCase().includes(term);
      const matchLoc = (item.locationArea || '').toLowerCase().includes(term);
      const matchRef = (item.referenceNumber || '').toLowerCase().includes(term);
      const matchCit = (item.citizenName || '').toLowerCase().includes(term);
      if (!matchSub && !matchLoc && !matchRef && !matchCit) return false;
    }

    return true;
  });

  // Load Leaflet CSS & JS via CDN
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setIsLeafletReady(true);
      document.head.appendChild(script);
    } else {
      const script = document.getElementById('leaflet-js');
      script.addEventListener('load', () => setIsLeafletReady(true));
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || leafletMapRef.current) return;

    const L = window.L;
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isLeafletReady]);

  // Update map markers when filtered complaints change
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;

    const L = window.L;
    const map = leafletMapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    deptFilteredComplaints.forEach((item, index) => {
      // Deterministic offset for demo pins if exact lat/lng is default
      const lat = item.latitude || (defaultLat + (index % 5) * 0.008 - 0.015);
      const lng = item.longitude || (defaultLng + (index % 4) * 0.009 - 0.012);

      let pinColor = '#3b82f6'; // default blue
      if (item.priority === 'CRITICAL') pinColor = '#dc2626'; // red
      else if (item.priority === 'HIGH') pinColor = '#ea580c'; // orange
      else if (item.status === 'RESOLVED') pinColor = '#16a34a'; // green

      const customIcon = L.divIcon({
        className: 'custom-dept-map-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup html
      const popupHtml = `
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #0f172a; font-size: 14px; display: block;">${item.subjectTa || 'குறை'}</strong>
          <span style="font-size: 11px; color: #64748b;">${item.referenceNumber}</span>
          <div style="margin-top: 6px; font-size: 12px; color: #334155;">
            📍 ${item.locationArea || 'மதுரை'}
          </div>
          <div style="margin-top: 8px; display: flex; gap: 4px;">
            <span style="background: ${pinColor}22; color: ${pinColor}; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
              ${முன்னுரிமைப்பெயர்(item.priority)}
            </span>
            <span style="background: #e2e8f0; color: #334155; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
              ${நிலைப்பெயர்(item.status)}
            </span>
          </div>
          <button id="view-dept-complaint-${item.id}" style="
            margin-top: 8px; width: 100%; padding: 4px 8px; background: #0f766e; color: #fff;
            border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;
          ">
            விவரங்கள் பார் & நடவடிக்கை ➔
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-dept-complaint-${item.id}`);
        if (btn) {
          btn.onclick = () => setModalComplaint(item);
        }
      });

      markersRef.current.push(marker);
    });

    if (deptFilteredComplaints.length > 0 && markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }, [deptFilteredComplaints]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Department Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
        color: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Map size={28} style={{ color: '#5eead4' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>
              {userDepartmentName ? `${userDepartmentName} - துறை வரைபடம்` : 'துறை வாரி குறை வரைபடம்'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#99f6e4' }}>
              உங்கள் துறைக்கு ஒதுக்கப்பட்ட குறைகள் மட்டுமே இங்கு வரைபடத்தில் காட்டப்படுகின்றன
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
          <ShieldAlert size={20} style={{ color: '#fef08a' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            மொத்த குறைகள்: {deptFilteredComplaints.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        background: '#ffffff', padding: '1rem', borderRadius: '12px',
        border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap',
        gap: '0.75rem', alignItems: 'center'
      }}>
        {isAdmin && (
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600 }}
          >
            <option value="ALL">அனைத்து துறைகள்</option>
            <option value="WATER">குடிநீர் துறை</option>
            <option value="ELECTRICITY">மின்சார துறை</option>
            <option value="ROADS">சாலை மற்றும் போக்குவரத்து</option>
            <option value="MUNICIPAL">ஊராட்சி சேவை மையம்</option>
            <option value="RATION">உணவுப் பொருள் வழங்கல்</option>
            <option value="GENERAL">மக்கள் சேவை மையம்</option>
          </select>
        )}

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        >
          <option value="ALL">அனைத்து நிலைகள் (Status)</option>
          <option value="REGISTERED">பதிவு செய்யப்பட்டது (Registered)</option>
          <option value="IN_PROGRESS">செயலில் உள்ளது (In Progress)</option>
          <option value="RESOLVED">தீர்வு பெறப்பட்டது (Resolved)</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        >
          <option value="ALL">அனைத்து முன்னுரிமைகள்</option>
          <option value="CRITICAL">மிக அவசரம் (Critical)</option>
          <option value="HIGH">அவசரம் (High)</option>
          <option value="MEDIUM">நடுத்தரம் (Medium)</option>
        </select>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="குறை எண் / இடம் / பெயர் தேடுக..."
          style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1, minWidth: '180px' }}
        />
      </div>

      {/* Map & List Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', minHeight: '520px' }}>
        {/* Leaflet Map Box */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '520px' }} />
        </div>

        {/* Complaints Side Drawer List */}
        <div style={{
          background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
          maxHeight: '520px', overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            குறைகள் பட்டியல் ({deptFilteredComplaints.length})
          </h4>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
            வரைபடத்தில் குறிக்கப்பட்ட குறைகளை சொடுக்கி முழு விவரம் பார்க்கலாம்
          </p>

          {deptFilteredComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <Info size={32} style={{ marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>இந்த வடிப்பானில் குறைகள் எதுவும் இல்லை.</p>
            </div>
          ) : (
            deptFilteredComplaints.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setModalComplaint(item)}
                style={{
                  padding: '0.75rem', borderRadius: '10px', background: '#f8fafc',
                  border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', gap: '0.35rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0f766e'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f766e' }}>
                    #{idx + 1} - {item.referenceNumber}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                    background: item.priority === 'CRITICAL' ? '#fee2e2' : item.priority === 'HIGH' ? '#ffedd5' : '#f1f5f9',
                    color: item.priority === 'CRITICAL' ? '#dc2626' : item.priority === 'HIGH' ? '#c2410c' : '#475569',
                  }}>
                    {முன்னுரிமைப்பெயர்(item.priority)}
                  </span>
                </div>
                <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                  {item.subjectTa || 'குறை விவரம்'}
                </strong>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>📍 {item.locationArea || 'மதுரை'}</span>
                  <span style={{ fontWeight: 600, color: item.status === 'RESOLVED' ? '#16a34a' : '#2563eb' }}>
                    {நிலைப்பெயர்(item.status)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Complaint Detail Interactive Modal Popup */}
      {modalComplaint && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '600px',
            maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
              color: '#ffffff', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#99f6e4', fontWeight: 600 }}>
                  {modalComplaint.referenceNumber}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  {modalComplaint.subjectTa}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalComplaint(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>குடிமகன் பெயர்</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{modalComplaint.citizenName || 'குடிமகன்'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>கைபேசி எண்</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{modalComplaint.mobileNumber || '-'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>இடம் / கிராமம்</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{modalComplaint.locationArea || modalComplaint.village}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>துறை</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f766e' }}>{modalComplaint.departmentLabelTa}</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>குறை விவரம்:</span>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.925rem', color: '#334155', lineHeight: 1.5, background: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  {modalComplaint.descriptionTa || modalComplaint.transcript}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>தற்போதைய நிலை:</span>
                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
                  background: modalComplaint.status === 'RESOLVED' ? '#dcfce7' : '#dbeafe',
                  color: modalComplaint.status === 'RESOLVED' ? '#15803d' : '#1d4ed8',
                }}>
                  {நிலைப்பெயர்(modalComplaint.status)}
                </span>
              </div>

              {/* Department Officer Actions */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="இரண்டாம்"
                  onClick={() => {
                    if (onUpdateStatus) onUpdateStatus(modalComplaint.id, 'IN_PROGRESS', 'குழு பணியில் ஈடுபடுத்தப்பட்டது');
                    setModalComplaint(null);
                  }}
                  style={{ padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  செயலில் மாற்று (In Progress)
                </button>
                <button
                  type="button"
                  className="முதல்"
                  onClick={() => {
                    if (onUpdateStatus) onUpdateStatus(modalComplaint.id, 'RESOLVED', 'சேவை நிறைவு செய்யப்பட்டது');
                    setModalComplaint(null);
                  }}
                  style={{ padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.85rem', background: '#16a34a' }}
                >
                  தீர்வு பதிவு செய் (Resolve)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
