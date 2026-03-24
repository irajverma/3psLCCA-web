import React, { useState, useCallback, useRef, useEffect } from 'react';
import { data as countriesData } from '../utils/countriesdata';

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_DOCS_URL = 'https://yourdocs.com/general/';

const COUNTRIES = countriesData.map((c) => c.COUNTRY);

const INITIAL_STATE = {
    // Project Information
    project_name:        '',
    project_code:        '',
    project_description: '',
    remarks:             '',
    // Evaluating Agency
    agency_name:         '',
    contact_person:      '',
    agency_address:      '',
    agency_country:      '',
    agency_email:        '',
    agency_phone:        '',
    // Project Settings (read-only / locked — shown but not editable)
    project_country:     '',
    project_currency:    '',
    unit_system:         '',
    sor_database:        '',
};

const REQUIRED_KEYS = new Set(['project_name']);

// Fields that are display-only (locked)
const LOCKED_KEYS = new Set(['project_country', 'project_currency', 'unit_system']);

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
    return (
        <h5 className="mb-4 fw-bold pb-2 mt-4" style={{ borderBottom: '1px solid var(--app-border-dark)', fontSize: '1rem', color: 'var(--app-text-primary)', transition: 'all 0.3s' }}>
            {title}
        </h5>
    );
}

function FieldHint({ text, docSlug }) {
    return (
        <div style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: '8px' }}>
            {text}
            {docSlug && (
                <a
                    href={`${BASE_DOCS_URL}${docSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none ms-1"
                    style={{ color: 'var(--app-primary-accent)', fontSize: '0.75rem' }}
                    title="View documentation"
                >
                    ⓘ
                </a>
            )}
        </div>
    );
}

function TextField({ id, label, hint, docSlug, required, value, onChange, hasError, disabled }) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            <FieldHint text={hint} docSlug={docSlug} />
            <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange && onChange(id, e.target.value)}
                disabled={disabled}
                className={`form-control ${hasError ? 'is-invalid' : ''}`}
                style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            />
        </div>
    );
}

function TextAreaField({ id, label, hint, docSlug, required, value, onChange, hasError }) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            <FieldHint text={hint} docSlug={docSlug} />
            <textarea
                id={id}
                rows={4}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                className={`form-control ${hasError ? 'is-invalid' : ''}`}
                style={{ resize: 'vertical' }}
            />
        </div>
    );
}

function PhoneField({ id, label, hint, value, onChange, hasError }) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}
            </label>
            <FieldHint text={hint} />
            <input
                id={id}
                type="tel"
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                className={`form-control ${hasError ? 'is-invalid' : ''}`}
                placeholder="+1 234 567 8900"
            />
        </div>
    );
}

function SelectField({ id, label, hint, docSlug, required, options, value, onChange, hasError }) {
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

    const select = (opt) => {
        onChange(id, opt);
        setOpen(false);
    };

    return (
        <div className="mb-4">
            <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            <FieldHint text={hint} docSlug={docSlug} />
            <div className="position-relative" ref={ref}>
                <button
                    type="button"
                    id={id}
                    className={`form-control d-flex align-items-center justify-content-between text-start ${hasError ? 'is-invalid' : ''}`}
                    onClick={() => setOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className={value ? '' : 'text-muted fst-italic'}>
                        {value || '— Select —'}
                    </span>
                    <span className="text-muted ms-2" style={{ fontSize: '0.75rem', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▾</span>
                </button>
                {open && (
                    <ul className="dropdown-menu show w-100 p-1 shadow-sm" role="listbox" style={{ maxHeight: '250px', overflowY: 'auto', backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-input-border)' }}>
                        <li
                            className="dropdown-item text-muted fst-italic"
                            style={{ cursor: 'pointer', fontSize: '0.875rem' }}
                            onClick={() => select('')}
                        >
                            — Select —
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
                                    color: value === opt ? 'var(--app-primary-accent)' : 'var(--app-text-primary)',
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
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const ProjectInformationPlaceholder = ({ controller }) => {
    const [form, setForm] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState(new Set());
    const [validationMsg, setValidationMsg] = useState('');

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
        setValidationMsg('');
    }, []);

    const handleClearAll = () => {
        // Never clear locked or sor_database fields
        const skipKeys = new Set([...LOCKED_KEYS, 'sor_database']);
        setForm((prev) => {
            const next = { ...prev };
            Object.keys(INITIAL_STATE).forEach((k) => {
                if (!skipKeys.has(k)) next[k] = '';
            });
            return next;
        });
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('General Info: All fields cleared.');
    };

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const newErrors = new Set();
        const missing = [];

        REQUIRED_KEYS.forEach((key) => {
            const val = form[key];
            if (val === '' || val === null || val === undefined) {
                newErrors.add(key);
                missing.push(key.replace(/_/g, ' '));
            }
        });

        setErrors(newErrors);
        if (newErrors.size > 0) {
            const msg = `Missing required general info: ${missing.join(', ')}`;
            setValidationMsg(msg);
            controller?.engine?._log(msg);
            return { valid: false, errors: missing };
        }

        setValidationMsg('');
        return { valid: true, errors: [] };
    };

    const hasError = (key) => errors.has(key);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={{ padding: '24px', color: 'var(--app-text-primary)' }}>

            {/* ── Project Information ──────────────────────────────────────── */}
            <SectionHeader title="Project Information" />

            <TextField
                id="project_name"
                label="Project Name"
                hint="Official name or title of the bridge/infrastructure project."
                docSlug="project-name"
                required
                value={form.project_name}
                onChange={handleChange}
                hasError={hasError('project_name')}
            />

            <TextField
                id="project_code"
                label="Project Code"
                hint="Unique reference code assigned to this project."
                docSlug="project-code"
                value={form.project_code}
                onChange={handleChange}
                hasError={hasError('project_code')}
            />

            <TextAreaField
                id="project_description"
                label="Project Description"
                hint="Brief description of the project scope, objectives, or background."
                docSlug="project-description"
                value={form.project_description}
                onChange={handleChange}
                hasError={hasError('project_description')}
            />

            <TextAreaField
                id="remarks"
                label="Remarks"
                hint="Any additional notes, assumptions, or comments relevant to this evaluation."
                docSlug="remarks"
                value={form.remarks}
                onChange={handleChange}
                hasError={hasError('remarks')}
            />

            {/* ── Evaluating Agency ────────────────────────────────────────── */}
            <SectionHeader title="Evaluating Agency" />

            <TextField
                id="agency_name"
                label="Agency Name"
                hint="Name of the organization responsible for this evaluation."
                docSlug="agency-name"
                value={form.agency_name}
                onChange={handleChange}
                hasError={hasError('agency_name')}
            />

            <TextField
                id="contact_person"
                label="Contact Person"
                hint="Primary contact handling this project."
                docSlug="contact-person"
                value={form.contact_person}
                onChange={handleChange}
                hasError={hasError('contact_person')}
            />

            <TextField
                id="agency_address"
                label="Agency Address"
                hint="Street address of the evaluating agency."
                docSlug="agency-address"
                value={form.agency_address}
                onChange={handleChange}
                hasError={hasError('agency_address')}
            />

            <SelectField
                id="agency_country"
                label="Country"
                hint="Country where the evaluating agency is based."
                docSlug="agency-country"
                options={COUNTRIES}
                value={form.agency_country}
                onChange={handleChange}
                hasError={hasError('agency_country')}
            />

            <TextField
                id="agency_email"
                label="Email"
                hint="Official email address for correspondence."
                docSlug="agency-email"
                value={form.agency_email}
                onChange={handleChange}
                hasError={hasError('agency_email')}
            />

            <PhoneField
                id="agency_phone"
                label="Phone"
                hint="Contact phone number."
                value={form.agency_phone}
                onChange={handleChange}
                hasError={hasError('agency_phone')}
            />

            {/* ── Project Settings (locked, read-only) ─────────────────────── */}
            <SectionHeader title="Project Settings" />

            <TextField
                id="project_country"
                label="Country"
                hint="Country where the bridge project is located. Set at project creation."
                docSlug="project_country"
                value={form.project_country}
                disabled
            />

            <TextField
                id="project_currency"
                label="Currency"
                hint="Currency used for all cost figures. Set at project creation."
                docSlug="project_currency"
                value={form.project_currency}
                disabled
            />

            <TextField
                id="unit_system"
                label="Unit System"
                hint="Measurement unit system (Metric or Imperial). Set at project creation."
                docSlug="unit-system"
                value={form.unit_system}
                disabled
            />

            <TextField
                id="sor_database"
                label="Material Suggestions"
                hint="Schedule of Rates database used to auto-suggest material names, rates, and emission factors."
                docSlug="sor-database"
                value={form.sor_database}
                onChange={handleChange}
                hasError={hasError('sor_database')}
            />

            {/* ── Buttons ──────────────────────────────────────────────────── */}
            <div className="d-flex gap-2 mt-4 mb-3">
                <button
                    className="btn w-100"
                    style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)', borderRadius: 'var(--app-radius-sm)', transition: 'all 0.2sease' }}
                    onClick={handleClearAll}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--app-border-light)'; e.currentTarget.style.color = 'var(--app-text-primary)'; e.currentTarget.style.borderColor = 'var(--app-border-dark)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--app-bg-alt)'; e.currentTarget.style.color = 'var(--app-text-secondary)'; e.currentTarget.style.borderColor = 'var(--app-border-mid)'; }}
                >
                    Clear All
                </button>
            </div>

            {/* Validation message */}
            {validationMsg && (
                <div className="alert alert-danger p-2" style={{ fontSize: '0.8rem' }} role="alert">
                    ⚠ {validationMsg}
                </div>
            )}
        </div>
    );
};

export default ProjectInformationPlaceholder;
export { REQUIRED_KEYS, INITIAL_STATE };
