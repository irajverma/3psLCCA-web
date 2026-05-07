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

const CustomDropdown = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-dropdown-container position-relative mb-4" ref={dropdownRef}>
            <div 
                className="custom-select-box py-3 px-3 d-flex justify-content-between align-items-center"
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    borderColor: isOpen ? '#9adc32' : 'rgba(255,255,255,0.1)',
                    boxShadow: isOpen ? '0 0 0 1px rgba(154, 205, 50, 0.5)' : 'none'
                }}
            >
                <span>{value}</span>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width="16" height="12">
                    <path fill='none' stroke='#9adc32' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isOpen ? 'm2 11 6-6 6 6' : 'm2 5 6 6 6-6'}/>
                </svg>
            </div>
            {isOpen && (
                <div 
                    className="position-absolute w-100 mt-1 rounded-3 shadow-lg overflow-hidden dropdown-menu-custom" 
                    style={{ 
                        backgroundColor: 'var(--app-bg-main)', 
                        zIndex: 1000, 
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    {options.map(o => (
                        <div 
                            key={o} 
                            className={`px-3 py-3 dropdown-item-custom ${value === o ? 'selected' : ''}`}
                            onClick={() => { onChange(o); setIsOpen(false); }}
                        >
                            {o}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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
                    </div>
                    
                    <CustomDropdown 
                        value={mode} 
                        options={Object.values(MODES)} 
                        onChange={val => { setMode(val); saveChanges({ mode: val }); }} 
                    />

                    <div className="calculation-details mt-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        <div className="d-block mb-1">
                            <span className="fw-bold">Selected Mode:</span> {mode}
                        </div>
                        <div className="d-block mb-1">
                            <span className="fw-bold">Base Price:</span> {mode === MODES.NITI ? NITI_SCC_INR.toFixed(3) : (currentScc / (mode === MODES.RICKE ? usdRate : 1)).toFixed(3)} {mode === MODES.RICKE ? 'USD' : 'INR'}/kgCO₂e
                        </div>
                        <div className="d-block mb-1">
                            <span className="fw-bold">Conversion Rate:</span> {mode === MODES.RICKE ? usdRate.toFixed(3) + ' INR/USD' : inrRate.toFixed(3) + ' INR/INR'}
                        </div>
                        <div className="d-block mb-3">
                            <span className="fw-bold">Effective SCC:</span> {currentScc.toFixed(3)} INR/kgCO₂e
                        </div>
                        
                        {mode === MODES.RICKE && (
                            <div className="mt-4 pt-2 mb-2" style={{ fontSize: '0.85rem' }}>
                                <span className="fw-bold">Reference:</span> Ricke, K., Drouet, L., Caldeira, K. et al. <i>Country-level social cost of carbon.</i> Nature Clim Change 8, 895-900 (2018). <a href="https://doi.org/10.1038/s41558-018-0282-y" target="_blank" rel="noopener noreferrer" style={{color: '#9adc32', textDecoration: 'none'}}>doi:10.1038/s41558-018-0282-y</a>
                            </div>
                        )}
                        {mode === MODES.NITI && (
                            <div className="mt-4 pt-2 mb-2" style={{ color: 'var(--app-text-secondary)', fontSize: '0.85rem' }}>
                                Base Value: <span className="fw-bold">{NITI_SCC_INR.toFixed(4)} INR/kgCO₂e</span> ({mode}, 2023)
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {mode === MODES.RICKE && (
                <div className="section-container mt-5 mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--app-text-primary)', fontSize: '1.1rem' }}>Climate & Socioeconomic Scenarios</h5>
                    <hr className="bg-secondary opacity-25 mb-4" />

                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>USD Conversion Rate</span>
                        </div>
                        <div className="instruction-text mb-3" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>
                            Conversion rate for international scientific model outputs.
                        </div>
                        <input 
                            type="number" 
                            className="form-control custom-input-box py-3 px-3 mb-4" 
                            value={usdRate} 
                            onChange={e => { setUsdRate(parseFloat(e.target.value)); saveChanges({ usd_rate: parseFloat(e.target.value) }); }}
                        />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>Socioeconomic Pathway (SSP)</span>
                        </div>
                        <div className="instruction-text mb-3" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>
                            Assumptions on future population, GDP, and energy use.
                        </div>
                        <CustomDropdown 
                            value={ssp} 
                            options={SSP_OPTIONS} 
                            onChange={val => { setSsp(val); saveChanges({ ssp: val }); }} 
                        />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>Climate Trajectory (RCP)</span>
                        </div>
                        <div className="instruction-text mb-3" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>
                            Representative Concentration Pathway for greenhouse gases.
                        </div>
                        <CustomDropdown 
                            value={rcp} 
                            options={RCP_OPTIONS} 
                            onChange={val => { setRcp(val); saveChanges({ rcp: val }); }} 
                        />
                    </div>

                    <div className="adjustment-details mt-4 mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                        <div className="d-block">
                            Scenario Baseline: <span className="fw-bold">${(currentScc / usdRate).toFixed(3)} USD/kgCO₂e</span>
                        </div>
                        <div className="d-block">
                            Adjusted Local Cost: <span className="fw-bold">{currentScc.toFixed(3)} INR/kgCO₂e</span>
                        </div>
                    </div>
                </div>
            )}

            {mode === MODES.CUSTOM && (
                <div className="section-container mt-5 mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--app-text-primary)', fontSize: '1.1rem' }}>Custom Parameters</h5>
                    <hr className="bg-secondary opacity-25 mb-4" />

                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>Custom Shadow Price ({currency}/kgCO₂e)</span>
                        </div>
                        <input 
                            type="number" 
                            className="form-control custom-input-box py-3 px-3 mb-4" 
                            value={customScc} 
                            onChange={e => { setCustomScc(parseFloat(e.target.value)); saveChanges({ custom_scc: parseFloat(e.target.value) }); }}
                        />
                    </div>
                </div>
            )}

            <button 
                className="btn w-100 py-3 mt-4 border-0 rounded-3 shadow-sm clear-all-btn"
                onClick={handleClearAll}
                style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-primary)' }}
            >
                Clear All
            </button>

            <style>{`
                .social-cost {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .custom-select-box, .custom-input-box {
                    background-color: var(--app-bg-card) !important;
                    color: var(--app-text-primary) !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    border-radius: 8px !important;
                    transition: all 0.2s ease;
                }
                .custom-select-box {
                    cursor: pointer;
                    user-select: none;
                }
                .custom-select-box:focus, .custom-input-box:focus {
                    border-color: #9adc32 !important;
                    box-shadow: 0 0 0 1px rgba(154, 205, 50, 0.5) !important;
                    outline: none !important;
                }
                .dropdown-item-custom {
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    color: var(--app-text-primary);
                }
                .dropdown-item-custom:hover {
                    background-color: var(--app-bg-alt);
                }
                .dropdown-item-custom.selected {
                    background-color: rgba(255, 255, 255, 0.05);
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
