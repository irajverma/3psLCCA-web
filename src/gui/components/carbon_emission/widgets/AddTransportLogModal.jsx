import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddTransportLogModal = ({ show, handleClose }) => {
    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="lg" 
            centered 
            backdrop="static"
            contentClassName="bg-dark text-light border-secondary shadow-lg rounded-3 overflow-hidden"
            style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
        >
            <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary py-3" style={{ backgroundColor: '#111111' }}>
                <Modal.Title style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '500' }}>Add Transport Log</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4" style={{ backgroundColor: '#121212' }}>
                <h5 className="mb-4 fw-bold" style={{ fontSize: '1.2rem', color: '#ffffff' }}>Step 1: Vehicle & Route Details</h5>

                <Form>
                    {/* VEHICLE TEMPLATE */}
                    <div className="mb-4">
                        <Form.Label className="text-muted small fw-bold mb-2 uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05rem' }}>VEHICLE TEMPLATE</Form.Label>
                        <Form.Select className="bg-dark text-light border-secondary shadow-none" style={{ fontSize: '0.9rem', backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                            <option>-- Select a Preset Template --</option>
                        </Form.Select>
                    </div>

                    <hr className="border-secondary mb-4" style={{ opacity: 0.2 }} />

                    {/* VEHICLE SPECIFICATIONS */}
                    <div className="mb-4">
                        <Form.Label className="text-muted small fw-bold mb-2 uppercase">VEHICLE SPECIFICATIONS</Form.Label>
                        <Row className="gy-3">
                            <Col md={9}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small" style={{ color: '#e0e0e0' }}>Vehicle Name *</Form.Label>
                                    <Form.Control type="text" className="text-light shadow-none" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                </Form.Group>
                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small" style={{ color: '#e0e0e0' }}>Total Capacity (t) *</Form.Label>
                                            <Form.Control type="number" defaultValue="0.00" step="0.01" className="text-light shadow-none" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small" style={{ color: '#e0e0e0' }}>Target Loading (%) *</Form.Label>
                                            <Form.Control type="number" defaultValue="100.0" step="0.1" className="text-light shadow-none" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small" style={{ color: '#e0e0e0' }}>Empty Weight (t) *</Form.Label>
                                    <Form.Control type="number" defaultValue="0.00" step="0.01" className="text-light shadow-none" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small" style={{ color: '#e0e0e0' }}>Emission Factor (kgCO2e/t-km) *</Form.Label>
                                    <Form.Control type="number" defaultValue="0.055000" step="0.000001" className="text-light shadow-none" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <div className="ps-2 mt-4 pt-2">
                                    <div className="mb-5">
                                        <span className="d-block small text-muted mb-1">Available Payload (t)</span>
                                        <span className="fw-bold" style={{ color: '#ffffff' }}>—</span>
                                    </div>
                                    <div className="mb-5">
                                        <span className="d-block small text-muted mb-1">Effective Payload (t)</span>
                                        <span className="fw-bold" style={{ color: '#ffffff' }}>—</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Form.Check 
                            type="checkbox" 
                            id="save-custom" 
                            label="Save as custom vehicle for this project" 
                            className="small text-muted mt-2"
                        />
                    </div>

                    <hr className="border-secondary mb-4" />

                    {/* ROUTE INFORMATION */}
                    <div className="mb-4">
                        <Form.Label className="text-muted small fw-bold mb-2 uppercase">ROUTE INFORMATION</Form.Label>
                        <Row className="gy-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small">Origin Location</Form.Label>
                                    <Form.Control type="text" className="bg-dark text-light border-secondary" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small">Destination Location</Form.Label>
                                    <Form.Control type="text" className="bg-dark text-light border-secondary" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small">Total Distance (km) *</Form.Label>
                                    <Form.Control type="number" defaultValue="0.0" step="0.1" className="bg-dark text-light border-secondary" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-top border-secondary py-3 justify-content-end" style={{ backgroundColor: '#121212' }}>
                <Button variant="outline-secondary" size="sm" onClick={handleClose} className="px-4 text-light border-secondary hover-opacity" style={{ backgroundColor: '#333', border: '1px solid #444' }}>
                    Cancel
                </Button>
                <Button variant="secondary" size="sm" className="px-3 hover-opacity" style={{ backgroundColor: '#2c2c2c', borderColor: '#444', color: '#ffffff' }}>
                    Continue to Materials →
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddTransportLogModal;
