import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import AddTransportLogModal from './AddTransportLogModal';

const TransportationEmissions = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="p-4" style={{ color: 'var(--app-text-primary)' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex gap-4" style={{ fontSize: '0.9rem' }}>
                    <span>Total Transport Emissions: <span className="fw-bold">0.00 kgCO2e</span></span>
                    <span>Vehicles: <span className="fw-bold">0</span></span>
                </div>
                <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => setShowDetails(!showDetails)}
                    style={{ fontSize: '0.8rem', backgroundColor: '#333', borderColor: '#444', color: '#fff' }}
                    className="d-flex align-items-center gap-1"
                >
                    {showDetails ? 'Hide Details' : 'Show Details'} {showDetails ? '▲' : '▼'}
                </Button>
            </div>

            {showDetails && (
                <div className="py-3 mb-2" style={{ borderBottom: '1px solid var(--app-border-light)', fontSize: '0.9rem', color: 'var(--app-text-secondary)' }}>
                    <span className="me-3">Foundation: 0.00</span> | 
                    <span className="mx-3">Sub Structure: 0.00</span> | 
                    <span className="mx-3">Super Structure: 0.00</span> | 
                    <span className="mx-3">Misc: 0.00</span> |
                </div>
            )}

            <hr style={{ borderColor: 'var(--app-border-dark)', opacity: 0.5 }} className="mt-2 mb-4" />

            <Button 
                variant="outline-secondary" 
                size="sm" 
                className="d-flex align-items-center gap-2 mb-3 hover-opacity border-secondary"
                style={{ fontSize: '0.85rem', backgroundColor: '#333', color: '#ffffff' }}
                onClick={() => setShowAddModal(true)}
            >
                + Add Vehicle
            </Button>

            <AddTransportLogModal 
                show={showAddModal} 
                handleClose={() => setShowAddModal(false)} 
            />
        </div>
    );
};

export default TransportationEmissions;
