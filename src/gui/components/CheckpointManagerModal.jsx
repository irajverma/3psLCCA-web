import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { FaClock, FaTrashAlt, FaUndo, FaPlus } from 'react-icons/fa';

const CheckpointManagerModal = ({ show, onHide, checkpoints, onDelete, onRestore, onAddNew }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleDelete = () => {
        if (selectedIndex !== null) {
            onDelete(selectedIndex);
            setSelectedIndex(null);
        }
    };

    const handleRestore = () => {
        if (selectedIndex !== null) {
            onRestore(checkpoints[selectedIndex]);
            onHide();
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered 
            size="lg"
            className="checkpoint-manager-modal"
            contentClassName="bg-dark text-light border-0"
        >
            <style>{`
                .checkpoint-manager-modal .modal-content {
                    background-color: #252525 !important;
                    border-radius: 8px;
                    border: 1px solid #444 !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                }
                .checkpoint-table-container {
                    background-color: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 4px;
                    max-height: 350px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                }
                .checkpoint-table {
                    margin-bottom: 0;
                    color: #ccc;
                    font-size: 14px;
                }
                .checkpoint-table th {
                    background-color: #2d2d2d;
                    color: #888;
                    font-weight: 500;
                    border-bottom: 1px solid #444 !important;
                    padding: 12px 15px;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }
                .checkpoint-table td {
                    padding: 10px 15px;
                    border-bottom: 1px solid #2a2a2a !important;
                    vertical-align: middle;
                    cursor: pointer;
                }
                .checkpoint-table tr:hover td {
                    background-color: #333;
                }
                .checkpoint-table tr.selected td {
                    background-color: #3a3a3a;
                    color: #fff;
                }
                .btn-green-plus {
                    background-color: #9acd32 !important;
                    border: none !important;
                    color: #000 !important;
                    font-weight: 600;
                    padding: 10px 20px;
                    border-radius: 6px;
                }
                .btn-green-plus:hover {
                    background-color: #a8d648 !important;
                }
                .btn-outline-danger-custom {
                    border: 1px solid #dc3545 !important;
                    color: #dc3545 !important;
                    background: transparent !important;
                    padding: 8px 16px;
                }
                .btn-outline-danger-custom:hover:not(:disabled) {
                    background-color: rgba(220, 53, 69, 0.1) !important;
                }
                .btn-outline-secondary-custom {
                    border: 1px solid #555 !important;
                    color: #aaa !important;
                    background: transparent !important;
                    padding: 8px 16px;
                }
                .btn-outline-secondary-custom:hover:not(:disabled) {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    color: #fff !important;
                }
                .restore-hint {
                    color: #aaa;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                /* Scrollbar styling */
                .checkpoint-table-container::-webkit-scrollbar {
                    width: 8px;
                }
                .checkpoint-table-container::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                .checkpoint-table-container::-webkit-scrollbar-thumb {
                    background: #444;
                    border-radius: 4px;
                }
                .checkpoint-table-container::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>

            <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
                <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '18px' }}>
                    <FaClock style={{ color: '#aaa' }} /> Checkpoint Manager
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-3">
                <p className="restore-hint">
                    Select a checkpoint to restore or delete it. Restoring will replace all current project data with the snapshot.
                </p>

                <div className="checkpoint-table-container">
                    <Table responsive className="checkpoint-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>Label</th>
                                <th style={{ width: '25%' }}>Date & Time</th>
                                <th style={{ width: '20%' }}>Notes</th>
                                <th style={{ width: '35%' }}>File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkpoints.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5" style={{ color: '#555' }}>
                                        No checkpoints saved yet.
                                    </td>
                                </tr>
                            ) : (
                                checkpoints.map((cp, idx) => (
                                    <tr 
                                        key={idx} 
                                        className={selectedIndex === idx ? 'selected' : ''}
                                        onClick={() => setSelectedIndex(idx)}
                                    >
                                        <td className="fw-bold">{cp.label}</td>
                                        <td>{formatDate(cp.timestamp)}</td>
                                        <td className="text-truncate" style={{ maxWidth: '100px' }}>
                                            {cp.notes || '-'}
                                        </td>
                                        <td style={{ fontSize: '12px', color: '#777' }}>
                                            {`cp_${cp.label.toLowerCase().replace(/\s+/g, '_')}_${cp.timestamp.replace(/[-:T.]/g, '')}.3psLCCA`}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-0 pb-4 d-flex justify-content-between">
                <Button className="btn-green-plus d-flex align-items-center gap-2" onClick={onAddNew}>
                    <FaPlus /> New Checkpoint
                </Button>
                
                <div className="d-flex gap-2">
                    <Button 
                        variant="outline-danger" 
                        className="btn-outline-danger-custom d-flex align-items-center gap-2"
                        disabled={selectedIndex === null}
                        onClick={handleDelete}
                    >
                        <FaTrashAlt /> Delete
                    </Button>
                    <Button 
                        variant="outline-secondary" 
                        className="btn-outline-secondary-custom d-flex align-items-center gap-2"
                        disabled={selectedIndex === null}
                        onClick={handleRestore}
                    >
                        <FaUndo /> Restore
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CheckpointManagerModal;
