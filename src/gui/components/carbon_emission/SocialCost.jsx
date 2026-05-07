import React, { useState, useEffect, useMemo } from 'react';
import { useProjectData } from '../../../contexts/ProjectDataContext';

const MODES = {
    NITI: "NITI Aayog",
    RICKE: "K. Ricke et al. (Country-Level)",
    CUSTOM: "Custom / Manual Override"
};

const SSP_OPTIONS = [
    "SSP1 (Sustainability)",
    "SSP2 (Middle of the Road)",
    "SSP3 (Regional Rivalry)",
    "SSP4 (Inequality)",
    "SSP5 (Fossil-fueled Development)",
];

const RCP_OPTIONS = [
    "RCP 2.6 (Low Warming)",
    "RCP 4.5 (Intermediate)",
    "RCP 6.0 (High)",
    "RCP 8.5 (Extreme)",
];

const RICKE_SCC_TABLE = {
    "SSP1 (Sustainability)|RCP 2.6 (Low Warming)": 0.085,
    "SSP1 (Sustainability)|RCP 4.5 (Intermediate)": 0.095,
    "SSP2 (Middle of the Road)|RCP 4.5 (Intermediate)": 0.110,
    "SSP2 (Middle of the Road)|RCP 6.0 (High)": 0.135,
    "SSP3 (Regional Rivalry)|RCP 8.5 (Extreme)": 0.185,
    "SSP5 (Fossil-fueled Development)|RCP 8.5 (Extreme)": 0.210,
};

const NITI_SCC_INR = 6.3936;

const SocialCost = ({ controller }) => {
    const { projectData, updateProjectData } = useProjectData();
    const [mode, setMode] = useState(MODES.NITI);
    const [currency, setCurrency] = useState('INR');
    
    const [inrRate, setInrRate] = useState(1.0);
    const [usdRate, setUsdRate] = useState(83.0);
    const [ssp, setSsp] = useState(SSP_OPTIONS[1]);
    const [rcp, setRcp] = useState(RCP_OPTIONS[1]);
    const [customScc, setCustomScc] = useState(0.05);

    useEffect(() => {
        const genInfo = projectData.general_info || {};
        if (genInfo.project_currency) setCurrency(genInfo.project_currency);

        const carbonData = projectData.carbon_emission_data || {};
        const socialData = carbonData.social_cost_data || {};
        
        if (socialData.mode) setMode(socialData.mode);
        if (socialData.inr_rate) setInrRate(socialData.inr_rate);
        if (socialData.usd_rate) setUsdRate(socialData.usd_rate);
        if (socialData.ssp) setSsp(socialData.ssp);
        if (socialData.rcp) setRcp(socialData.rcp);
        if (socialData.custom_scc) setCustomScc(socialData.custom_scc);
    }, [projectData]);

    const currentScc = useMemo(() => {
        if (mode === MODES.NITI) return NITI_SCC_INR * inrRate;
        if (mode === MODES.RICKE) {
            const key = `${ssp}|${rcp}`;
            const baseUsd = RICKE_SCC_TABLE[key] || 0.1;
            return baseUsd * usdRate;
        }
        return customScc;
    }, [mode, inrRate, usdRate, ssp, rcp, customScc]);

    const saveChanges = (updates) => {
        const prev = projectData.carbon_emission_data || {};
        updateProjectData('carbon_emission_data', {
            ...prev,
            social_cost_data: {
                mode,
                inr_rate: inrRate,
                usd_rate: usdRate,
                ssp,
                rcp,
                custom_scc: customScc,
                calculated_scc_local: currentScc,
                currency,
                ...updates
            }
        });
    };

    const handleClearAll = () => {
        setMode(MODES.NITI);
        setInrRate(1.0);
        setUsdRate(83.0);
        setSsp(SSP_OPTIONS[1]);
        setRcp(RCP_OPTIONS[1]);
        setCustomScc(0.05);
        saveChanges({
            mode: MODES.NITI,
            inr_rate: 1.0,
            usd_rate: 83.0,
            ssp: SSP_OPTIONS[1],
            rcp: RCP_OPTIONS[1],
            custom_scc: 0.05
        });
    };

    return (
        <div className="social-cost p-4 text-light" style={{ backgroundColor: 'transparent' }}>
            <div className="section-container mb-5">
                <h5 className="fw-bold mb-3 mt-2" style={{ color: 'var(--app-text-primary)', fontSize: '1.25rem' }}>Economic Valuation Methodology</h5>
                <hr className="bg-secondary opacity-25 mb-4" />

                <div className="methodology-selection mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>Cost Methodology</span>
                    </div>
                    <div className="instruction-text mb-3" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>
                        Choose between government standards or peer-reviewed scientific models. 
                        <i className="bi bi-info-circle ms-2" style={{ color: '#0dcaf0', fontSize: '0.8rem' }}></i>
                    </div>
                    
                    <select 
                        className="form-select custom-select-box py-3 px-3 mb-4" 
                        value={mode} 
                        onChange={e => { setMode(e.target.value); saveChanges({ mode: e.target.value }); }}
                    >
                        {Object.values(MODES).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <div className="calculation-details mt-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        <div className="d-block mb-1">
                            <span className="fw-bold">Selected Mode:</span> {mode}
                        </div>
                        <div className="d-block mb-1">
                            <span className="fw-bold">Base Price:</span> {mode === MODES.NITI ? NITI_SCC_INR.toFixed(3) : (currentScc / (mode === MODES.RICKE ? usdRate : 1)).toFixed(3)} INR/kgCO₂e
                        </div>
                        <div className="d-block mb-1">
                            <span className="fw-bold">Conversion Rate:</span> {inrRate.toFixed(3)} INR/INR
                        </div>
                        <div className="d-block mb-3">
                            <span className="fw-bold">Effective SCC:</span> {currentScc.toFixed(3)} INR/kgCO₂e
                        </div>
                        
                        <div className="mt-4 pt-2 mb-5" style={{ color: 'var(--app-text-secondary)', fontSize: '0.85rem' }}>
                            Base Value: <span className="fw-bold">{NITI_SCC_INR.toFixed(4)} INR/kgCO₂e</span> ({mode}, 2023)
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-container mt-5">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--app-text-primary)', fontSize: '1.1rem' }}>Regional Valuation Adjustment</h5>
                <hr className="bg-secondary opacity-25 mb-4" />

                <div className="adjustment-details mb-5" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <div className="d-block">
                        {mode} Base: <span className="fw-bold">{currentScc.toFixed(3)} INR/kgCO₂e</span>
                    </div>
                    <div className="d-block">
                        Adjusted Local Cost: <span className="fw-bold">{currentScc.toFixed(3)} INR/kgCO₂e</span>
                    </div>
                </div>

                <button 
                    className="btn w-100 py-3 mt-5 border-0 rounded-3 shadow-sm clear-all-btn"
                    onClick={handleClearAll}
                    style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-primary)' }}
                >
                    Clear All
                </button>
            </div>

            {/* Hidden inputs/settings for other modes if selected */}
            {mode !== MODES.NITI && (
                <div className="mt-5 p-4 rounded bg-dark-subtle border border-secondary border-opacity-25 shadow-sm" style={{ borderStyle: 'dashed' }}>
                    <h6 className="text-secondary small text-uppercase fw-bold mb-4">Additional Pathway Parameters</h6>
                    <div className="row g-4">
                        {mode === MODES.RICKE && (
                            <>
                                <div className="col-md-6">
                                    <label className="form-label extra-small fw-bold text-secondary">USD Exchange Rate</label>
                                    <input type="number" className="form-control bg-dark border-secondary text-light sm" value={usdRate} onChange={e => { setUsdRate(parseFloat(e.target.value)); saveChanges({ usd_rate: parseFloat(e.target.value) }); }} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label extra-small fw-bold text-secondary">SSP</label>
                                    <select className="form-select bg-dark border-secondary text-light sm" value={ssp} onChange={e => { setSsp(e.target.value); saveChanges({ ssp: e.target.value }); }}>{SSP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label extra-small fw-bold text-secondary">RCP</label>
                                    <select className="form-select bg-dark border-secondary text-light sm" value={rcp} onChange={e => { setRcp(e.target.value); saveChanges({ rcp: e.target.value }); }}>{RCP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
                                </div>
                            </>
                        )}
                        {mode === MODES.CUSTOM && (
                            <div className="col-md-12">
                                <label className="form-label extra-small fw-bold text-secondary">Custom Shadow Price ({currency}/kgCO₂e)</label>
                                <input type="number" className="form-control bg-dark border-secondary text-light lg" value={customScc} onChange={e => { setCustomScc(parseFloat(e.target.value)); saveChanges({ custom_scc: parseFloat(e.target.value) }); }} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .social-cost {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .custom-select-box {
                    background-color: var(--app-bg-card) !important;
                    color: var(--app-text-primary) !important;
                    border: 1px solid #9adc32 !important;
                    border-radius: 8px !important;
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%239adc32' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                    background-repeat: no-repeat !important;
                    background-position: right 1rem center !important;
                    background-size: 16px 12px !important;
                }
                .custom-select-box:focus {
                    box-shadow: 0 0 0 1px rgba(154, 205, 50, 0.5) !important;
                }
                .clear-all-btn {
                    background-color: var(--app-bg-alt);
                    color: var(--app-text-primary);
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    transition: all 0.2s ease;
                }
                .clear-all-btn:hover {
                    background-color: var(--app-bg-card);
                    color: #9adc32;
                }
                .extra-small { font-size: 0.7rem; }
            `}</style>
        </div>
    );
};

export default SocialCost;
