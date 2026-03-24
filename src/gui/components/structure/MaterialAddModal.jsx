import React, { useState } from 'react';

const MaterialAddModal = ({ sectionName, onClose, onAdd }) => {
    // Basic fields
    const [workName, setWorkName] = useState('');
    const [allowEditingDB, setAllowEditingDB] = useState(false);
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('m³ — Cubic Metre');
    const [rate, setRate] = useState('');
    const [source, setSource] = useState('');

    // Carbon Emission
    const [includeCarbon, setIncludeCarbon] = useState(true);
    const [emissionFactor, setEmissionFactor] = useState('');
    const [emissionPerUnit, setEmissionPerUnit] = useState('m³ — Cubic Metre');
    const [emissionSource, setEmissionSource] = useState('');

    // Recyclability
    const [includeRecyclability, setIncludeRecyclability] = useState(false);
    const [grade, setGrade] = useState('');
    const [type, setType] = useState('');

    const handleAdd = () => {
        // Map the modal fields to the table row structure
        const newRowData = {
            workName,
            qty: parseFloat(qty) || 0,
            unit,
            rate: parseFloat(rate) || 0,
            source,
            // Extended fields (stored in row object even if table doesn't display them natively)
            allowEditingDB,
            carbonEmission: includeCarbon ? { factor: parseFloat(emissionFactor) || 0, perUnit: emissionPerUnit, source: emissionSource } : null,
            recyclability: includeRecyclability ? { grade, type } : null
        };
        onAdd(newRowData);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040, backgroundColor: 'rgba(0,0,0,0.6)' }}
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                style={{ zIndex: 1050 }}
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
                    <div className="modal-content shadow-lg border-0" style={{ backgroundColor: 'var(--app-bg-card)', color: 'var(--app-text-primary)', borderRadius: '8px', overflow: 'hidden' }}>

                        {/* Custom Window Header */}
                        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom" style={{ backgroundColor: 'var(--app-bg-alt)', borderColor: 'var(--app-border-mid)' }}>
                            <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--app-primary-accent)', fontSize: '1.2rem' }}>⛁</span>
                                <span>Add Material — {sectionName}</span>
                            </div>
                            <div className="d-flex gap-3 align-items-center" style={{ cursor: 'pointer', fontSize: '1.1rem' }}>
                                <span className="opacity-75" onClick={onClose}>—</span>
                                <span className="opacity-75" onClick={onClose}>□</span>
                                <span onClick={onClose}>✕</span>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body px-4 py-2" style={{ fontSize: '0.9rem' }}>
                            <div className="mb-3 opacity-75" style={{ fontSize: '0.85rem' }}>
                                Suggestions from: <span className="fst-italic">— not set (configure in Project Settings)</span>
                            </div>

                            {/* Material Name */}
                            <div className="mb-2">
                                <label className="form-label fw-medium mb-1">Material Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="e.g. Ready-mix Concrete M25  (type ? to browse all)"
                                    value={workName}
                                    onChange={e => setWorkName(e.target.value)}
                                />
                            </div>

                            {/* Allow DB Toggle */}
                            <div className="mb-2 form-check d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    id="allowDb"
                                    style={{ width: '18px', height: '18px', backgroundColor: allowEditingDB ? 'var(--app-primary-accent)' : 'var(--app-input-bg)', borderColor: 'var(--app-border-mid)' }}
                                    checked={allowEditingDB}
                                    onChange={e => setAllowEditingDB(e.target.checked)}
                                />
                                <label className="form-check-label opacity-75" htmlFor="allowDb" style={{ paddingTop: '1px', cursor: 'pointer' }}>
                                    Allow editing DB-filled values
                                </label>
                            </div>

                            {/* Quantity & Unit */}
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium mb-1">Quantity <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="e.g. 100"
                                        value={qty}
                                        onChange={e => setQty(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium mb-1">Unit <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={unit}
                                        onChange={e => setUnit(e.target.value)}
                                    >
                                        <option value="m³ — Cubic Metre">m³ — Cubic Metre</option>
                                        <option value="kg — Kilogram">kg — Kilogram</option>
                                        <option value="ton — Tonne">ton — Tonne</option>
                                        <option value="sqm — Square Metre">sqm — Square Metre</option>
                                    </select>
                                </div>
                            </div>

                            {/* Rate & Rate Source */}
                            <div className="row mb-2 pb-2 border-bottom border-secondary" style={{ borderColor: 'var(--app-border-mid) !important' }}>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium mb-1">Rate (Cost)</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="e.g. 4500"
                                        value={rate}
                                        onChange={e => setRate(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium mb-1">Rate Source</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="e.g. DSR 2023, Market Rate"
                                        value={source}
                                        onChange={e => setSource(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Carbon Emission */}
                            <div className="mb-2 pb-2 border-bottom border-secondary" style={{ borderColor: 'var(--app-border-mid) !important' }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="m-0 fw-bold">Carbon Emission</h6>
                                    <div className="form-check d-flex align-items-center gap-2 m-0">
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            id="incCarbon"
                                            style={{ width: '18px', height: '18px', backgroundColor: includeCarbon ? 'var(--app-primary-accent)' : 'var(--app-input-bg)', borderColor: 'var(--app-border-mid)' }}
                                            checked={includeCarbon}
                                            onChange={e => setIncludeCarbon(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="incCarbon" style={{ cursor: 'pointer' }}>Include</label>
                                    </div>
                                </div>
                                <div className="row" style={{ opacity: includeCarbon ? 1 : 0.5, pointerEvents: includeCarbon ? 'auto' : 'none' }}>
                                    <div className="col-md-4">
                                        <label className="form-label mb-1">Emission Factor</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="e.g. 0.179"
                                            value={emissionFactor}
                                            onChange={e => setEmissionFactor(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label mb-1">Per Unit <span className="opacity-75">(kgCO₂e / ...)</span></label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={emissionPerUnit}
                                            onChange={e => setEmissionPerUnit(e.target.value)}
                                        >
                                            <option value="m³ — Cubic Metre">m³ — Cubic Metre</option>
                                            <option value="kg — Kilogram">kg — Kilogram</option>
                                            <option value="ton — Tonne">ton — Tonne</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label mb-1">Emission Factor Source</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="e.g. ICE v3.0, IPCC"
                                            value={emissionSource}
                                            onChange={e => setEmissionSource(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Recyclability */}
                            <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="m-0 fw-bold">Recyclability</h6>
                                    <div className="form-check d-flex align-items-center gap-2 m-0">
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            id="incRecyclability"
                                            style={{ width: '18px', height: '18px', backgroundColor: includeRecyclability ? 'var(--app-primary-accent)' : 'var(--app-input-bg)', borderColor: 'var(--app-border-mid)' }}
                                            checked={includeRecyclability}
                                            onChange={e => setIncludeRecyclability(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="incRecyclability" style={{ cursor: 'pointer' }}>Include</label>
                                    </div>
                                </div>
                                <div className="row" style={{ opacity: includeRecyclability ? 1 : 0.5, pointerEvents: includeRecyclability ? 'auto' : 'none' }}>
                                    <div className="col-md-6">
                                        <label className="form-label mb-1">Grade</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="e.g. M25, Fe500"
                                            value={grade}
                                            onChange={e => setGrade(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label mb-1">Type</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={type}
                                            onChange={e => setType(e.target.value)}
                                        >
                                            <option value="">e.g. Concrete, Steel</option>
                                            <option value="Concrete">Concrete</option>
                                            <option value="Steel">Steel</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer d-flex justify-content-between border-top border-secondary pt-3 pb-3 px-4" style={{ backgroundColor: 'var(--app-bg-alt)', borderColor: 'var(--app-border-mid) !important' }}>
                            <button
                                className="btn px-4"
                                style={{ backgroundColor: 'transparent', color: 'var(--app-text-primary)', border: '1px solid var(--app-primary-accent)' }}
                            >
                                Save to Custom DB...
                            </button>
                            <div className="d-flex gap-2">
                                <button className="btn px-4" style={{ backgroundColor: 'var(--app-bg-card)', color: 'var(--app-text-primary)', border: '1px solid var(--app-border-mid)' }} onClick={onClose}>Cancel</button>
                                <button className="btn px-4" style={{ backgroundColor: 'var(--app-primary-accent)', color: 'white', border: 'none' }} onClick={handleAdd}>Add to Table</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default MaterialAddModal;
