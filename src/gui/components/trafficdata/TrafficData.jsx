import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TrafficData.css';

// ── Constants ────────────────────────────────────────────────────────────────

const CALCULATION_MODES = ['GLOBAL', 'LOCAL'];

const INITIAL_STATE = {
    calculation_mode: '',
    road_user_cost_per_day: '',
    remarks: '',
};

// ── Custom Dropdown ───────────────────────────────────────────────────────────

function Dropdown({ id, options, value, onChange, placeholder = '— Select —' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const select = (opt) => { onChange(opt); setOpen(false); };

    return (
        <div className="position-relative" ref={ref}>
            <button
                type="button"
                id={id}
                className="form-control d-flex align-items-center justify-content-between text-start"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={value ? '' : 'text-muted fst-italic'}>
                    {value || placeholder}
                </span>
                <span className="text-muted ms-2" style={{ fontSize: '0.75rem', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▾</span>
            </button>
            {open && (
                <ul className="dropdown-menu show w-100 p-1 shadow-sm" role="listbox" style={{ maxHeight: '250px', overflowY: 'auto', backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-input-border)' }}>
                    <li className="dropdown-item text-muted fst-italic" style={{ cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => select('')}>
                        {placeholder}
                    </li>
                    {options.map((opt) => (
                        <li
                            key={opt}
                            role="option"
                            aria-selected={value === opt}
                            className={`dropdown-item ${value === opt ? 'active fw-bold' : ''}`}
                            style={{
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                backgroundColor: value === opt ? 'var(--app-accent-bg, rgba(115, 165, 175, 0.15))' : 'transparent',
                                color: value === opt ? 'var(--app-primary-accent)' : 'var(--app-text-primary)'
                            }}
                            onClick={() => select(opt)}
                            onMouseEnter={(e) => { if (value !== opt) e.target.style.backgroundColor = 'var(--app-bg-alt)'; }}
                            onMouseLeave={(e) => { if (value !== opt) e.target.style.backgroundColor = 'transparent'; }}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ── Road User Cost Field ───────────────────────────────────────────────────────

function RoadUserCostField({ value, onChange }) {
    return (
        <div className="mb-4">
            <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>Road User Cost per Day</label>
            <div className="input-group">
                <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="form-control"
                    placeholder="0.00"
                />
                <span className="input-group-text border-start-0" style={{ fontSize: '0.8rem', backgroundColor: 'var(--app-input-bg)', borderColor: 'var(--app-input-border)' }}>/ day</span>
            </div>
        </div>
    );
}

// ── Rich Text Editor ──────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);

    const exec = (command, arg = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, arg);
    };

    const handleInput = () => {
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const insertTable = () => {
        const rows = 3, cols = 3;
        let html = '<table border="1" style="border-collapse:collapse;width:100%">';
        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
                html += r === 0
                    ? '<th style="padding:4px 8px;background:var(--app-bg-alt)">&nbsp;</th>'
                    : '<td style="padding:4px 8px">&nbsp;</td>';
            }
            html += '</tr>';
        }
        html += '</table><br>';
        document.execCommand('insertHTML', false, html);
    };

    const insertRow = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const cell = sel.anchorNode?.parentElement?.closest('td, th');
        const row = cell?.closest('tr');
        if (!row) return;
        const colCount = row.cells.length;
        const newRow = document.createElement('tr');
        for (let i = 0; i < colCount; i++) {
            const td = document.createElement('td');
            td.style.padding = '4px 8px';
            td.innerHTML = '&nbsp;';
            newRow.appendChild(td);
        }
        row.parentElement.insertBefore(newRow, row.nextSibling);
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const insertCol = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const cell = sel.anchorNode?.parentElement?.closest('td, th');
        const row = cell?.closest('tr');
        const table = row?.closest('table');
        if (!table) return;
        const cellIndex = cell ? Array.from(row.cells).indexOf(cell) + 1 : -1;
        Array.from(table.rows).forEach((tr, rowIdx) => {
            const newCell = rowIdx === 0
                ? document.createElement('th')
                : document.createElement('td');
            newCell.style.padding = '4px 8px';
            if (rowIdx === 0) newCell.style.background = 'var(--app-bg-alt)';
            newCell.innerHTML = '&nbsp;';
            if (cellIndex >= 0 && cellIndex < tr.cells.length) {
                tr.insertBefore(newCell, tr.cells[cellIndex]);
            } else {
                tr.appendChild(newCell);
            }
        });
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const TOOLBAR = [
        { label: 'B',       title: 'Bold',             action: () => exec('bold'),             style: { fontWeight: 'bold' } },
        { label: 'I',       title: 'Italic',           action: () => exec('italic'),           style: { fontStyle: 'italic' } },
        { label: 'U',       title: 'Underline',        action: () => exec('underline'),        style: { textDecoration: 'underline' } },
        { label: 'S',       title: 'Strikethrough',    action: () => exec('strikeThrough'),    style: { textDecoration: 'line-through' } },
        null,
        { label: 'Left',    title: 'Align Left',       action: () => exec('justifyLeft') },
        { label: 'Center',  title: 'Align Center',     action: () => exec('justifyCenter') },
        { label: 'Right',   title: 'Align Right',      action: () => exec('justifyRight') },
        { label: 'Justify', title: 'Justify',          action: () => exec('justifyFull') },
        null,
        { label: '• List',  title: 'Bullet List',      action: () => exec('insertUnorderedList') },
        { label: '1. List', title: 'Numbered List',    action: () => exec('insertOrderedList') },
        null,
        { label: '+ Table', title: 'Insert 3×3 Table', action: insertTable },
        { label: '+ Row',   title: 'Insert Row Below', action: insertRow },
        { label: '+ Col',   title: 'Insert Column Right', action: insertCol },
        { label: 'Clear',   title: 'Clear Formatting', action: () => exec('removeFormat') },
    ];

    return (
        <div className="mb-4">
            <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>Remarks / Notes</label>
            <div className="border rounded td-rte-wrapper" style={{ borderColor: 'var(--app-input-border)', backgroundColor: 'var(--app-input-bg)' }}>
                <div className="d-flex flex-wrap align-items-center gap-1 p-2 border-bottom" style={{ borderColor: 'var(--app-input-border)', backgroundColor: 'var(--app-bg-alt)' }}>
                    {TOOLBAR.map((btn, i) =>
                        btn === null
                            ? <div key={`div-${i}`} style={{ width: '1px', height: '16px', backgroundColor: 'var(--app-border-mid)', margin: '0 4px' }} />
                            : (
                                <button
                                    key={btn.label}
                                    type="button"
                                    title={btn.title}
                                    className="btn btn-sm border-0 px-2 py-1 td-rte-btn"
                                    style={{ ...btn.style, fontSize: '0.8rem', backgroundColor: 'transparent' }}
                                    onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
                                >
                                    {btn.label}
                                </button>
                            )
                    )}
                </div>
                <div
                    ref={editorRef}
                    className="p-2 td-rte-body"
                    style={{ minHeight: '120px', color: 'var(--app-text-primary)' }}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Add notes or remarks here. These will appear in the generated report."
                    onInput={handleInput}
                />
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TrafficData = ({ controller }) => {
    const [form, setForm] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState(new Set());
    const [validationMsg, setValidationMsg] = useState('');

    const clearErrors = useCallback((key) => {
        setErrors((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev); next.delete(key); return next;
        });
        setValidationMsg('');
    }, []);

    const handleModeChange = (val) => {
        setForm((prev) => ({ ...prev, calculation_mode: val }));
        clearErrors('calculation_mode');
    };

    const handleCostChange = (val) => {
        setForm((prev) => ({ ...prev, road_user_cost_per_day: val }));
    };

    const handleRemarksChange = (html) => {
        setForm((prev) => ({ ...prev, remarks: html }));
    };

    const handleClearAll = () => {
        setForm(INITIAL_STATE);
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Traffic: All fields cleared.');
    };

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const newErrors = new Set();
        const missing = [];

        if (!form.calculation_mode) {
            newErrors.add('calculation_mode');
            missing.push('Calculation Mode');
        }

        setErrors(newErrors);
        if (newErrors.size > 0) {
            const msg = `Missing required traffic data: ${missing.join(', ')}`;
            setValidationMsg(msg);
            controller?.engine?._log(msg);
            return { valid: false, errors: missing };
        }
        setValidationMsg('');
        return { valid: true, errors: [] };
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={{ padding: '24px', color: 'var(--app-text-primary)' }}>
            <h5 className="mb-4 fw-bold pb-2 mt-4" style={{ borderBottom: '1px solid var(--app-border-dark)', fontSize: '1rem', color: 'var(--app-text-primary)', transition: 'all 0.3s' }}>Traffic Parameters</h5>

            {/* Calculation Mode */}
            <div className="mb-4">
                <label htmlFor="calc_mode" className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                    Calculation Mode <span className="text-danger">*</span>
                </label>
                <Dropdown
                    id="calc_mode"
                    options={CALCULATION_MODES}
                    value={form.calculation_mode}
                    onChange={handleModeChange}
                />
                {errors.has('calculation_mode') && (
                    <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.78rem' }}>
                        Calculation mode is required.
                    </div>
                )}
            </div>

            {/* Road User Cost per Day */}
            <RoadUserCostField value={form.road_user_cost_per_day} onChange={handleCostChange} />

            {/* Remarks / Notes */}
            <RichTextEditor value={form.remarks} onChange={handleRemarksChange} />

            {/* Buttons */}
            <div className="d-flex mt-4 mb-3">
                <button
                    className="btn w-100"
                    style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)' }}
                    onClick={handleClearAll}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--app-border-light)'; e.target.style.color = 'var(--app-text-primary)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--app-bg-alt)'; e.target.style.color = 'var(--app-text-secondary)'; }}
                >
                    Clear All
                </button>
            </div>

            {validationMsg && (
                <div className="alert alert-danger p-2" style={{ fontSize: '0.8rem' }} role="alert">⚠ {validationMsg}</div>
            )}
        </div>
    );
};

export default TrafficData;
export { INITIAL_STATE };
