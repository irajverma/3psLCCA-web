import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { FaTrash, FaHistory, FaPlus } from 'react-icons/fa';

const CheckpointManagerModal = ({ show, handleClose, onNewCheckpoint, checkpoints, onDelete }) => {
    const [selectedIdx, setSelectedIdx] = useState(null);

    const formatDate = (rawDate) => {
        try {
            // rawDate is expected in format YYYYMMDD_HHMMSS_XXX
            const y = rawDate.slice(0, 4);
            const m = rawDate.slice(4, 6);
            const d = rawDate.slice(6, 8);
            const h = rawDate.slice(9, 11);
            const min = rawDate.slice(11, 13);
            const s = rawDate.slice(13, 15);
            return `${y}-${m}-${d}  ${h}:${min}:${s}`;
        } catch (e) {
            return rawDate;
        }
    };

    const handleRestore = () => {
        if (selectedIdx === null) return;
        const cp = checkpoints[selectedIdx];
        if (window.confirm(`Restore checkpoint '${cp.label}' from ${formatDate(cp.date)}?\n\n⚠️ This will REPLACE all current project data with this snapshot.\nAny unsaved changes will be lost.`)) {
            alert(`Project restored from '${cp.label}' successfully.\nThe UI will now refresh.`);
            handleClose();
        }
    };

    const handleDelete = () => {
        if (selectedIdx === null) return;
        const cp = checkpoints[selectedIdx];
        if (window.confirm(`Permanently delete checkpoint '${cp.label}'?\n\nThis cannot be undone.`)) {
            if (onDelete) onDelete(selectedIdx);
            setSelectedIdx(null);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" contentClassName="bg-dark text-light border-secondary">
            <Modal.Header closeButton className="border-0 pb-0 pt-3">
                <Modal.Title style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--app-text-muted)' }}>
                    <AiOutlineClockCircle size={18} /> Checkpoint Manager
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2 px-4 pb-4">
                <div className="mb-4">
                    <h5 className="fw-bold mb-2" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                         <AiOutlineClockCircle className="me-2" /> Checkpoint Manager
                    </h5>
                    <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
                        Select a checkpoint to restore or delete it. Restoring will replace all current project data with the snapshot.
                    </p>
                </div>

                <div className="border rounded overflow-hidden" style={{ borderColor: '#333', backgroundColor: '#1e1e1e' }}>
                    <Table hover responsive variant="dark" className="mb-0" style={{ fontSize: '0.85rem' }}>
                        <thead style={{ backgroundColor: '#252525', borderBottom: '1px solid #333' }}>
                            <tr>
                                <th className="fw-normal text-secondary py-2 border-0">Label</th>
                                <th className="fw-normal text-secondary py-2 border-0">Date & Time</th>
                                <th className="fw-normal text-secondary py-2 border-0">Notes</th>
                                <th className="fw-normal text-secondary py-2 border-0">File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkpoints.map((cp, idx) => (
                                <tr 
                                    key={idx} 
                                    onClick={() => setSelectedIdx(idx)}
                                    onDoubleClick={handleRestore}
                                    style={{ 
                                        cursor: 'pointer',
                                        backgroundColor: selectedIdx === idx ? '#2a2d2e' : 'transparent',
                                        borderBottom: '1px solid #2a2a2a'
                                    }}
                                >
                                    <td className="fw-bold">{cp.label}</td>
                                    <td>{formatDate(cp.date)}</td>
                                    <td className="text-secondary">{cp.notes || '—'}</td>
                                    <td className="text-secondary small">{cp.filename}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={onNewCheckpoint}
                        className="d-flex align-items-center gap-2"
                        style={{ fontSize: '0.85rem', color: '#fff', borderColor: '#444', padding: '6px 16px', borderRadius: '4px' }}
                    >
                        <FaPlus size={12} /> New Checkpoint
                    </Button>

                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            disabled={selectedIdx === null}
                            onClick={handleDelete}
                            className="d-flex align-items-center gap-2"
                            style={{ 
                                fontSize: '0.85rem', 
                                padding: '6px 20px',
                                opacity: selectedIdx === null ? 0.4 : 1,
                                borderColor: '#c0392b',
                                color: '#fff'
                            }}
                        >
                            <FaTrash size={12} /> Delete
                        </Button>
                        <Button 
                            variant="success" 
                            size="sm" 
                            disabled={selectedIdx === null}
                            onClick={handleRestore}
                            className="d-flex align-items-center gap-2"
                            style={{ 
                                fontSize: '0.85rem', 
                                padding: '6px 20px',
                                backgroundColor: selectedIdx !== null ? '#5a9214' : '#333',
                                borderColor: selectedIdx !== null ? '#4a7c10' : '#444',
                                opacity: selectedIdx === null ? 0.4 : 1
                            }}
                        >
                            <FaHistory size={14} /> Restore
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CheckpointManagerModal;
