import React, { useState, useCallback, useEffect } from 'react';
import './FinancialData.css';

// ── Constants ────────────────────────────────────────────────────────────────

const FINANCIAL_FIELDS = [
    {
        key: 'discount_rate',
        label: 'Discount Rate',
        hint: 'The rate used to convert future cash flows into present value. Reflects the time value of money and investment risk.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
    },
    {
        key: 'discount_rate_source',
        label: 'Source: Discount Rate',
        type: 'text',
        required: false,
    },
    {
        key: 'inflation_rate',
        label: 'Inflation Rate',
        hint: 'Expected annual increase in general price levels over time.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
    },
    {
        key: 'inflation_rate_source',
        label: 'Source: Inflation Rate',
        type: 'text',
        required: false,
    },
    {
        key: 'interest_rate',
        label: 'Interest Rate',
        hint: 'The borrowing or lending rate applied to capital financing.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
    },
    {
        key: 'interest_rate_source',
        label: 'Source: Interest Rate',
        type: 'text',
        required: false,
    },
    {
        key: 'investment_ratio',
        label: 'Investment Ratio',
        hint: 'Proportion of total cost financed through investment (0 to 1).',
        type: 'float',
        min: 0.0,
        max: 1.0,
        step: 0.0001,
        unit: null,
        required: true,
    },
    {
        key: 'investment_ratio_source',
        label: 'Source: Investment Ratio',
        type: 'text',
        required: false,
    },
];

const SUGGESTED_VALUES = {
    discount_rate: 6.70,
    inflation_rate: 5.15,
    interest_rate: 7.75,
    investment_ratio: 0.5,
};

const INITIAL_STATE = Object.fromEntries(
    FINANCIAL_FIELDS.map((f) => [f.key, f.type === 'text' ? '' : ''])
);

const REQUIRED_KEYS = new Set(
    FINANCIAL_FIELDS.filter((f) => f.required).map((f) => f.key)
);

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
    return (
        <h5 className="mb-4 fw-bold pb-2 mt-4" style={{ borderBottom: '1px solid var(--app-border-dark)', fontSize: '1rem', color: 'var(--app-text-primary)', transition: 'all 0.3s' }}>
            {title}
        </h5>
    );
}

function FieldHint({ text }) {
    if (!text) return null;
    return (
        <div style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: '8px' }}>
            {text}
        </div>
    );
}

function TextField({ field, value, onChange }) {
    const { key, label, hint, required } = field;
    return (
        <div className="mb-4">
            <label htmlFor={key} className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            <FieldHint text={hint} />
            <input
                id={key}
                type="text"
                value={value || ''}
                onChange={(e) => onChange(key, e.target.value)}
                className="form-control"
                placeholder="Source information..."
            />
        </div>
    );
}

function NumberField({ field, value, onChange, hasError }) {
    const { key, label, hint, required, min, max, step, unit } = field;
    return (
        <div className="mb-4">
            <label htmlFor={key} className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            <FieldHint text={hint} />
            <div className={`input-group ${hasError ? 'is-invalid' : ''}`}>
                <input
                    id={key}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value || ''}
                    onChange={(e) => onChange(key, e.target.value)}
                    className={`form-control ${hasError ? 'is-invalid' : ''}`}
                />
                {unit && (
                    <span className="input-group-text border-start-0" style={{ fontSize: '0.8rem', backgroundColor: 'var(--app-bg-alt)', borderColor: 'var(--app-border-mid)' }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const FinancialData = ({ data, onUpdate, controller }) => {
    const [form, setForm] = useState(data || INITIAL_STATE);
    const [errors, setErrors] = useState(new Set());
    const [validationMsg, setValidationMsg] = useState('');

    // Sync local state if prop changes (e.g. from global storage)
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setForm(prev => ({ ...prev, ...data }));
        }
    }, [data]);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = useCallback((key, value) => {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            // Move onUpdate OUT of the setter to avoid React warning/crash
            setTimeout(() => {
                if (onUpdate) onUpdate(next);
            }, 0);
            return next;
        });

        // Clear errors if the field becomes valid
        if (REQUIRED_KEYS.has(key)) {
            setErrors((prev) => {
                const next = new Set(prev);
                if (value && value.toString().trim() && Number(value) > 0) {
                    next.delete(key);
                }
                return next;
            });
        }
        setValidationMsg('');
    }, [onUpdate]);

    const handleLoadSuggested = () => {
        const nextForm = {
            ...form,
            ...Object.fromEntries(
                Object.entries(SUGGESTED_VALUES).map(([k, v]) => [k, String(v)])
            )
        };
        setForm(nextForm);
        if (onUpdate) onUpdate(nextForm);
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Financial: Suggested values applied.');
    };

    const handleClearAll = () => {
        setForm(INITIAL_STATE);
        if (onUpdate) onUpdate(INITIAL_STATE);
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Financial: All fields cleared.');
    };

    const hasError = (key) => errors.has(key);

    return (
        <div style={{ padding: '24px', maxWidth: '800px', color: 'var(--app-text-primary)' }}>
            <SectionHeader title="Economic Parameters" />

            {FINANCIAL_FIELDS.map((field) => (
                field.type === 'text' ? (
                    <TextField
                        key={field.key}
                        field={field}
                        value={form[field.key]}
                        onChange={handleChange}
                    />
                ) : (
                    <NumberField
                        key={field.key}
                        field={field}
                        value={form[field.key]}
                        onChange={handleChange}
                        hasError={hasError(field.key)}
                    />
                )
            ))}

            {/* ── Buttons ─────────────────────────────────────────────────── */}
            <div className="d-flex gap-3 mt-4 mb-3">
                <button
                    className="btn flex-grow-1 py-2 fw-bold"
                    style={{ backgroundColor: 'var(--app-primary-accent)', color: '#fff', border: 'none', borderRadius: '8px', transition: 'all 0.2s' }}
                    onClick={handleLoadSuggested}
                    onMouseEnter={(e) => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }}
                >
                    Load Suggested Values
                </button>
                <button
                    className="btn flex-grow-1 py-2 fw-bold"
                    style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)', borderRadius: '8px', transition: 'all 0.2s' }}
                    onClick={handleClearAll}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--app-border-light)'; e.target.style.color = 'var(--app-text-primary)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--app-bg-alt)'; e.target.style.color = 'var(--app-text-secondary)'; }}
                >
                    Clear All
                </button>
            </div>

            {validationMsg && (
                <div className="alert alert-danger p-2 mt-3 d-flex align-items-center" style={{ fontSize: '0.85rem', borderRadius: '8px' }} role="alert">
                    <span className="me-2">⚠</span> {validationMsg}
                </div>
            )}
        </div>
    );
};

export { FinancialData as default };
export { REQUIRED_KEYS, INITIAL_STATE, SUGGESTED_VALUES };
