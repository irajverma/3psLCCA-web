import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { FaExclamationTriangle, FaCheckCircle, FaFileDownload } from 'react-icons/fa';

const Outputs = ({ addLog, isLocked, navTrigger }) => {
    const [view, setView] = useState('validation'); // 'validation' or 'results'
    const [analysisPeriod, setAnalysisPeriod] = useState(100);

    useEffect(() => {
        // Reset to validation view whenever a navigation trigger occurs (e.g. clicking "Calculate" in navbar)
        setView('validation');
    }, [navTrigger]);

    // Mock Validation Data
    const validationCategories = [
        {
            title: "CARBON EMISSION DATA",
            issues: [
                "Material Emissions: 4 items excluded - missing emission factor data.",
                "Machinery Emissions: Total machinery emissions is 0 kgCO₂e - lumpsum fuel and electricity values are zero."
            ]
        },
        {
            title: "BRIDGE DATA",
            issues: [
                "Carriageway width is very small - verify"
            ]
        },
        {
            title: "TRAFFIC DATA",
            issues: [
                "Road Rise is 0 or unusually high - please verify the value",
                "Road Fall is 0 or unusually high - please verify the value"
            ]
        },
        {
            title: "RECYCLING",
            issues: [
                "22 items excluded - missing recyclability % or scrap rate data."
            ]
        }
    ];

    // Mock Results Data
    const summaryCards = [
        { title: "TOTAL LIFE CYCLE COST (YEAR)", value: "5,67,94,440", subtitle: "INR", desc: "A Comprehensive Analysis of Total Life-Cycle Expenditures evaluated at the assessment year." },
        { title: "INITIAL COST", value: "3,46,81,526", subtitle: "INR", desc: "Cumulative total of construction, economic, social, and environmental costs incurred during the initial phase." },
        { title: "FUTURE COST", value: "2,21,12,914", subtitle: "INR", desc: "Cumulative cost expected for maintenance, repairs, replacement and demolition." }
    ];

    const pieData = [
        { name: 'Economic', value: 34.68, color: '#9acd32' },
        { name: 'Environmental', value: 0.54, color: '#4caf50' },
        { name: 'Social', value: 21.56, color: '#f39c12' }
    ];

    const barData = [
        { name: 'Initial', value: 34.68, color: '#9ca3af' },
        { name: 'Use & Recon', value: '#9acd32' },
        { name: 'End-of-Life', value: 0.55, color: '#f39c12' }
    ];

    const tableData = [
        { stage: "Initial Stage", economic: 13.74, environmental: 0.37, social: 20.57, total: 34.68 },
        { stage: "Use Stage", economic: 4.05, environmental: 0.02, social: 5.21, total: 9.28 },
        { stage: "Reconstruction Sta", economic: 4.02, environmental: 0.13, social: 8.12, total: 12.27 },
        { stage: "End-of-Life Stage", economic: -0.37, environmental: 0.01, social: 0.91, total: 0.55 },
        { stage: "Grand Total", economic: 21.44, environmental: 0.54, social: 34.82, total: 56.79 }
    ];

    const handleProceed = () => {
        addLog("Starting calculation process...");
        setTimeout(() => {
            setView('results');
            addLog("Calculation complete. Results generated.");
        }, 1500);
    };

    const handleDownloadReport = () => {
        addLog("Generating report file...");
        // Mock download
        const element = document.createElement("a");
        const file = new Blob(["LCCA Calculation Report Content Placeholder"], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "LCCA_Report.txt";
        document.body.appendChild(element);
        element.click();
        addLog("Report file downloaded.");
    };

    const renderValidation = () => (
        <div className="p-4" style={{ color: 'var(--app-text-primary)', position: 'relative' }}>
            <h2 className="mb-4" style={{ color: 'var(--app-primary-accent)' }}>Outputs</h2>
            
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold" style={{ color: 'var(--app-text-primary)' }}>Analysis Period *</Form.Label>
                <div className="mb-2" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>Total time horizon used for life cycle cost evaluation.</div>
                <Form.Control 
                    type="text" 
                    disabled={isLocked}
                    value={`${analysisPeriod} (years)`}
                    onChange={(e) => setAnalysisPeriod(parseInt(e.target.value) || 0)}
                    style={{ backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)', color: 'var(--app-input-text)', opacity: isLocked ? 0.6 : 1 }}
                />
            </Form.Group>

            <Button 
                variant="outline-primary" 
                className="mb-4"
                disabled={isLocked}
                style={{ borderColor: 'var(--app-primary-accent)', color: 'var(--app-primary-accent)', opacity: isLocked ? 0.5 : 1 }}
            >
                Validate ▸
            </Button>

            <div className="mb-4" style={{ color: '#f39c12', fontSize: '0.9rem' }}>
                <FaExclamationTriangle className="me-2" />
                Warnings- review before proceeding
            </div>

            {validationCategories.map((cat, idx) => (
                <Card key={idx} className="mb-3" style={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-light)' }}>
                    <Card.Body className="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 className="mb-3" style={{ color: '#73a5af', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: '700' }}>{cat.title}</h6>
                            {cat.issues.map((issue, iIdx) => (
                                <div key={iIdx} className="d-flex align-items-center mb-2" style={{ fontSize: '0.9rem', color: 'var(--app-text-primary)' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f39c12', display: 'inline-block', marginRight: '10px', flexShrink: 0 }}></span>
                                    {issue}
                                </div>
                            ))}
                        </div>
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            disabled={isLocked}
                            style={{ fontSize: '0.75rem', borderColor: 'var(--app-border-dark)', color: 'var(--app-text-secondary)' }}
                        >
                            Fix Issues →
                        </Button>
                    </Card.Body>
                </Card>
            ))}

            <Button 
                className="w-100 mt-4 py-2" 
                disabled={isLocked}
                style={{ backgroundColor: 'var(--app-primary-accent)', border: 'none', color: '#000', fontWeight: 'bold', opacity: isLocked ? 0.5 : 1 }}
                onClick={handleProceed}
            >
                Proceed with Calculation ▸
            </Button>
        </div>
    );

    const renderResults = () => (
        <div className="p-4" style={{ color: 'var(--app-text-primary)', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: 'var(--app-primary-accent)' }}>Outputs</h2>
                <Button 
                    variant="outline-primary" 
                    onClick={handleDownloadReport} 
                    disabled={isLocked}
                    style={{ borderColor: 'var(--app-primary-accent)', color: 'var(--app-primary-accent)', opacity: isLocked ? 0.5 : 1 }}
                >
                    <FaFileDownload className="me-2" /> Download Report
                </Button>
            </div>

            <h4 className="mb-4" style={{ color: 'var(--app-text-primary)' }}>At a Glance</h4>
            <Row className="mb-5">
                {summaryCards.map((card, idx) => (
                    <Col key={idx} md={4}>
                        <Card style={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-light)', height: '100%' }}>
                            <Card.Body>
                                <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>{card.title}</div>
                                <div className="d-flex align-items-baseline gap-2 mb-2">
                                    <span style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)' }}>{card.subtitle}</span>
                                    <h3 className="mb-0" style={{ color: 'var(--app-primary-accent)', fontWeight: '700' }}>{card.value}</h3>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--app-text-secondary)', lineHeight: '1.5' }}>{card.desc}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h4 className="mb-3" style={{ color: 'var(--app-text-primary)' }}>Life cycle cost distribution</h4>
            <p className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', lineHeight: '1.6' }}>
                These charts illustrate the distribution of project costs. The Sustainability Matrix disaggregates costs across the Economic, Environmental, and Social Pillars. 
                The aggregation chart compares the relative weight of three lifecycle phases: Initial Construction, the combined Use/Maintenance/Reconstruction stage, and the final End-of-Life phase.
            </p>

            <Row className="mb-5">
                <Col md={6}>
                    <Card style={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-light)', padding: '20px' }}>
                        <h5 className="text-center mb-4" style={{ color: 'var(--app-text-primary)' }}>Sustainability Matrix</h5>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-mid)', color: 'var(--app-text-primary)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-3">
                            <Form.Check type="checkbox" label="Show Percentage Mode" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }} />
                            <Form.Check type="checkbox" label="See stage wise" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }} />
                        </div>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card style={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-light)', padding: '20px' }}>
                        <h5 className="text-center mb-4" style={{ color: 'var(--app-text-primary)' }}>Lifecycle Disaggregation</h5>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border-light)" />
                                    <XAxis dataKey="name" stroke="var(--app-text-muted)" fontSize={12} />
                                    <YAxis stroke="var(--app-text-muted)" fontSize={12} />
                                    <Tooltip cursor={{fill: 'rgba(154, 205, 50, 0.05)'}} contentStyle={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-mid)', color: 'var(--app-text-primary)' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || 'var(--app-primary-accent)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-3">
                            <Form.Check type="checkbox" label="Show pillar wise" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <h4 className="mb-3" style={{ color: 'var(--app-text-primary)' }}>Consolidated stage summary</h4>
            <p className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', lineHeight: '1.6' }}>
                A consolidated presentation of costs across the three pillars (economic, social, and environmental) for each lifecycle stage.
                This table facilitates the identification of phases that bear the most substantial burden.
            </p>
            
            <Table responsive className="custom-output-table mb-5" style={{ color: 'var(--app-text-primary)', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                <thead>
                    <tr style={{ color: 'var(--app-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        <th style={{ border: 'none' }}>Stage</th>
                        <th style={{ border: 'none' }}>Economic (M INR)</th>
                        <th style={{ border: 'none' }}>Environmental (M INR)</th>
                        <th style={{ border: 'none' }}>Social (M INR)</th>
                        <th style={{ border: 'none' }}>Stage Total (M INR)</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, idx) => (
                        <tr key={idx} style={{ backgroundColor: 'var(--app-bg-card)', fontSize: '0.9rem' }}>
                            <td style={{ padding: '15px', border: 'none', fontWeight: '500' }}>{row.stage}</td>
                            <td style={{ padding: '15px', border: 'none', backgroundColor: row.stage === 'Grand Total' ? 'transparent' : 'rgba(154, 205, 50, 0.15)', color: 'var(--app-text-primary)' }}>{row.economic}</td>
                            <td style={{ padding: '15px', border: 'none', backgroundColor: row.stage === 'Grand Total' ? 'transparent' : 'rgba(154, 205, 50, 0.25)', color: 'var(--app-text-primary)' }}>{row.environmental}</td>
                            <td style={{ padding: '15px', border: 'none', backgroundColor: row.stage === 'Grand Total' ? 'transparent' : 'rgba(154, 205, 50, 0.35)', color: 'var(--app-text-primary)' }}>{row.social}</td>
                            <td style={{ padding: '15px', border: 'none', fontWeight: 'bold' }}>{row.total}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4 className="mb-4" style={{ color: 'var(--app-text-primary)' }}>Itemized detail</h4>
            <Card style={{ backgroundColor: 'var(--app-bg-card)', border: '1px solid var(--app-border-light)' }}>
                <Card.Body>
                    <Table responsive className="mb-0" style={{ color: 'var(--app-text-primary)' }}>
                        <thead>
                            <tr style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)' }}>
                                <th>Stage</th>
                                <th>Cost Item</th>
                                <th className="text-end">Value (INR)</th>
                                <th style={{ width: '40%' }}>Relative Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowSpan="3" style={{ verticalAlign: 'middle', borderRight: '1px solid var(--app-border-light)', fontSize: '0.75rem', writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--app-text-muted)' }}>Costs</td>
                                <td style={{ padding: '15px' }}>Construction Cost</td>
                                <td className="text-end fw-bold" style={{ padding: '15px' }}>1,35,10,517.11</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ height: '20px', width: '80%', backgroundColor: 'var(--app-primary-accent)', borderRadius: '2px' }}></div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '15px' }}>Loan Interest</td>
                                <td className="text-end fw-bold" style={{ padding: '15px' }}>2,26,864.10</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ height: '20px', width: '5%', backgroundColor: 'var(--app-primary-accent)', borderRadius: '2px', opacity: 0.6 }}></div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Button 
                variant="outline-secondary" 
                className="mt-4" 
                disabled={isLocked}
                style={{ color: 'var(--app-text-secondary)', borderColor: 'var(--app-border-mid)' }}
                onClick={() => setView('validation')}
            >
                ← Back to Validation
            </Button>
        </div>
    );

    return (
        <div style={{ minHeight: '100%', backgroundColor: 'var(--app-bg-main)', position: 'relative' }}>
            <style>{`
                .custom-output-table td { border-bottom: 1px solid var(--app-border-light) !important; }
                .recharts-legend-item-text { color: var(--app-text-primary) !important; }
                .lock-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0,0,0,0.05);
                    z-index: 10;
                    cursor: not-allowed;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    padding-top: 100px;
                }
            `}</style>
            {isLocked && (
                <div className="lock-overlay">
                    <div style={{ 
                        backgroundColor: 'var(--app-bg-card)', 
                        border: '2px solid var(--app-primary-accent)', 
                        color: 'var(--app-primary-accent)', 
                        padding: '12px 24px', 
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <FaExclamationTriangle /> PROJECT LOCKED - READ ONLY MODE
                    </div>
                </div>
            )}
            {view === 'validation' ? renderValidation() : renderResults()}
        </div>
    );
};

export default Outputs;
