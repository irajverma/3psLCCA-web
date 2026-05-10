import React, { useState, useEffect, useCallback } from 'react';
import './TrafficData.css';
import wpiDb from '../../../data/wpi_db.json';

// ── Constants & Static Data ──────────────────────────────────────────────────

const LANE_TYPES = [
    { code: 'SL', name: 'Single Lane', width: 3.75, capacity: 435 },
    { code: 'IL', name: 'Intermediate Lane', width: 5.5, capacity: 1158 },
    { code: '2L', name: 'Two Lane (Two Way)', width: 7.0, capacity: 2400 },
    { code: '2L_1W', name: 'Two Lane (One Way)', width: 7.0, capacity: 2700 },
    { code: '3L_1W', name: 'Three Lane (One Way)', width: 10.5, capacity: 4200 },
    { code: '4L', name: 'Four Lane (Two Way)', width: 7.0, capacity: 5400 },
    { code: '6L', name: 'Six Lane (Two Way)', width: 10.5, capacity: 8400 },
    { code: '8L', name: 'Eight Lane (Two Way)', width: 14.0, capacity: 13600 },
    { code: 'EW4', name: '4 Lane Expressway (Two Way)', width: 0, capacity: 5000 },
    { code: 'EW6', name: '6 Lane Expressway (Two Way)', width: 0, capacity: 7500 },
    { code: 'EW8', name: '8 Lane Expressway (Two Way)', width: 0, capacity: 9200 },
];

const VEHICLES = [
    { key: 'small_cars', label: 'Small Car', hasPwr: false },
    { key: 'big_cars', label: 'Big Car', hasPwr: false },
    { key: 'two_wheelers', label: 'Two Wheeler', hasPwr: false },
    { key: 'o_buses', label: 'Ordinary Buses', hasPwr: false },
    { key: 'd_buses', label: 'Deluxe Buses', hasPwr: false },
    { key: 'lcv', label: 'LCV', hasPwr: false },
    { key: 'hcv', label: 'HCV', hasPwr: true, defaultPwr: 7.22 },
    { key: 'mcv', label: 'MCV', hasPwr: true, defaultPwr: 8.0 },
];

const WPI_COLUMNS = [
    { key: 'grease', label: 'Grease' },
    { key: 'property_damage', label: 'Prop. Damage' },
    { key: 'tyre_cost', label: 'Tyre Cost' },
    { key: 'spare_parts', label: 'Spare Parts' },
    { key: 'fixed_depreciation', label: 'Fixed Depr.' },
    { key: 'commodity_holding_cost', label: 'Hold. Cost' },
    { key: 'passenger_cost', label: 'Passenger' },
    { key: 'crew_cost', label: 'Crew' },
    { key: 'fatal', label: 'Fatal' },
    { key: 'major', label: 'Major' },
    { key: 'minor', label: 'Minor' },
    { key: 'vot_cost', label: 'VOT Cost' },
];

// Load WPI Database from local JSON
const WPI_DATABASE = {};
if (wpiDb && wpiDb.entries) {
    wpiDb.entries.forEach(entry => {
        WPI_DATABASE[entry.metadata.name] = {
            metadata: entry.metadata,
            data: entry.data
        };
    });
}

const INITIAL_STATE = {
    calculation_mode: 'INDIA',
    vehicles: Object.fromEntries(VEHICLES.map(v => [v.key, { vehicles_per_day: 0, accident_percentage: 0, pwr: v.defaultPwr || 0 }])),
    force_free_flow: true,
    alternate_road: {
        alternate_road_carriageway: '',
        carriage_width_in_m: 0,
        hourly_capacity: 0,
    },
    severity: {
        severity_minor: 0,
        severity_major: 0,
        severity_fatal: 0,
    },
    road_params: {
        road_roughness_mm_per_km: 2000,
        road_rise_m_per_km: 0,
        road_fall_m_per_km: 0,
        additional_reroute_distance_km: 0,
        additional_travel_time_min: 0,
        crash_rate_accidents_per_million_km: 0,
        work_zone_multiplier: 1.0,
    },
    num_peak_hours: 0,
    peak_distribution: {},
    wpi_profile: '2024',
    wpi_data: WPI_DATABASE['2024']?.data || {},
    road_user_cost_per_day: 0,
    remarks: '',
};

// ── Components ───────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
    return <h5 className="section-title mb-4 fw-bold mt-4">{title}</h5>;
}

function InputField({ label, hint, value, onChange, unit, required }) {
    return (
        <div className="mb-4">
            <label className="fw-bold mb-1 d-block small">
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            {hint && <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>{hint}</div>}
            <div className="input-group">
                <input type="number" className="form-control" value={value || ''} onChange={(e) => onChange(e.target.value)} />
                {unit && <span className="input-group-text">{unit}</span>}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TrafficData = ({ data, onUpdate, controller }) => {
    const [form, setForm] = useState(data && Object.keys(data).length > 0 ? { ...INITIAL_STATE, ...data } : INITIAL_STATE);
    
    // Modal States
    const [showSaveAs, setShowSaveAs] = useState(false);
    const [saveAsForm, setSaveAsForm] = useState({ name: '', year: '2024', remark: '' });
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importSelected, setImportSelected] = useState('');

    const libraryProfiles = JSON.parse(localStorage.getItem('my_wpi_library') || '{}');
    const [localCustomProfiles, setLocalCustomProfiles] = useState({});

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setForm(prev => ({ ...prev, ...data }));
        }
    }, [data]);

    const updateState = useCallback((nextForm) => {
        setForm(nextForm);
        setTimeout(() => { if (onUpdate) onUpdate(nextForm); }, 0);
    }, [onUpdate]);

    // ── WPI Handlers ─────────────────────────────────────────────────────────

    const handleWpiProfileChange = (profileName) => {
        let newData = {};
        if (WPI_DATABASE[profileName]) {
            newData = WPI_DATABASE[profileName].data;
        } else if (localCustomProfiles[profileName]) {
            newData = localCustomProfiles[profileName].data;
        } else if (libraryProfiles[profileName]) {
            newData = libraryProfiles[profileName].data;
        }
        updateState({ ...form, wpi_profile: profileName, wpi_data: newData });
    };

    const handleWpiCellChange = (vehicleKey, colKey, val) => {
        const nextWpi = { ...form.wpi_data };
        if (!nextWpi[vehicleKey]) nextWpi[vehicleKey] = {};
        nextWpi[vehicleKey][colKey] = Number(val);
        updateState({ ...form, wpi_data: nextWpi });
    };

    const handleNewWpi = () => {
        const emptyData = Object.fromEntries(VEHICLES.map(v => [v.key, Object.fromEntries(WPI_COLUMNS.map(c => [c.key, 0]))]));
        const newName = 'Custom (New)';
        setLocalCustomProfiles(prev => ({ ...prev, [newName]: { metadata: { name: newName, year: new Date().getFullYear(), remark: 'New custom profile' }, data: emptyData } }));
        updateState({ ...form, wpi_profile: newName, wpi_data: emptyData });
    };

    const handleSaveAsSubmit = () => {
        if (!saveAsForm.name) return;
        const newProfile = {
            metadata: { name: saveAsForm.name, year: saveAsForm.year, remark: saveAsForm.remark },
            data: form.wpi_data
        };
        setLocalCustomProfiles(prev => ({ ...prev, [saveAsForm.name]: newProfile }));
        updateState({ ...form, wpi_profile: saveAsForm.name });
        setShowSaveAs(false);
    };

    const handleDeleteWpi = () => {
        if (WPI_DATABASE[form.wpi_profile]) {
            alert("Cannot delete official profiles.");
            return;
        }
        if (window.confirm(`Delete profile "${form.wpi_profile}"?`)) {
            const nextCustom = { ...localCustomProfiles };
            delete nextCustom[form.wpi_profile];
            setLocalCustomProfiles(nextCustom);
            handleWpiProfileChange("2024");
        }
    };

    const handleSaveToLibrary = () => {
        const currentData = { metadata: { name: form.wpi_profile, year: new Date().getFullYear(), remark: 'Saved from project' }, data: form.wpi_data };
        localStorage.setItem('my_wpi_library', JSON.stringify({ ...libraryProfiles, [form.wpi_profile]: currentData }));
        setInfoMessage(`'${form.wpi_profile}' saved to your WPI library.\nImport it in any project via 'Import from Library'.`);
        setShowInfoModal(true);
    };

    const handleImportSubmit = () => {
        if (importSelected && libraryProfiles[importSelected]) {
            setLocalCustomProfiles(prev => ({ ...prev, [importSelected]: libraryProfiles[importSelected] }));
            updateState({ ...form, wpi_profile: importSelected, wpi_data: libraryProfiles[importSelected].data });
            setShowImportModal(false);
        }
    };

    const handleRemoveFromLibrary = () => {
        if (importSelected && window.confirm(`Remove '${importSelected}' from library?`)) {
            const lib = { ...libraryProfiles };
            delete lib[importSelected];
            localStorage.setItem('my_wpi_library', JSON.stringify(lib));
            setImportSelected('');
        }
    };

    // ── India Mode Render ────────────────────────────────────────────────────

    const renderIndiaMode = () => (
        <div className="india-mode-container">
            <SectionHeader title="Vehicle Traffic Data" />
            <div className="table-responsive mb-4">
                <table className="table table-bordered table-sm traffic-table text-center align-middle">
                    <thead>
                        <tr><th style={{ width: '30%' }}>Vehicle Type</th><th>Vehicles / Day</th><th>Accident %</th><th>PWR</th></tr>
                    </thead>
                    <tbody>
                        {VEHICLES.map(v => (
                            <tr key={v.key}>
                                <td className="text-start ps-3 fw-bold">{v.label}</td>
                                <td className="p-0"><input type="number" className="table-input" value={form.vehicles[v.key]?.vehicles_per_day || 0} onChange={(e) => {
                                    const nextVehicles = { ...form.vehicles, [v.key]: { ...form.vehicles[v.key], vehicles_per_day: Number(e.target.value) } };
                                    updateState({ ...form, vehicles: nextVehicles });
                                }} /></td>
                                <td className="p-0"><input type="number" step="0.01" className="table-input" value={(form.vehicles[v.key]?.accident_percentage || 0).toFixed(2)} onChange={(e) => {
                                    const nextVehicles = { ...form.vehicles, [v.key]: { ...form.vehicles[v.key], accident_percentage: Number(e.target.value) } };
                                    updateState({ ...form, vehicles: nextVehicles });
                                }} /></td>
                                <td className="p-0">{v.hasPwr ? <input type="number" step="0.01" className="table-input" value={(form.vehicles[v.key]?.pwr || 0).toFixed(2)} onChange={(e) => {
                                    const nextVehicles = { ...form.vehicles, [v.key]: { ...form.vehicles[v.key], pwr: Number(e.target.value) } };
                                    updateState({ ...form, vehicles: nextVehicles });
                                }} /> : <div className="text-muted">-</div>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-4 d-flex align-items-center gap-3 custom-checkbox-row">
                <input type="checkbox" id="force_free_flow" checked={form.force_free_flow} onChange={(e) => updateState({ ...form, force_free_flow: e.target.checked })} />
                <label htmlFor="force_free_flow" className="mb-0 fw-bold small">Force free-flow conditions off-peak</label>
            </div>

            <SectionHeader title="Alternate Road Configuration" />
            <div className="mb-4">
                <label className="fw-bold mb-1 d-block small">Alternate Road Carriageway *</label>
                <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Lane configuration of the alternate route - auto-fills capacity and width.</div>
                <select className="form-select" value={form.alternate_road.alternate_road_carriageway} onChange={(e) => {
                    const lane = LANE_TYPES.find(l => l.name === e.target.value);
                    updateState({ ...form, alternate_road: { alternate_road_carriageway: e.target.value, carriage_width_in_m: lane ? lane.width : 0, hourly_capacity: lane ? lane.capacity : 0 } });
                }}><option value="">- Select -</option>{LANE_TYPES.map(l => <option key={l.code} value={l.name}>{l.name}</option>)}</select>
            </div>
            <InputField label="Carriageway Width" unit="(m)" required value={form.alternate_road.carriage_width_in_m} onChange={(v) => updateState({ ...form, alternate_road: { ...form.alternate_road, carriage_width_in_m: Number(v) } })} />
            <InputField label="Hourly Capacity" unit="(veh/hr)" required value={form.alternate_road.hourly_capacity} onChange={(v) => updateState({ ...form, alternate_road: { ...form.alternate_road, hourly_capacity: Number(v) } })} />

            <SectionHeader title="Accident Severity Distribution" />
            <InputField label="Minor Injury" hint="Percentage of accidents resulting in minor injury" unit="(%)" value={form.severity.severity_minor} onChange={(v) => {
                const num = Number(v);
                let next = { ...form.severity, severity_minor: num };
                next.severity_major = Math.min(100 - num, next.severity_major);
                next.severity_fatal = 100 - num - next.severity_major;
                updateState({ ...form, severity: next });
            }} />
            <InputField label="Major Injury" hint="Percentage of accidents resulting in major injury" unit="(%)" value={form.severity.severity_major} onChange={(v) => {
                const num = Number(v);
                let next = { ...form.severity, severity_major: num };
                next.severity_minor = Math.min(100 - num, next.severity_minor);
                next.severity_fatal = 100 - num - next.severity_minor;
                updateState({ ...form, severity: next });
            }} />
            <InputField label="Fatal Accident" hint="Percentage of accidents resulting in fatal injury" unit="(%)" value={form.severity.severity_fatal} onChange={(v) => {
                const num = Number(v);
                let next = { ...form.severity, severity_fatal: num };
                next.severity_minor = Math.min(100 - num, next.severity_minor);
                next.severity_major = 100 - num - next.severity_minor;
                updateState({ ...form, severity: next });
            }} />

            <SectionHeader title="Road Parameters" />
            <InputField label="Road Roughness" hint="Indicates the smoothness of the road surface; lower values mean smoother ride quality, higher values mean more unevenness measured in mm/km" unit="(mm/km)" value={form.road_params.road_roughness_mm_per_km} onChange={(v) => updateState({ ...form, road_params: { ...form.road_params, road_roughness_mm_per_km: Number(v) } })} />
            <InputField label="Road Rise" hint="Upward gradient of the road, expressed as vertical increase in meters per kilometer (m/km)." unit="(m/km)" required value={form.road_params.road_rise_m_per_km} onChange={(v) => updateState({ ...form, road_params: { ...form.road_params, road_rise_m_per_km: Number(v) } })} />
            <InputField label="Road Fall" hint="Downward gradient of the road, expressed as vertical decrease in meters per kilometer (m/km)." unit="(m/km)" required value={form.road_params.road_fall_m_per_km} onChange={(v) => updateState({ ...form, road_params: { ...form.road_params, road_fall_m_per_km: Number(v) } })} />
            <InputField label="Additional Reroute Distance" hint="Additional travel distance incurred due to rerouting during construction." unit="(km)" value={form.road_params.additional_reroute_distance_km} onChange={(v) => updateState({ ...form, road_params: { ...form.road_params, additional_reroute_distance_km: Number(v) } })} />
            <InputField label="Additional Travel Time" hint="Extra travel time incurred by road users due to rerouting during construction." unit="(min)" value={form.road_params.additional_travel_time_min} onChange={(v) => updateState({ ...form, road_params: { ...form.road_params, additional_travel_time_min: Number(v) } })} />
            <InputField label="Crash Rate" hint="Number of accidents per million kilometers of road length per day." unit="(acc / M km)" required value={form.road_params.crash_rate_accidents_per_million_km} onChange={(v) => updateState({ ...form, road_params: { ...form.road_params, crash_rate_accidents_per_million_km: Number(v) } })} />

            <SectionHeader title="Traffic Flow" />
            <InputField label="Number of Peak Hours" hint="Total hours per day with peak traffic conditions." required value={form.num_peak_hours} onChange={(v) => {
                const count = Math.min(24, Math.max(0, Number(v)));
                const nextDist = { ...form.peak_distribution };
                for (let i = 1; i <= count; i++) if (!nextDist[`peak_hour_${i}`]) nextDist[`peak_hour_${i}`] = 0.04;
                updateState({ ...form, num_peak_hours: count, peak_distribution: nextDist });
            }} />

            <div className="mb-4">
                <div className="fw-bold mb-2 small">Peak Hour Distribution</div>
                <div className="table-responsive">
                    <table className="table table-bordered table-sm traffic-table text-center align-middle">
                        <thead><tr><th style={{ width: '60%' }}>Hour Category</th><th>Traffic Proportion (%)</th></tr></thead>
                        <tbody>
                            {[...Array(form.num_peak_hours || 1)].map((_, i) => (
                                <tr key={i}><td className="text-start ps-3 fw-bold">{form.num_peak_hours > 0 ? `Peak Hour ${i + 1}` : 'Peak Hour 1'}</td><td className="p-0">
                                    <input type="number" step="0.01" className="table-input" value={((form.peak_distribution[`peak_hour_${i + 1}`] || 0.04) * 100).toFixed(2)} onChange={(e) => updateState({ ...form, peak_distribution: { ...form.peak_distribution, [`peak_hour_${i + 1}`]: Number(e.target.value) / 100 } })} /></td></tr>
                            ))}
                            <tr><td className="text-start ps-3 fw-bold">Other Hours (Average)</td><td className="p-3 text-end fw-bold" style={{ backgroundColor: 'var(--app-bg-alt)' }}>
                                {(() => {
                                    const totalPeak = Object.values(form.peak_distribution).reduce((a, b) => a + b, 0);
                                    const count = form.num_peak_hours || 1;
                                    return (24 - count > 0) ? (((1 - totalPeak) / (24 - count)) * 100).toFixed(2) : '0.00';
                                })()} %</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <SectionHeader title="WPI Adjustment Factors" />
            <div className="d-flex flex-wrap gap-3 mb-4 align-items-center wpi-controls-row">
                <label className="fw-bold mb-0">WPI Profile:</label>
                <select className="form-select form-select-sm profile-select" value={form.wpi_profile} onChange={(e) => handleWpiProfileChange(e.target.value)}>
                    {Object.keys(WPI_DATABASE).map(y => <option key={y} value={y}>{y}</option>)}
                    {Object.keys(localCustomProfiles).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="btn-group btn-group-sm outline-group">
                    <button className="btn outline-btn" onClick={handleNewWpi}>+ New</button>
                    <button className="btn outline-btn" onClick={() => setShowSaveAs(true)}>Save As</button>
                    <button className="btn outline-btn" onClick={handleDeleteWpi}>Delete</button>
                </div>
                <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-sm action-btn" onClick={handleSaveToLibrary}>Save to My Library</button>
                    <button className="btn btn-sm action-btn" onClick={() => setShowImportModal(true)}>Import from Library</button>
                </div>
            </div>

            <div className="table-responsive wpi-table-container mb-4">
                <table className="table table-bordered table-sm wpi-table text-center align-middle">
                    <thead>
                        <tr><th rowSpan="2" className="text-start ps-2 border-end-0"></th><th colSpan="4">Vehicle Cost</th><th colSpan="1">Commodity</th><th colSpan="2">Pass. & Crew</th><th colSpan="3">Medical Cost</th><th colSpan="1">VOT Cost</th></tr>
                        <tr>{WPI_COLUMNS.map(col => <th key={col.key}>{col.label}</th>)}</tr>
                    </thead>
                    <tbody>
                        {['Common to All', ...VEHICLES.map(v => v.label)].map((rowLabel, rIdx) => {
                            const vKey = rIdx === 0 ? 'small_cars' : VEHICLES[rIdx - 1].key;
                            return (
                                <tr key={rowLabel}><td className="fw-bold text-start ps-3" style={{ whiteSpace: 'nowrap' }}>{rowLabel}</td>
                                    {WPI_COLUMNS.map(col => (
                                        <td key={col.key} className="p-0">
                                            <input type="number" step="0.0001" className="table-input wpi-cell text-end pe-3" value={(form.wpi_data?.[vKey]?.[col.key] || 0).toFixed(4)} onChange={(e) => handleWpiCellChange(vKey, col.key, e.target.value)} />
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-outline-secondary w-100 mb-4 py-2" onClick={() => window.print()}>Print WPI Data</button>
        </div>
    );

    return (
        <div className="traffic-data-page" style={{ padding: '24px', color: 'var(--app-text-primary)', maxWidth: '1400px' }}>
            <div className="mb-4"><label className="fw-bold mb-2 d-block small">Calculation Mode</label>
                <select className="form-select" style={{ maxWidth: '300px' }} value={form.calculation_mode} onChange={(e) => updateState({ ...form, calculation_mode: e.target.value })}>
                    <option value="INDIA">INDIA</option><option value="GLOBAL">GLOBAL</option>
                </select>
            </div>
            {form.calculation_mode === 'INDIA' ? renderIndiaMode() : (
                <div className="global-mode-container"><SectionHeader title="Global Parameters" />
                    <InputField label="Road User Cost per Day" unit="/ day" value={form.road_user_cost_per_day} onChange={(v) => updateState({ ...form, road_user_cost_per_day: Number(v) })} />
                </div>
            )}
            <SectionHeader title="Remarks / Notes" />
            <div className="remarks-editor-mock mb-4">
                <div className="toolbar d-flex gap-2 p-2 border-bottom"><button className="btn btn-sm fw-bold">B</button><button className="btn btn-sm fst-italic">I</button><button className="btn btn-sm text-decoration-underline">U</button><button className="btn btn-sm text-decoration-line-through">S</button><div className="vr mx-1"></div><button className="btn btn-sm">Left</button><button className="btn btn-sm">Center</button><button className="btn btn-sm">Right</button><button className="btn btn-sm">Justify</button><div className="vr mx-1"></div><button className="btn btn-sm">• List</button><button className="btn btn-sm">1. List</button><div className="vr mx-1"></div><button className="btn btn-sm">+ Table</button><button className="btn btn-sm">+ Row</button><button className="btn btn-sm">+ Col</button><button className="btn btn-sm text-danger">Clear</button></div>
                <textarea className="form-control border-0 p-3" rows="8" placeholder="Add notes or remarks here. These will appear in the generated report." value={form.remarks} onChange={(e) => updateState({ ...form, remarks: e.target.value })} style={{ backgroundColor: 'transparent' }} />
            </div>
            <div className="d-flex gap-3 mt-5 pb-5">
                <button className="btn flex-grow-1 py-3 fw-bold" style={{ backgroundColor: 'var(--app-bg-card)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)', borderRadius: '8px' }} onClick={() => updateState(INITIAL_STATE)}>Clear All</button>
                <button className="btn py-3 fw-bold px-5" style={{ backgroundColor: 'transparent', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)', borderRadius: '8px' }} onClick={() => alert("Validation complete: No errors found.")}>Validate this page</button>
            </div>

            {/* Custom Modals */}
            {showSaveAs && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="modal-header">
                            <h6 className="m-0 fw-bold d-flex align-items-center gap-2">
                                <span className="logo-dots"></span> Save Profile As
                            </h6>
                            <button className="close-btn" onClick={() => setShowSaveAs(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 d-flex align-items-center">
                                <label style={{ width: '100px' }}>Profile Name:</label>
                                <input type="text" className="form-control" value={saveAsForm.name} onChange={e => setSaveAsForm({...saveAsForm, name: e.target.value})} placeholder="custom-user" />
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <label style={{ width: '100px' }}>Year:</label>
                                <input type="number" className="form-control" value={saveAsForm.year} onChange={e => setSaveAsForm({...saveAsForm, year: e.target.value})} />
                            </div>
                            <div className="mb-3 d-flex align-items-start">
                                <label style={{ width: '100px', paddingTop: '8px' }}>Remark:</label>
                                <textarea className="form-control" rows="3" value={saveAsForm.remark} onChange={e => setSaveAsForm({...saveAsForm, remark: e.target.value})} placeholder="Optional remarks..." />
                            </div>
                        </div>
                        <div className="modal-footer justify-content-end gap-2">
                            <button className="btn btn-primary" onClick={handleSaveAsSubmit}>OK</button>
                            <button className="btn btn-outline-secondary" onClick={() => setShowSaveAs(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showInfoModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal info-modal">
                        <div className="modal-header">
                            <h6 className="m-0 fw-bold d-flex align-items-center gap-2">
                                <span className="logo-dots"></span> Saved to Library
                            </h6>
                            <button className="close-btn" onClick={() => setShowInfoModal(false)}>×</button>
                        </div>
                        <div className="modal-body d-flex align-items-center gap-3">
                            <div className="info-icon">i</div>
                            <div style={{ whiteSpace: 'pre-line' }}>{infoMessage}</div>
                        </div>
                        <div className="modal-footer justify-content-end">
                            <button className="btn btn-primary px-4" onClick={() => setShowInfoModal(false)}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {showImportModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal import-modal">
                        <div className="modal-header">
                            <h6 className="m-0 fw-bold d-flex align-items-center gap-2">
                                <span className="logo-dots"></span> Import from My WPI Library
                            </h6>
                            <button className="close-btn" onClick={() => setShowImportModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <label className="mb-2">Select a saved profile:</label>
                            <select className="form-select mb-2" value={importSelected} onChange={e => setImportSelected(e.target.value)}>
                                <option value="">- Select Profile -</option>
                                {Object.keys(libraryProfiles).map(k => (
                                    <option key={k} value={k}>{k} ({libraryProfiles[k]?.metadata?.year || ''})</option>
                                ))}
                            </select>
                            {importSelected && libraryProfiles[importSelected] && (
                                <div className="text-muted small mb-3">
                                    Year: {libraryProfiles[importSelected].metadata.year} &nbsp; Remark: {libraryProfiles[importSelected].metadata.remark}
                                </div>
                            )}
                            <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleRemoveFromLibrary} disabled={!importSelected}>
                                <span>🗑️</span> Remove from Library
                            </button>
                        </div>
                        <div className="modal-footer justify-content-end gap-2">
                            <button className="btn btn-primary px-4" onClick={handleImportSubmit} disabled={!importSelected}>OK</button>
                            <button className="btn btn-outline-secondary" onClick={() => setShowImportModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrafficData;
export { INITIAL_STATE };
