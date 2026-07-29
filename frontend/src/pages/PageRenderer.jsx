import { Link, useNavigate } from 'react-router-dom';
import ChartPanel from '../components/ChartPanel';
import ComplaintComposer from '../components/ComplaintComposer';
import ComplaintTable from '../components/ComplaintTable';
import TimelinePanel from '../components/TimelinePanel';
import IssueMapPanel from '../components/IssueMapPanel';
import DepartmentMapPanel from '../components/DepartmentMapPanel';
import WelfareSchemeWizard from '../components/WelfareSchemeWizard';
import PublicWorksPanel from '../components/PublicWorksPanel';
import { துறைகள், டாஷ்போர்டு_உருவாக்கு, நிலைப்பெயர், முன்னுரிமைப்பெயர் } from '../lib/mockData';
import { filterComplaintsForUser } from '../App';

function அட்டைவரிசை(cards) {
  return (
    <div className="அட்டைக்கூட்டம்">
      {cards.map((card) => (
        <article key={card.titleTa} className="அட்டை எண்_அட்டை">
          <p>{card.titleTa}</p>
          <strong>{card.valueTa}</strong>
          <span>{card.noteTa}</span>
        </article>
      ))}
    </div>
  );
}

function சுருக்கஅட்டை({ title, description, links = [] }) {
  return (
    <section className="அட்டை நெடுஅட்டை">
      <div className="அட்டை_மேல்">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {links.length > 0 && (
        <div className="இணைப்பு_கட்டம்">
          {links.map((item) => (
            <Link key={item.to} className="செயல்_இணைப்பு" to={item.to}>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function நாள்(மதிப்பு) {
  return new Intl.DateTimeFormat('ta-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(மதிப்பு));
}

export default function PageRenderer({ page, state, actions, pages }) {
  const navigate = useNavigate();
  const selectedComplaint = state.complaints.find((item) => item.id === state.selectedComplaintId) || state.complaints[0];
  const hasVoiceDraft = Boolean((state.draft.transcript || '').trim());
  const hasAnyDraft = Boolean((state.draft.description || state.draft.transcript || '').trim());
  const shouldShowDraftAnalysis = page.kind === 'voiceComplaint' ? hasVoiceDraft : hasAnyDraft;
  const draftAnalysis = shouldShowDraftAnalysis ? state.draftAnalysis : null;
  const homeDashboard = state.homeDashboard || டாஷ்போர்டு_உருவாக்கு('முகப்பு', 'தமிழ் குறைதீர் தளம்', state.complaints);
  const citizenDashboard = state.citizenDashboard || homeDashboard;
  const adminDashboard = state.adminDashboard || homeDashboard;

  if (page.kind === 'home') {
    return (
      <>
        <section className="வீரம்">
          <div className="வீரம்_உரை">
            <p className="சிறுகுறிப்பு">குரல், தமிழ், தானியங்கி துறை ஒதுக்கீடு</p>
            <h3>எழுதத் தெரியாவிட்டாலும் பேசுங்கள். குறை பதிவு உடனே தொடங்கும்.</h3>
            <p className="வீரம்_விளக்கம்">
              கிராம மற்றும் நகர்ப்புற மக்களுக்கு எளிதில் பயன்படுத்தக்கூடிய, தமிழ் குரல் ஆதரவு கொண்ட,
              துறைவாரி குறை ஒதுக்கீடு அமைப்பு.
            </p>
            <div className="செயற்பொத்தான்கள்">
              <button type="button" className="முதல்" onClick={() => navigate('/குரல்-குறை-பதிவு')}>குரல் பதிவு தொடங்கு</button>
              <button type="button" className="இரண்டாம்" onClick={() => navigate('/நிலை-கண்காணிப்பு')}>நிலை பார்க்க</button>
            </div>
          </div>
          <div className="வீரம்_எண்கள்">
            {அட்டைவரிசை(homeDashboard.cards)}
          </div>
        </section>

        <div className="இரண்டு_நெடுவரிசை">
          <ChartPanel title="நிலை வாரியான பகிர்வு" data={homeDashboard.statusChart} />
          <ChartPanel title="வகை வாரியான பகிர்வு" data={homeDashboard.categoryChart} type="pie" />
        </div>

        <ComplaintTable complaints={homeDashboard.recentComplaints} onSelect={actions.setSelectedComplaintId} />

        <div className="மூன்று_நெடுவரிசை">
          {state.announcements.length > 0 ? state.announcements.slice(0, 3).map((item) => (
            <article key={item.id} className="அட்டை">
              <div className="அட்டை_மேல்">
                <h3>{item.titleTa}</h3>
                <p>{item.areaNameTa}</p>
              </div>
              <p>{item.contentTa}</p>
            </article>
          )) : (
            <article className="அட்டை காலி_அட்டை">
              <h3>அறிவிப்புகள் இல்லை</h3>
              <p>புதிய சேவை அறிவிப்புகள் வந்தவுடன் இங்கு தெரியும்.</p>
            </article>
          )}
        </div>
      </>
    );
  }

  if (page.kind === 'auth') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>{page.title}</h3>
            <p>{page.summary}</p>
          </div>
          <div className="புலங்கள்">
            <label>
              <span>பெயர்</span>
              <input value={state.profile.பெயர்} onChange={(event) => actions.updateProfile({ பெயர்: event.target.value })} />
            </label>
            <label>
              <span>கைபேசி எண்</span>
              <input value={state.profile.கைபேசி} onChange={(event) => actions.updateProfile({ கைபேசி: event.target.value })} />
            </label>
            <label>
              <span>ஊர்</span>
              <input value={state.profile.ஊர்} onChange={(event) => actions.updateProfile({ ஊர்: event.target.value })} />
            </label>
            <label>
              <span>மாவட்டம்</span>
              <input value={state.profile.மாவட்டம்} onChange={(event) => actions.updateProfile({ மாவட்டம்: event.target.value })} />
            </label>
          </div>
          <div className="செயற்பொத்தான்கள்">
            <button type="button" className="முதல்" onClick={() => navigate(page.audience === 'நிர்வாகம்' ? '/நிர்வாக-முகப்பு' : '/குடிமக்கள்-பலகை')}>தொடர்க</button>
          </div>
        </section>
        {சுருக்கஅட்டை({
          title: 'வேகமான செயல்முறை',
          description: 'தமிழில் பேசலாம், உரையாக்கலாம், துறைக்கு தானாக ஒதுக்கலாம், பின்னர் நிலையை கண்காணிக்கலாம்.',
          links: [
            { to: '/குரல்-குறை-பதிவு', title: 'குரல் பதிவு', note: 'உடனடி குறை பதிவு' },
            { to: '/அடிக்கடி-கேள்விகள்', title: 'கேள்விகள்', note: 'பொது உதவி விளக்கம்' },
            { to: '/அறிவு-மையம்', title: 'அறிவு மையம்', note: 'சரியான பதிவு வழிகாட்டி' },
          ],
        })}
      </div>
    );
  }

  if (page.kind === 'citizenDashboard') {
    return (
      <>
        {அட்டைவரிசை(citizenDashboard.cards)}
        <div className="இரண்டு_நெடுவரிசை">
          <ChartPanel title="உங்கள் நிலை பகிர்வு" data={citizenDashboard.statusChart} />
          <ChartPanel title="உங்கள் குறை வகைகள்" data={citizenDashboard.categoryChart} type="pie" />
        </div>
        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: 'விரைவு செயல்கள்',
            description: 'ஒரே தொடுதலில் பொதுவாக பயன்படும் சேவைகளைத் திறக்கலாம்.',
            links: [
              { to: '/குரல்-குறை-பதிவு', title: 'குரல் குறை பதிவு', note: 'தமிழில் பேசுங்கள்' },
              { to: '/நிலை-கண்காணிப்பு', title: 'நிலை கண்காணிப்பு', note: 'குறை முன்னேற்றம் பாருங்கள்' },
              { to: '/அறிவிப்புகள்', title: 'அறிவிப்புகள்', note: 'சமீபத்திய தகவல்கள்' },
            ],
          })}
          {சுருக்கஅட்டை({
            title: 'சேவை பிரிவுகள்',
            description: 'தனித்தனி திரைகள் இல்லாமல், குரல் பதிவு பகுதியிலேயே வகை தானாக கண்டறியப்படும்.',
            links: state.categories
              .slice(0, 3)
              .map((item) => ({ to: '/குரல்-குறை-பதிவு', title: item.nameTa, note: `${item.departmentNameTa} துறைக்கு AI ஒதுக்கும்` })),
          })}
        </div>
        <ComplaintTable complaints={state.complaints.filter((item) => item.mobileNumber === state.profile.கைபேசி)} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'adminDashboard') {
    return (
      <>
        {அட்டைவரிசை(adminDashboard.cards)}
        <div className="இரண்டு_நெடுவரிசை">
          <ChartPanel title="நிலை வாரியான மொத்த ஓட்டம்" data={adminDashboard.statusChart} />
          <ChartPanel title="வகை வாரியான அழுத்தம்" data={adminDashboard.categoryChart} type="pie" />
        </div>
        <ComplaintTable complaints={adminDashboard.recentComplaints} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'voiceComplaint' || page.kind === 'textComplaint') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <ComplaintComposer
          mode={page.kind === 'voiceComplaint' ? 'voice' : 'text'}
          profile={state.profile}
          draft={state.draft}
          analysis={draftAnalysis}
          analysisLoading={state.analysisLoading}
          onDraftChange={actions.updateDraft}
          onPreview={() => navigate('/குறை-ஆய்வு')}
          onSubmit={actions.submitComplaint}
        />
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>தானியங்கி ஆய்வு</h3>
            <p>உங்கள் உரையில் இருந்து Sarvam + விதிமுறைகள் மூலம் கண்டறியப்படும் முன்னோட்டம்</p>
          </div>
          {state.analysisLoading && <p className="analysis-status">ஆய்வு நடைபெறுகிறது...</p>}
          <div className="தகவல்பட்டி">
            <div><span>கண்டறியப்பட்ட வகை</span><strong>{draftAnalysis ? draftAnalysis.categoryLabelTa : 'பேசிய/எழுதிய பின் காட்டப்படும்'}</strong></div>
            <div><span>ஒதுக்கப்படும் துறை</span><strong>{draftAnalysis ? draftAnalysis.departmentLabelTa : 'பேசிய/எழுதிய பின் காட்டப்படும்'}</strong></div>
            <div><span>முன்னுரிமை (தீவிரம்)</span><strong>{draftAnalysis ? முன்னுரிமைப்பெயர்(draftAnalysis.priority) : '-'}</strong></div>
            <div><span>நம்பகத்தன்மை</span><strong>{draftAnalysis ? `${Math.round(draftAnalysis.confidenceScore * 100)}%` : '-'}</strong></div>
          </div>
          {draftAnalysis?.analysisSource && (
            <p className="analysis-source">மூலம்: {draftAnalysis.analysisSource}</p>
          )}
        </section>
      </div>
    );
  }

  if (page.kind === 'attachments') {
    return (
      <div className="attachment-grid">
        <section className="attachment-panel">
          <div className="attachment-head">
            <h3>{'ஆதார இணைப்புகள்'}</h3>
            <p>{'புகைப்படம், வீடியோ, கோப்பு அல்லது மேகஇணைப்பு இங்கு சேர்க்கலாம்.'}</p>
          </div>
          <label className="attachment-field">
            <span>{'ஆதார இணைப்பு'}</span>
            <input
              value={state.draft.evidenceUrl || ''}
              onChange={(event) => actions.updateDraft({ evidenceUrl: event.target.value })}
              placeholder={'https:// அல்லது கோப்பு இணைப்பு'}
            />
          </label>
          <article className="attachment-preview">
            <p>{state.draft.evidenceUrl || 'இப்போது வரை ஆதார இணைப்பு சேர்க்கப்படவில்லை.'}</p>
          </article>
          <div className="attachment-actions">
            <button type="button" className="attachment-button attachment-button-secondary" onClick={() => navigate('/\u0b95\u0bc1\u0bb1\u0bc8-\u0b86\u0baf\u0bcd\u0bb5\u0bc1')}>
              {'முன்னோட்டம் பார்க்க'}
            </button>
            <button type="button" className="attachment-button attachment-button-primary" onClick={actions.submitComplaint}>
              {'ஆதாரத்துடன் அனுப்பு'}
            </button>
          </div>
        </section>
        <section className="attachment-panel">
          <div className="attachment-head">
            <h3>{'உதவிக் குறிப்பு'}</h3>
            <p>{'ஆதாரம் இருந்தால் துறையின் நடவடிக்கை வேகமாகும்.'}</p>
          </div>
          <div className="attachment-tips">
            <div>{'படத்தில் இடம் தெளிவாக தெரிய வேண்டும்.'}</div>
            <div>{'பகல் நேரம் எடுத்த படம் துல்லியமாக உதவும்.'}</div>
            <div>{'ஒரு வாக்கியத்தில் பிரச்சினை என்ன என்று கூறுங்கள்.'}</div>
          </div>
        </section>
      </div>
    );
  }

  if (page.kind === 'review') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>அனுப்பும் முன் சரிபார்க்கவும்</h3>
            <p>குறை விவரங்கள், துறை, இடம், தொடர்பு ஆகியவை சரியாக உள்ளதா பார்க்கவும்.</p>
          </div>
          <div className="தகவல்பட்டி">
            <div><span>பெயர்</span><strong>{state.draft.citizenName || state.profile.பெயர்}</strong></div>
            <div><span>கைபேசி</span><strong>{state.draft.mobileNumber || state.profile.கைபேசி}</strong></div>
            <div><span>தலைப்பு</span><strong>{state.draft.subject || 'புதிய குறை பதிவு'}</strong></div>
            <div><span>வகை</span><strong>{draftAnalysis ? draftAnalysis.categoryLabelTa : 'இன்னும் வகைப்படுத்தப்படவில்லை'}</strong></div>
            <div><span>துறை</span><strong>{draftAnalysis ? draftAnalysis.departmentLabelTa : 'இன்னும் ஒதுக்கப்படவில்லை'}</strong></div>
            <div><span>இடம்</span><strong>{state.draft.locationArea || 'குறிப்பிடப்படவில்லை'}</strong></div>
          </div>
          <article className="மென்மைஅட்டை">
            <p>{state.draft.description || state.draft.transcript || 'இன்னும் விவரம் இல்லை'}</p>
          </article>
          <div className="செயற்பொத்தான்கள்">
            <button type="button" className="இரண்டாம்" onClick={() => navigate('/குரல்-குறை-பதிவு')}>திருத்து</button>
            <button type="button" className="முதல்" onClick={actions.submitComplaint}>இப்போது அனுப்பு</button>
          </div>
        </section>
        <TimelinePanel
          timeline={[
            { id: 1, titleTa: 'குரல் அல்லது உரை பெறப்பட்டது', noteTa: 'உங்கள் உள்ளீடு பதிவு செய்யப்பட்டுள்ளது', actorNameTa: 'முறைமை', status: 'REGISTERED', createdAt: new Date().toISOString() },
            { id: 2, titleTa: 'வகை கண்டறிதல்', noteTa: `${draftAnalysis ? draftAnalysis.categoryLabelTa : 'பொது குறை'} என முறைமை கண்டறிந்துள்ளது`, actorNameTa: 'முறைமை', status: 'ROUTED', createdAt: new Date().toISOString() },
          ]}
        />
      </div>
    );
  }

  if (page.kind === 'success') {
    return (
      <section className="அட்டை வெற்றிப்பக்கம்">
        <div className="அட்டை_மேல்">
          <h3>குறை வெற்றிகரமாக பதிவு செய்யப்பட்டது</h3>
          <p>அடுத்த நிலைகளை இந்த எண்ணை கொண்டு கண்காணிக்கலாம்.</p>
        </div>
        {state.latestComplaint ? (
          <div className="தகவல்பட்டி">
            <div><span>குறை எண்</span><strong>{state.latestComplaint.referenceNumber}</strong></div>
            <div><span>வகை</span><strong>{state.latestComplaint.categoryLabelTa}</strong></div>
            <div><span>துறை</span><strong>{state.latestComplaint.departmentLabelTa}</strong></div>
            <div><span>நிலை</span><strong>{நிலைப்பெயர்(state.latestComplaint.status)}</strong></div>
          </div>
        ) : <p>சமீபத்திய பதிவு இங்கு காட்டப்படும்.</p>}
        <div className="செயற்பொத்தான்கள்">
          <button type="button" className="முதல்" onClick={() => navigate('/நிலை-கண்காணிப்பு')}>நிலை பார்க்க</button>
          <button type="button" className="இரண்டாம்" onClick={() => navigate('/என்-குறைகள்')}>என் குறைகள்</button>
        </div>
      </section>
    );
  }

  if (page.kind === 'complaintList') {
    const personal = state.complaints.filter((item) => item.mobileNumber === state.profile.கைபேசி);
    return <ComplaintTable complaints={personal} onSelect={actions.setSelectedComplaintId} />;
  }

  if (page.kind === 'complaintDetail') {
    return selectedComplaint ? (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>{selectedComplaint.subjectTa}</h3>
            <p>{selectedComplaint.referenceNumber}</p>
          </div>
          <div className="தகவல்பட்டி">
            <div><span>வகை</span><strong>{selectedComplaint.categoryLabelTa}</strong></div>
            <div><span>துறை</span><strong>{selectedComplaint.departmentLabelTa}</strong></div>
            <div><span>நிலை</span><strong>{நிலைப்பெயர்(selectedComplaint.status)}</strong></div>
            <div><span>முன்னுரிமை</span><strong>{முன்னுரிமைப்பெயர்(selectedComplaint.priority)}</strong></div>
            <div><span>பதிவு நேரம்</span><strong>{நாள்(selectedComplaint.createdAt)}</strong></div>
            <div><span>இடம்</span><strong>{selectedComplaint.locationArea}</strong></div>
          </div>
          <article className="மென்மைஅட்டை">
            <p>{selectedComplaint.descriptionTa}</p>
          </article>
          {state.isAdmin && (
            <div className="செயற்பொத்தான்கள்">
              <button type="button" className="இரண்டாம்" onClick={() => actions.updateStatus(selectedComplaint.id, 'IN_PROGRESS', 'குழு பணியில் ஈடுபடுத்தப்பட்டது')}>செயலில் மாற்று</button>
              <button type="button" className="முதல்" onClick={() => actions.updateStatus(selectedComplaint.id, 'RESOLVED', 'சேவை நிறைவு செய்யப்பட்டது')}>தீர்வு பதிவு செய்</button>
            </div>
          )}
        </section>
        <TimelinePanel timeline={selectedComplaint.timeline} />
      </div>
    ) : (
      <section className="அட்டை"><p>குறை தேர்வு செய்யப்படவில்லை.</p></section>
    );
  }

  if (page.kind === 'complaintTimeline') {
    return selectedComplaint ? <TimelinePanel timeline={selectedComplaint.timeline} /> : <section className="அட்டை"><p>குறை தகவல் இல்லை.</p></section>;
  }

  if (page.kind === 'tracker') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>குறை நிலை கண்காணிப்பு</h3>
            <p>சமீபத்திய பதிவு தானாக கீழே காட்டப்படுகிறது. வேறு பதிவை பட்டியலில் தேர்வு செய்யலாம்.</p>
          </div>
          {selectedComplaint && (
            <div className="தகவல்பட்டி">
              <div><span>குறை எண்</span><strong>{selectedComplaint.referenceNumber}</strong></div>
              <div><span>தற்போதைய நிலை</span><strong>{நிலைப்பெயர்(selectedComplaint.status)}</strong></div>
              <div><span>துறை</span><strong>{selectedComplaint.departmentLabelTa}</strong></div>
              <div><span>கடைசி புதுப்பிப்பு</span><strong>{நாள்(selectedComplaint.updatedAt)}</strong></div>
            </div>
          )}
        </section>
        <ComplaintTable complaints={state.complaints.filter((item) => item.mobileNumber === state.profile.கைபேசி)} onSelect={actions.setSelectedComplaintId} />
      </div>
    );
  }

  if (page.kind === 'notifications') {
    return (
      <div className="மூன்று_நெடுவரிசை">
        {state.notifications.length > 0 ? state.notifications.map((item) => (
          <article key={item.id} className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>{item.titleTa}</h3>
              <p>{item.referenceNumber}</p>
            </div>
            <p>{item.messageTa}</p>
            <span>{நாள்(item.createdAt)}</span>
          </article>
        )) : (
          <article className="அட்டை காலி_அட்டை">
            <h3>அறிவிப்புகள் இல்லை</h3>
            <p>நீங்கள் குறை பதிவு செய்த பிறகு நிலை மாற்ற தகவல்கள் இங்கே வரும்.</p>
          </article>
        )}
      </div>
    );
  }

  if (page.kind === 'profile') {
    return (
      <section className="அட்டை">
        <div className="அட்டை_மேல்">
          <h3>என் விவரங்கள்</h3>
          <p>இந்த தகவல்கள் புதிய குறை பதிவுகளில் முன்பூர்த்தி செய்யப்படும்.</p>
        </div>
        <div className="புலங்கள்">
          <label><span>பெயர்</span><input value={state.profile.பெயர்} onChange={(event) => actions.updateProfile({ பெயர்: event.target.value })} /></label>
          <label><span>கைபேசி</span><input value={state.profile.கைபேசி} onChange={(event) => actions.updateProfile({ கைபேசி: event.target.value })} /></label>
          <label><span>ஊர்</span><input value={state.profile.ஊர்} onChange={(event) => actions.updateProfile({ ஊர்: event.target.value })} /></label>
          <label><span>மாவட்டம்</span><input value={state.profile.மாவட்டம்} onChange={(event) => actions.updateProfile({ மாவட்டம்: event.target.value })} /></label>
        </div>
      </section>
    );
  }

  if (page.kind === 'faq') {
    const rawFaqs = state.faqs && state.faqs.length > 0 ? state.faqs : [];
    const validFaqs = rawFaqs.filter((item) => item.questionTa && !/^\d+$/.test(String(item.questionTa).trim()));
    const displayFaqs = validFaqs.length > 0 ? validFaqs : [
      { id: 101, questionTa: 'குடிமக்கள் குரல் மூலம் குறை பதிவு செய்வது எவ்வாறு?', answerTa: 'குரல் குறை பதிவு பொத்தானை அழுத்தி, உங்கள் தெரு பெயர், பிரச்சினை மற்றும் கால அளவை தமிழில் தெளிவாக பேசினால் AI தானாக உரைமாற்றம் செய்யும்.' },
      { id: 102, questionTa: 'என் புகாருக்கு எத்தனை மணி நேரத்திற்குள் தீர்வு கிடைக்கும்?', answerTa: 'அவசர மின்சார குறைகளுக்கு 6-12 மணி நேரத்திற்குள்ளும், குடிநீர் குறைகளுக்கு 24 மணி நேரத்திற்குள்ளும், சாலை பணிகளுக்கு 48 மணி நேரத்திற்குள்ளும் தீர்வு நடவடிக்கை எடுக்கப்படும்.' },
      { id: 103, questionTa: 'புகார் எண்ணை வைத்து நிலை எவ்வாறு கண்காணிப்பது?', answerTa: 'நிலை கண்காணிப்பு பக்கத்தில் GV... என்ற புகார் எண் அல்லது உங்கள் கைபேசி எண்ணை தட்டச்சு செய்து நேரடி தற்போதைய நிலையை அறியலாம்.' },
      { id: 104, questionTa: 'சென்னை மாநகராட்சி அவசர உதவி எண் என்ன?', answerTa: 'சென்னை மாநகராட்சி தொடர்பான குடிநீர், சாலை, தெருவிளக்கு மற்றும் கழிவுநீர் குறைகளுக்கு 1913 என்ற கட்டணமில்லா உதவி எண்ணை அழைக்கலாம்.' },
      { id: 105, questionTa: 'ஒரே புகாரில் படங்கள் மற்றும் சான்றுகள் இணைக்க முடியுமா?', answerTa: 'ஆம். குறை ஆய்வின் போது புகைப்படங்கள் மற்றும் வரைபடங்கள் இணைக்க வசதி உள்ளது.' },
      { id: 106, questionTa: 'அரசுத் துறை தானியங்கி ஒதுக்கீடு எவ்வாறு செயல்படுகிறது?', answerTa: 'இயற்கை மொழியியல் AI தொழில்நுட்பம் சொற்களை பகுப்பாய்வு செய்து குடிநீர், மின்சார அல்லது நகராட்சி துறைக்கு தானாக ஒதுக்குகிறது.' },
    ];

    return (
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', padding: '1.5rem', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700' }}>அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)</h2>
          <p style={{ margin: '0.4rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>பொதுவாக கேட்கப்படும் வினாக்களுக்கான தெளிவான பதில்கள் மற்றும் வழிகாட்டுதல்கள்</p>
        </div>
        <div className="மூன்று_நெடுவரிசை">
          {displayFaqs.map((item) => (
            <article key={item.id || item.questionTa} className="அட்டை" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="அட்டை_மேல்">
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>{item.questionTa}</h3>
              </div>
              <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '0.5rem' }}>{item.answerTa}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (page.kind === 'articles') {
    const rawArticles = state.articles && state.articles.length > 0 ? state.articles : [];
    const validArticles = rawArticles.filter((item) => item.titleTa && !/^\d+$/.test(String(item.titleTa).trim()));
    const displayArticles = validArticles.length > 0 ? validArticles : [
      {
        id: 201,
        titleTa: 'சென்னை மாநகராட்சி ஆன்லைன் குறைதீர் வழிகாட்டி 2026',
        audienceTa: 'அனைவருக்கும்',
        summaryTa: 'மழைநீர் வடிகால், தெருவிளக்கு பராமரிப்பு மற்றும் குப்பை அகற்றும் பணிகளுக்கு குரல் பதிவு மூலம் விரைவுத் தீர்வு பெறும் வழிகாட்டி.',
        contentTa: 'தெரு பெயர், மண்டலம் (Zone), அருகிலுள்ள அடையாளம் மற்றும் பாதிப்பு எவ்வளவு பேருக்கு உள்ளது என்பதை தெளிவாக குரலில் கூறினால் AI தானாக சென்னை மண்டல அலுவலகத்திற்கு ஒதுக்கும்.',
      },
      {
        id: 202,
        titleTa: 'குரல் பதிவின் போது கவனிக்க வேண்டிய முக்கிய குறிப்புகள்',
        audienceTa: 'குடிமக்கள்',
        summaryTa: 'சத்தம் குறைந்த இடத்தில் நின்று, மெதுவாகவும் தெளிவாகவும் பேசினால் உரைமாற்ற துல்லியம் 98% அதிகரிக்கும்.',
        contentTa: 'ஒரே புகாரில் ஒரே பிரச்சினையை சொல்லுங்கள். இடம், காலம், பாதிப்பு ஆகியவற்றை பிரித்து பேசினால் துறை அதிகாரி உடனடி நடவடிக்கை எடுப்பார்.',
      },
      {
        id: 203,
        titleTa: 'தானியங்கி AI துறை ஒதுக்கீடு மற்றும் முன்னுரிமை கணக்கீடு',
        audienceTa: 'அலுவலர்கள்',
        summaryTa: 'இயற்கை மொழியியல் பகுப்பாய்வு மூலம் குடிநீர், மின்சாரம், சாலை மற்றும் நகராட்சி குறைகள் வகைப்படுத்தப்படும் முறை.',
        contentTa: 'அவசர மின்சார விபத்துகள் CRITICAL முன்னுரிமையுடனும், குடிநீர் விநியோக பிரச்சினைகள் HIGH முன்னுரிமையுடனும் தானாக வகைப்படுத்தப்படும்.',
      },
    ];

    return (
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', padding: '1.5rem', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700' }}>அறிவு மையம் & வழிகாட்டி கட்டுரைகள்</h2>
          <p style={{ margin: '0.4rem 0 0 0', color: '#c7d2fe', fontSize: '0.9rem' }}>குறை பதிவு தரம் உயர்த்தும் தமிழ் வழிகாட்டி கட்டுரைகள் மற்றும் உதவி குறிப்புகள்</p>
        </div>
        <div className="மூன்று_நெடுவரிசை">
          {displayArticles.map((item) => (
            <article key={item.id || item.titleTa} className="அட்டை">
              <div className="அட்டை_மேல்">
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>{item.titleTa}</h3>
                <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>{item.audienceTa || 'பொது'}</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: '0.5rem 0' }}>{item.summaryTa}</p>
              <article className="மென்மைஅட்டை" style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
                <p style={{ color: '#334155', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>{item.contentTa}</p>
              </article>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (page.kind === 'directory') {
    const isChennaiUser = true; // User Profile is Chennai (சந்தோஷ் - அண்ணா நகர், சென்னை)
    const chennaiOffices = [
      {
        code: 'GCC',
        nameTa: 'பெருநகர சென்னை மாநகராட்சி (Greater Chennai Corporation)',
        district: 'சென்னை (Chennai)',
        addressTa: 'ரிப்பன் மாளிகை, பூங்கா நகர், சென்னை - 600003',
        descriptionTa: 'மழைநீர் வடிகால், தெருவிளக்கு பராமரிப்பு, சாலை குழி சீரமைப்பு, குப்பை அகற்றம் மற்றும் பூங்காக்கள்.',
        contactNumber: '1913 (மாநகராட்சி ஹெல்ப்லைன்)',
        altContact: '044-25619200',
        slaHours: 24,
      },
      {
        code: 'CMWSSB',
        nameTa: 'சென்னை குடிநீர் மற்றும் கழிவுநீர் அகற்று வாரியம் (Metro Water)',
        district: 'சென்னை (Chennai)',
        addressTa: 'எண் 1, பம்பிங் ஸ்டேஷன் சாலை, சிந்தாதிரிப்பேட்டை, சென்னை - 600002',
        descriptionTa: 'குடிநீர் விநியோகம், குழாய் அடைப்பு சீரமைப்பு, லாரி குடிநீர் பதிவு மற்றும் கழிவுநீர் சுத்திகரிப்பு.',
        contactNumber: '1916 (குடிநீர் உதவி எண்)',
        altContact: '044-45674567',
        slaHours: 12,
      },
      {
        code: 'TANGEDCO',
        nameTa: 'தமிழ்நாடு மின்சார வாரியம் - மின்னகம் (Chennai TANGEDCO)',
        district: 'சென்னை (Chennai)',
        addressTa: 'மின்வாரிய தலைமையகம், 144 அண்ணா சாலை, சென்னை - 600002',
        descriptionTa: 'மின் துண்டிப்பு, அபாயகரமான மின் கம்பம் சீரமைப்பு, புதிய மின் இணைப்பு மற்றும் மின்மீட்டர் கோளாறுகள்.',
        contactNumber: '1912 (24x7 மின்னகம்)',
        altContact: '044-28520131',
        slaHours: 6,
      },
      {
        code: 'HIGHWAYS',
        nameTa: 'சென்னை மண்டல நெடுஞ்சாலைத்துறை (Highways Dept)',
        district: 'சென்னை (Chennai)',
        addressTa: '76 சர்தார் பட்டேல் சாலை, கிண்டி, சென்னை - 600032',
        descriptionTa: 'மாநில நெடுஞ்சாலைகள் சீரமைப்பு, மேம்பால பராமரிப்பு, பேருந்து நிழற்குடைகள் மற்றும் போக்குவரத்து குறைகள்.',
        contactNumber: '044-22340000',
        altContact: '1800-425-7788',
        slaHours: 48,
      },
      {
        code: 'CIVIL_SUPPLIES',
        nameTa: 'உணவுப் பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத் துறை',
        district: 'சென்னை (Chennai)',
        addressTa: 'எழுத்தாட்சியர் வளாகம், சேப்பாக்கம், சென்னை - 600005',
        descriptionTa: 'ஸ்மார்ட் ரேஷன் அட்டை சேவைகள், ரேஷன் பொருள் விநியோகக் குறைகள் மற்றும் நியாயவிலைக் கடைகள்.',
        contactNumber: '1967 (ரேஷன் உதவி எண்)',
        altContact: '1800-425-5901',
        slaHours: 24,
      },
      {
        code: 'CSC',
        nameTa: 'சென்னை மாவட்ட பொது சேவை மையம் (e-Sevai CSC)',
        district: 'சென்னை (Chennai)',
        addressTa: 'சிங்காரவேலன் மாளிகை, ராஜாஜி சாலை, சென்னை - 600001',
        descriptionTa: 'சாதி, வருமானம், இருப்பிடச் சான்றிதழ்கள், பிறப்பு இறப்பு சான்றிதழ்கள் மற்றும் அரசு திட்டப் பதிவுகள்.',
        contactNumber: '1800-425-1333',
        altContact: '044-25268323',
        slaHours: 36,
      },
    ];

    return (
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: '#fff', padding: '1.5rem', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700' }}>அலுவலகம் கண்டுபிடி - சென்னை மண்டலம்</h2>
              <p style={{ margin: '0.4rem 0 0 0', color: '#a7f3d0', fontSize: '0.9rem' }}>சென்னை மாநகராட்சி & அரசுத் துறை அலுவலக முகவரிகள் மற்றும் அவசர தொடர்பு எண்கள்</p>
            </div>
            <span style={{ background: '#064e3b', color: '#34d399', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem' }}>
              📍 சென்னை (Chennai)
            </span>
          </div>
        </div>

        <div className="மூன்று_நெடுவரிசை">
          {chennaiOffices.map((item) => (
            <article key={item.code} className="அட்டை" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div className="அட்டை_மேல்" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '700', lineHeight: '1.3' }}>{item.nameTa}</h3>
                <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>{item.district}</span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                🏢 <strong>முகவரி:</strong> {item.addressTa}
              </p>

              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.5', marginBottom: '1rem' }}>{item.descriptionTa}</p>

              <div className="தகவல்பட்டி" style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748b' }}>அவசர தொடர்பு:</span>
                  <strong style={{ color: '#2563eb' }}>📞 {item.contactNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>தீர்வு நேர வரம்பு:</span>
                  <strong style={{ color: '#059669' }}>⏱️ {item.slaHours} மணி நேரம்</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (page.kind === 'feedback' || page.kind === 'rating') {
    return (
      <section className="அட்டை">
        <div className="அட்டை_மேல்">
          <h3>{page.title}</h3>
          <p>{page.summary}</p>
        </div>
        <label>
          <span>உங்கள் கருத்து</span>
          <textarea rows={8} value={state.feedback} onChange={(event) => actions.setFeedback(event.target.value)} placeholder="சேவை எப்படியிருந்தது, மேலும் என்ன சேர்க்க வேண்டும் என்பதை எழுதுங்கள்" />
        </label>
        <div className="செயற்பொத்தான்கள்">
          <button type="button" className="முதல்" onClick={() => actions.setFeedback('')}>பதிவு செய்யப்பட்டது</button>
        </div>
      </section>
    );
  }

  if (page.kind === 'adminSection') {
    const userScopeComplaints = filterComplaintsForUser(state.complaints, state.user);
    const சம்பந்தப்பட்டகுறைகள் = userScopeComplaints.filter((item) => {
      if (page.title === 'அவசர குறைகள்') return ['HIGH', 'CRITICAL'].includes(item.priority);
      if (page.title === 'ஒதுக்கப்படாதவை') return item.status === 'REGISTERED';
      if (page.title === 'துறை வாரி நிலை') return true;
      return true;
    });

    return (
      <>
        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: page.title,
            description: page.summary,
            links: [
              { to: '/குறை-விவரம்', title: 'தேர்ந்த குறை விவரம்', note: 'குறை வாழ்க்கைச் சுழற்சி பார்க்க' },
              { to: '/குறை-காலவரிசை', title: 'காலவரிசை', note: 'நடவடிக்கை தடம் பார்க்க' },
              { to: '/நிர்வாக-முகப்பு', title: 'மொத்த பலகை', note: 'அனைத்து எண்களுக்கும் திரும்பு' },
            ],
          })}
          <ChartPanel title="தற்போதைய ஓட்டம்" data={adminDashboard.statusChart} />
        </div>
        <ComplaintTable complaints={சம்பந்தப்பட்டகுறைகள்} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'content') {
    const rawAnnouncements = state.announcements && state.announcements.length > 0 ? state.announcements : [];
    const validAnnouncements = rawAnnouncements.filter((item) => item.titleTa && !/^\d+$/.test(String(item.titleTa).trim()));
    const displayAnnouncements = validAnnouncements.length > 0 ? validAnnouncements : [
      { id: 301, titleTa: 'சென்னை அண்ணா நகர் பகுதி குடிநீர் பராமரிப்பு பணி', areaNameTa: 'அண்ணா நகர், சென்னை', contentTa: 'நாளை காலை 8 மணி முதல் மாலை 4 மணி வரை குடிநீர் குழாய் சீரமைப்பு பணி காரணமாக விநியோகம் நிறுத்தப்படும்.' },
      { id: 302, titleTa: 'மழைக்கால முன்னெச்சரிக்கை & மழைநீர் வடிகால் தூய்மை பணி', areaNameTa: 'சென்னை மாநகராட்சி', contentTa: 'அனைத்து 15 மண்டலங்களிலும் மழைநீர் வடிகால் தூய்மை பணிகள் தீவிரமாக நடைபெற்று வருகின்றன. பொதுமக்கள் 1913-ல் தொடர்புகொள்ளலாம்.' },
      { id: 303, titleTa: 'மின்னகம் 24x7 மின்சார குறைதீர் மையம்', areaNameTa: 'தமிழ்நாடு மின்சார வாரியம்', contentTa: 'மின் துண்டிப்பு மற்றும் அபாயகரமான கம்பங்கள் தொடர்பாக 1912 என்ற எண்ணில் 24 மணி நேரமும் தொடர்பு கொள்ளலாம்.' },
    ];

    return (
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: '#fff', padding: '1.5rem', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700' }}>உதவி மையம் & 24x7 அவசர தொடர்புகள்</h2>
          <p style={{ margin: '0.4rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>சென்னை மற்றும் தமிழ்நாடு அரசுத் துறை அவசர உதவி எண்கள் மற்றும் சமீபத்திய அறிவிப்புகள்</p>
        </div>

        {/* Emergency Helplines Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '600' }}>🏛️ சென்னை மாநகராட்சி</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1d4ed8', marginTop: '4px' }}>📞 1913</div>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '2px' }}>24x7 கட்டணமில்லா எண்</div>
          </div>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600' }}>💧 சென்னை குடிநீர் வாரியம்</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#047857', marginTop: '4px' }}>📞 1916</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>044-45674567</div>
          </div>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: '600' }}>⚡ மின்சார வாரியம் (மின்னகம்)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>📞 1912</div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '2px' }}>24x7 மின் குறை மையம்</div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: '600' }}>🚑 அவசர ஆம்புலன்ஸ் / காவல்</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#b91c1c', marginTop: '4px' }}>📞 108 / 100</div>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>உடனடி அவசர சேவை</div>
          </div>
        </div>

        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: page.title,
            description: page.summary,
            links: [
              { to: '/அடிக்கடி-கேள்விகள்', title: 'அடிக்கடி கேள்விகள்', note: 'விரைவு பதில்கள்' },
              { to: '/அறிவு-மையம்', title: 'அறிவு மையம்', note: 'வழிகாட்டி கட்டுரைகள்' },
              { to: '/அலுவலகம்-கண்டுபிடி', title: 'அலுவலகம் கண்டுபிடி', note: 'சென்னை துறை தொடர்புகள்' },
            ],
          })}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>📢 சமீபத்திய பகுதி அறிவிப்புகள்</h3>
            {displayAnnouncements.map((item) => (
              <article key={item.id} className="அட்டை" style={{ background: '#fff', borderLeft: '4px solid #3b82f6', borderRadius: '10px', padding: '1rem' }}>
                <div className="அட்டை_மேல்" style={{ marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{item.titleTa}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>📍 {item.areaNameTa}</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>{item.contentTa}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page.kind === 'module') {
    const தொடர்புடையகுறைகள் = state.complaints.filter((item) => item.categoryLabelTa.includes(page.title) || item.departmentLabelTa.includes(page.title) || page.summary.includes(item.categoryLabelTa.split(' ')[0]));
    const தரவு = டாஷ்போர்டு_உருவாக்கு(page.title, page.summary, தொடர்புடையகுறைகள்.length ? தொடர்புடையகுறைகள் : state.complaints.slice(0, 2));

    return (
      <>
        {அட்டைவரிசை(தரவு.cards)}
        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: page.title,
            description: page.summary,
            links: [
              { to: '/குரல்-குறை-பதிவு', title: 'குரல் பதிவு', note: 'இந்த பிரிவுக்கான புதிய குறை' },
              { to: '/குறை-ஆய்வு', title: 'முன்னோட்டம்', note: 'தானியங்கி வகைப்பாடு சரிபார்' },
              { to: '/நிலை-கண்காணிப்பு', title: 'நிலை கண்காணிப்பு', note: 'ஏற்கெனவே பதிவு செய்த குறைகளைப் பார்' },
            ],
          })}
          <div className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>தொடர்புடைய துறைகள்</h3>
              <p>உடனடி சேவை அணுகல்கள்</p>
            </div>
            <div className="தகவல்பட்டி">
              {துறைகள்.slice(0, 3).map((item) => (
                <div key={item.code}>
                  <span>{item.nameTa}</span>
                  <strong>{item.contactNumber}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ComplaintTable complaints={தொடர்புடையகுறைகள்.length ? தொடர்புடையகுறைகள் : state.complaints.slice(0, 3)} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'issueMap') {
    const userScopeComplaints = filterComplaintsForUser(state.complaints, state.user);
    return (
      <IssueMapPanel
        complaints={userScopeComplaints}
        onSelectComplaint={(id) => {
          actions.setSelectedComplaintId(id);
        }}
      />
    );
  }

  if (page.kind === 'deptMap') {
    const userScopeComplaints = filterComplaintsForUser(state.complaints, state.user);
    return (
      <DepartmentMapPanel
        complaints={userScopeComplaints}
        userDepartmentCode={state.user?.departmentCode || ''}
        userDepartmentName={state.user?.departmentLabel || ''}
        isAdmin={state.user?.role === 'ADMIN'}
        onUpdateStatus={actions.updateStatus}
      />
    );
  }

  if (page.kind === 'schemes') {
    return (
      <WelfareSchemeWizard
        profile={state.profile}
        onUploadClick={() => actions.setUploadSchemeModalOpen?.(true)}
        isAdmin={state.user?.role === 'ADMIN' || state.user?.role === 'OFFICER'}
      />
    );
  }

  if (page.kind === 'publicWorks') {
    return (
      <PublicWorksPanel
        announcements={state.announcements}
        onUploadClick={() => actions.setUploadWorkModalOpen?.(true)}
        isAdmin={state.user?.role === 'ADMIN' || state.user?.role === 'OFFICER'}
      />
    );
  }

  return (
    <section className="அட்டை">
      <div className="அட்டை_மேல்">
        <h3>{page.title}</h3>
        <p>{page.summary}</p>
      </div>
      <p>இந்த பகுதி பயன்படுத்தத் தயாராக உள்ளது.</p>
    </section>
  );
}
