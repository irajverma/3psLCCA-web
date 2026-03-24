import React, { useState, useCallback } from 'react';
import './FinancialData.css';

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_DOCS_URL = 'https://yourdocs.com/financial/';

const FINANCIAL_FIELDS = [
    {
        key: 'discount_rate',
        label: 'Discount Rate',
        hint: 'The rate used to convert future cash flows into present value. It reflects the time value of money and investment risk.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
        docSlug: 'discount-rate',
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
        docSlug: 'inflation-rate',
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
        docSlug: 'interest-rate',
    },
    {
        key: 'investment_ratio',
        label: 'Investment Ratio',
        hint: 'Proportion of total cost financed through investment (0–1). Example: 0.5 means 50%.',
        type: 'float',
        min: 0.0,
        max: 1.0,
        step: 0.0001,
        unit: null,
        required: true,
        docSlug: 'investment-ratio',
    },
    {
        key: 'design_life',
        label: 'Design Life',
        hint: 'Expected operational lifetime of the system in years.',
        type: 'int',
        min: 0,
        max: 999,
        step: 1,
        unit: '(years)',
        required: true,
        docSlug: 'design-life',
    },
    {
        key: 'duration_of_construction',
        label: 'Duration of Construction',
        hint: 'Time required to complete construction before operation begins.',
        type: 'float',
        min: 0.0,
        max: 999.0,
        step: 0.01,
        unit: '(years)',
        required: false,
        docSlug: 'duration-of-construction',
    },
    {
        key: 'analysis_period',
        label: 'Analysis Period',
        hint: 'Total time horizon used for financial evaluation.',
        type: 'int',
        min: 0,
        max: 999,
        step: 1,
        unit: '(years)',
        required: true,
        docSlug: 'analysis-period',
    },
];

const SUGGESTED_VALUES = {
    discount_rate: 6.70,
    inflation_rate: 5.15,
    interest_rate: 7.75,
    investment_ratio: 0.5,
    design_life: 50,
    duration_of_construction: 0.0,
    analysis_period: 50,
};

const INITIAL_STATE = Object.fromEntries(
    FINANCIAL_FIELDS.map((f) => [f.key, ''])
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

function NumberField({ field, value, onChange, hasError }) {
    const { key, label, hint, docSlug, required, min, max, step, unit } = field;
    return (
        <div className="mb-4">
            <label htmlFor={key} className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                {label}{required && <span className="text-danger"> *</span>}
            </label>
            <FieldHint text={hint} docSlug={docSlug} />
            <div className={`input-group ${hasError ? 'is-invalid' : ''}`}>
                <input
                    id={key}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(key, e.target.value)}
                    className={`form-control ${hasError ? 'is-invalid' : ''}`}
                />
                {unit && (
                    <span className="input-group-text border-start-0" style={{ fontSize: '0.8rem', backgroundColor: 'var(--app-input-bg)', borderColor: 'var(--app-input-border)' }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const FinancialData = ({ controller }) => {
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

    const handleLoadSuggested = () => {
        setForm((prev) => ({
            ...prev, ...Object.fromEntries(
                Object.entries(SUGGESTED_VALUES).map(([k, v]) => [k, String(v)])
            )
        }));
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Financial: Suggested values applied.');
    };

    const handleClearAll = () => {
        setForm(INITIAL_STATE);
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Financial: All fields cleared.');
    };

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const newErrors = new Set();
        const missing = [];

        REQUIRED_KEYS.forEach((key) => {
            const val = form[key];
            const isEmpty = val === '' || val === null || val === undefined;
            const isZero = !isEmpty && Number(val) <= 0;
            if (isEmpty || isZero) {
                newErrors.add(key);
                const field = FINANCIAL_FIELDS.find((f) => f.key === key);
                missing.push(field?.label ?? key);
            }
        });

        setErrors(newErrors);
        if (newErrors.size > 0) {
            const msg = `Missing required financial data: ${missing.join(', ')}`;
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
            <SectionHeader title="Financial Parameters" />

            {FINANCIAL_FIELDS.map((field) => (
                <NumberField
                    key={field.key}
                    field={field}
                    value={form[field.key]}
                    onChange={handleChange}
                    hasError={hasError(field.key)}
                />
            ))}

            {/* ── Buttons ─────────────────────────────────────────────────── */}
            <div className="d-flex gap-2 mt-4 mb-3">
                <button
                    className="btn flex-grow-1"
                    style={{ backgroundColor: 'var(--app-primary-accent)', color: '#fff', border: '1px solid var(--app-primary-accent)' }}
                    onClick={handleLoadSuggested}
                    onMouseEnter={(e) => { e.target.style.opacity = '0.9'; }}
                    onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
                >
                    Load Suggested Values
                </button>
                <button
                    className="btn flex-grow-1"
                    style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)' }}
                    onClick={handleClearAll}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--app-border-light)'; e.target.style.color = 'var(--app-text-primary)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--app-bg-alt)'; e.target.style.color = 'var(--app-text-secondary)'; }}
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

export { FinancialData as default };
export { REQUIRED_KEYS, INITIAL_STATE, SUGGESTED_VALUES };
