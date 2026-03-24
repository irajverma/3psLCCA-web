import React, { useState, useEffect } from 'react';
import './ConstructionWorkData.css';
import Foundation from './foundation/Foundation';
import SubStructure from './substructure/SubStructure';
import SuperStructure from './superstructure/SuperStructure';
import Miscellaneous from './miscellaneous/Miscellaneous';

const TABS = [
    { key: 'Foundation',    label: 'Foundation',     component: Foundation },
    { key: 'SubStructure',  label: 'Sub Structure',  component: SubStructure },
    { key: 'SuperStructure',label: 'Super Structure', component: SuperStructure },
    { key: 'Miscellaneous', label: 'Miscellaneous',  component: Miscellaneous },
];

const ConstructionWorkData = ({ controller, projectName = 'Active Analysis', initialTab = 'Foundation' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const ActiveComponent = TABS.find((t) => t.key === activeTab)?.component ?? Foundation;

    const handleUploadExcel = () => {
        controller?.engine?._log('Construction: Upload Excel clicked.');
    };

    const handleTrash = () => {
        controller?.engine?._log('Construction: Trash clicked.');
    };

    return (
        <div className="d-flex flex-column h-100 overflow-hidden" style={{ backgroundColor: 'var(--app-bg-main)', color: 'var(--app-text-primary)' }}>
            {/* Header */}
            <div className="d-flex align-items-start justify-content-between border-bottom" style={{ padding: '14px 20px 10px', backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-light) !important', flexShrink: 0 }}>
                <div>
                    <h5 className="m-0 fw-bold" style={{ fontSize: '0.95rem', color: 'var(--app-text-primary)' }}>Structure Management</h5>
                    <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                        Project: <span className="fw-bold" style={{ color: 'var(--app-primary-accent)' }}>{projectName}</span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)' }}
                        onClick={handleUploadExcel}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--app-border-light)'; e.target.style.color = 'var(--app-text-primary)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--app-bg-alt)'; e.target.style.color = 'var(--app-text-secondary)'; }}
                    >
                        Upload Excel
                    </button>
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--app-bg-alt)', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-mid)' }}
                        onClick={handleTrash}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--app-border-light)'; e.target.style.color = 'var(--app-text-primary)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--app-bg-alt)'; e.target.style.color = 'var(--app-text-secondary)'; }}
                    >
                        Trash
                    </button>
                </div>
            </div>

            {/* Tab bar */}
            <div className="d-flex border-bottom px-3" style={{ backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-light) !important', flexShrink: 0 }}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            className={`btn rounded-0 px-3 py-2 border-0 fw-medium ${isActive ? 'fw-bold' : ''}`}
                            style={{
                                color: isActive ? 'var(--app-primary-accent)' : 'var(--app-text-secondary)',
                                borderBottom: isActive ? '2px solid var(--app-primary-accent)' : '2px solid transparent',
                                fontSize: '0.82rem',
                                whiteSpace: 'nowrap',
                                backgroundColor: 'transparent'
                            }}
                            onClick={() => setActiveTab(tab.key)}
                            onMouseEnter={(e) => { if (!isActive) e.target.style.color = 'var(--app-text-primary)'; }}
                            onMouseLeave={(e) => { if (!isActive) e.target.style.color = 'var(--app-text-secondary)'; }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Active tab content */}
            <div className="flex-grow-1 overflow-auto p-3 p-md-4">
                <ActiveComponent controller={controller} />
            </div>
        </div>
    );
};

export default ConstructionWorkData;
