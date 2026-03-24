import React from 'react';
import { Table, Button, Dropdown } from 'react-bootstrap';

const EmissionsTable = ({ title, data = [] }) => {
    return (
        <div className="mb-4">
            <h6 className="fw-bold mb-3" style={{ fontSize: '0.9rem', color: '#ffffff' }}>{title}</h6>
            <div className="table-responsive" style={{ borderRadius: '4px', border: '1px solid var(--app-border-mid)' }}>
                <Table hover variant="dark" className="m-0" style={{ fontSize: '0.85rem', backgroundColor: 'var(--app-bg-card)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid var(--app-border-dark)' }}>
                            <th className="fw-normal text-light">Category</th>
                            <th className="fw-normal text-light">Material</th>
                            <th className="fw-normal text-light">Qty (unit)</th>
                            <th className="fw-normal text-light">Conv. Factor</th>
                            <th className="fw-normal text-light">Emission</th>
                            {title.includes("Included") ? <th className="fw-normal text-light">Total kgCO2e</th> : <th className="fw-normal text-light">Reason</th>}
                            <th className="fw-normal text-light">Warning</th>
                            <th className="fw-normal text-light">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-muted" style={{ backgroundColor: 'transparent' }}>
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx}>
                                    {/* Data rows would go here */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

const MaterialEmissions = () => {
    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <div className="p-4" style={{ color: 'var(--app-text-primary)' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex gap-4" style={{ fontSize: '0.9rem' }}>
                    <span>Total: <span className="fw-bold">0.00 kgCO2e</span></span>
                    <span>Included: <span className="fw-bold">0 of 0 items</span></span>
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

            <EmissionsTable title="Included in Carbon Calculation" />
            <EmissionsTable title="Excluded from Carbon Calculation" />
        </div>
    );
};

export default MaterialEmissions;
