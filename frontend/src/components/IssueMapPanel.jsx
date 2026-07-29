import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Info, AlertTriangle, Layers, RefreshCw } from 'lucide-react';
import { நிலைப்பெயர், முன்னுரிமைப்பெயர் } from '../lib/mockData';

export default function IssueMapPanel({ complaints = [], onSelectComplaint }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeComplaint, setActiveComplaint] = useState(complaints[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  // Sholavandan / Madurai default coordinates
  const defaultLat = 9.9800;
  const defaultLng = 78.0800;

  // 1. Filter complaints
  const filteredComplaints = complaints.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.categoryCode === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesSearch = !searchTerm || 
      (item.subjectTa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.locationArea || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // 2. Load OpenStreetMap Leaflet library via CDN dynamically
  useEffect(() => {
    // Check if Leaflet CSS is already injected
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Check if Leaflet JS is already loaded
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setIsLeafletReady(true);
      };
      document.head.appendChild(script);
    } else {
      const script = document.getElementById('leaflet-js');
      script.addEventListener('load', () => setIsLeafletReady(true));
    }
  }, []);

  // 3. Initialize OpenStreetMap Map Instance
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || leafletMapRef.current) return;

    const L = window.L;
    // Create Leaflet map centered at Madurai/Sholavandan area
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: true,
    });

    // Add OpenStreetMap Free Open Source Tile Layer
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

  // 4. Update Leaflet Map Markers when filtered complaints change
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;

    const L = window.L;
    const map = leafletMapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    const getPinColor = (status) => {
      switch (status) {
        case 'RESOLVED': return '#10b981'; // Green
        case 'IN_PROGRESS': case 'FIELD_VISIT': return '#3b82f6'; // Blue
        case 'ROUTED': return '#f59e0b'; // Amber
        default: return '#ef4444'; // Red
      }
    };

    const fallbackOffsets = [
      { lat: 9.9650, lng: 78.0050 },
      { lat: 10.0210, lng: 78.1430 },
      { lat: 9.9250, lng: 78.1180 },
      { lat: 9.9950, lng: 78.0500 },
      { lat: 9.9400, lng: 78.1600 }
    ];

    filteredComplaints.forEach((item, index) => {
      const lat = item.latitude || fallbackOffsets[index % fallbackOffsets.length].lat;
      const lng = item.longitude || fallbackOffsets[index % fallbackOffsets.length].lng;
      const color = getPinColor(item.status);

      // Create Custom SVG Map Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background: ${color};
            color: #fff;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            display: flex;
            align-items: center;
            gap: 4px;
            transform: translate(-50%, -100%);
          ">
            <span>📍 ${item.categoryLabelTa || 'குறை'}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Marker Popup Content
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-size: 11px; font-weight: 700; color: #2563eb; margin-bottom: 2px;">${item.referenceNumber}</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${item.subjectTa || item.categoryLabelTa}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${item.locationArea || item.village}</div>
          <div style="font-size: 11px; font-weight: 600; color: ${color};">● ${நிலைப்பெயர்(item.status)}</div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActiveComplaint(item);
      });

      markersRef.current.push(marker);
    });

    if (filteredComplaints.length > 0 && markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }, [filteredComplaints, isLeafletReady]);

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ background: '#3b82f622', color: '#60a5fa', padding: '0.6rem', borderRadius: '12px' }}>
            <MapPin size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>ஊர் குறை வரைபடம் (OpenStreetMap GIS View)</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.925rem' }}>
              திறந்த மூல வரைபடத்தில் (OpenStreetMap) உங்கள் கிராமத்தின் குறைகளைக் காண்க
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="தெரு / இடம் / குறை எண் தேடு..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#fff',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#fff',
              fontSize: '0.875rem'
            }}
          >
            <option value="ALL">அனைத்து வகைகள் (All Categories)</option>
            <option value="WATER_SHORTAGE">குடிநீர் பற்றாக்குறை</option>
            <option value="ELECTRICITY_OUTAGE">மின்சாரம்</option>
            <option value="ROAD_DAMAGE">சாலை சேதம்</option>
            <option value="STREETLIGHT">தெருவிளக்கு</option>
            <option value="SANITATION">சுத்தம் மற்றும் கழிவுநீர்</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#fff',
              fontSize: '0.875rem'
            }}
          >
            <option value="ALL">அனைத்து நிலை (All Statuses)</option>
            <option value="REGISTERED">பதிவு செய்யப்பட்டது</option>
            <option value="IN_PROGRESS">செயலில் உள்ளது</option>
            <option value="RESOLVED">தீர்வு வழங்கப்பட்டது</option>
          </select>
        </div>
      </div>

      {/* Main Map + Card Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', minHeight: '520px' }}>
        
        {/* Real OpenStreetMap Container */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          minHeight: '480px'
        }}>
          {!isLeafletReady && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b', gap: '8px' }}>
              <RefreshCw size={20} className="spin" />
              <span>OpenStreetMap ஏற்றப்படுகிறது...</span>
            </div>
          )}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '480px', zIndex: 1 }} />
        </div>

        {/* Selected Complaint Detail Panel */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          {activeComplaint ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {activeComplaint.referenceNumber}
                </span>
                <span style={{
                  background: activeComplaint.status === 'RESOLVED' ? '#dcfce7' : '#fef3c7',
                  color: activeComplaint.status === 'RESOLVED' ? '#166534' : '#92400e',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {நிலைப்பெயர்(activeComplaint.status)}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                {activeComplaint.subjectTa || activeComplaint.categoryLabelTa}
              </h3>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                {activeComplaint.descriptionTa || activeComplaint.transcriptTa}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#3b82f6" />
                  <span><strong>இடம்:</strong> {activeComplaint.locationArea}, {activeComplaint.village || 'மதுரை'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} color="#8b5cf6" />
                  <span><strong>துறை:</strong> {activeComplaint.departmentLabelTa}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} color="#f59e0b" />
                  <span><strong>அவசரம்:</strong> {முன்னுரிமைப்பெயர்(activeComplaint.priority)}</span>
                </div>
              </div>

              {onSelectComplaint && (
                <button
                  onClick={() => onSelectComplaint(activeComplaint.id)}
                  style={{
                    marginTop: '1.5rem',
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Info size={16} />
                  <span>முழு விவரம் பார்க்க</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto 0' }}>
              <MapPin size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p>வரைபடத்தில் ஏதேனும் ஒரு குறை பின்னை அழுத்துங்கள்</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
