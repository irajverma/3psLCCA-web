import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';

const SaveCheckpointModal = ({ show, handleClose, onSave }) => {
    const [step, setStep] = useState(1); // 1: Input, 2: Success
    const [label, setLabel] = useState('');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [generatedFile, setGeneratedFile] = useState('');

    const resetAndClose = () => {
        setStep(1);
        setLabel('');
        setNotes('');
        setIsSaving(false);
        handleClose();
    };

    const handleSave = () => {
        setIsSaving(true);
        
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${y}${m}${d}_${h}${min}${s}`;
        
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const dateStr = `${timestamp}_${random}`;
        const filename = `cp_${label || 'manual'}_${dateStr}.zip`;
        
        setGeneratedFile(filename);

        // Simulate saving process
        setTimeout(() => {
            setIsSaving(false);
            if (onSave) {
                onSave({
                    label: label || 'manual',
                    notes: notes,
                    date: dateStr,
                    filename: filename
                });
            }
            setStep(2);
        }, 1200);
    };

    if (step === 2) {
        return (
            <Modal show={show} onHide={resetAndClose} centered size="sm" contentClassName="bg-dark text-light border-secondary">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title style={{ fontSize: '0.9rem' }}>Checkpoint Saved</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3 text-center">
                    <div className="d-flex align-items-start gap-3 text-start">
                        <BsInfoCircleFill size={32} color="#007bff" className="mt-1" />
                        <div>
                            <p className="mb-2" style={{ fontSize: '0.95rem' }}>Checkpoint '{label || 'manual'}' saved successfully.</p>
                            <p className="mb-0 text-secondary" style={{ fontSize: '0.85rem' }}>File: {generatedFile}</p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={resetAndClose}
                            style={{ backgroundColor: '#333', borderColor: '#444', padding: '4px 24px' }}
                        >
                            OK
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={resetAndClose} centered contentClassName="bg-dark text-light border-secondary shadow-lg">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                    <FaSave className="text-secondary" /> Save Checkpoint
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3 px-4">
                <div className="mb-4">
                    <h5 className="fw-bold mb-2" style={{ fontSize: '1.2rem' }}>Save Checkpoint</h5>
                    <p className="text-secondary mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                        A checkpoint is a full snapshot of your current project data.<br />
                        You can restore it at any time from the Checkpoint Manager.
                    </p>
                </div>

                <Form>
                    <Form.Group className="mb-3 d-flex align-items-center gap-3">
                        <Form.Label className="mb-0 text-nowrap" style={{ fontSize: '0.9rem', width: '60px' }}>Label:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. before client review, v2 cost update"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="bg-dark text-light border-secondary"
                            style={{ fontSize: '0.9rem', backgroundColor: '#1a1a1a !important' }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4 d-flex align-items-start gap-3">
                        <Form.Label className="mt-1 text-nowrap" style={{ fontSize: '0.9rem', width: '60px' }}>Notes:</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={4}
                            placeholder="Optional notes about this snapshot..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-dark text-light border-secondary"
                            style={{ fontSize: '0.9rem', backgroundColor: '#1a1a1a !important', resize: 'none' }}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mb-2">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={resetAndClose}
                            style={{ backgroundColor: '#333', borderColor: '#444', padding: '5px 15px' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{ borderColor: '#007bff', color: '#007bff', padding: '5px 15px' }}
                        >
                            {isSaving ? 'Saving...' : 'Save Checkpoint'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SaveCheckpointModal;
