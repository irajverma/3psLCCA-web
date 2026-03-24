import React, { useState } from 'react';
import MaterialEmissions from './widgets/MaterialEmissions';
import TransportationEmissions from './widgets/TransportationEmissions';

const TabButton = ({ label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'var(--app-bg-alt)' : 'transparent',
                border: 'none',
                color: active ? '#ffffff' : 'var(--app-text-secondary)',
                padding: '6px 16px',
                fontSize: '0.85rem',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.2s ease',
                outline: 'none',
                fontWeight: active ? '500' : 'normal'
            }}
            className="hover-opacity"
        >
            {label}
        </button>
    );
};

const CarbonEmissionContainer = ({ initialTab = 'Material Emissions' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        'Material Emissions',
        'Transportation Emissions',
        'Machinery Emissions',
        'Traffic Diversion Emissions',
        'Social Cost of Carbon'
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Material Emissions':
                return <MaterialEmissions />;
            case 'Transportation Emissions':
                return <TransportationEmissions />;
            default:
                return (
                    <div className="p-4 text-muted" style={{ fontSize: '0.9rem' }}>
                        {activeTab}
                    </div>
                );
        }
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: 'var(--app-bg-main)' }}>
            <div className="d-flex border-bottom px-2" style={{ backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-light)' }}>
                {tabs.map(tab => (
                    <TabButton 
                        key={tab} 
                        label={tab} 
                        active={activeTab === tab} 
                        onClick={() => setActiveTab(tab)} 
                    />
                ))}
            </div>
            <div className="flex-grow-1 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default CarbonEmissionContainer;
