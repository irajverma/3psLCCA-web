import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { COUNTRIES, CURRENCIES } from './components/utils/countriesdata';

const countryOptions = COUNTRIES.map(c => ({ value: c, label: c }));
const currencyOptions = CURRENCIES.map(c => ({ value: c, label: c }));

const getCustomStyles = (isInvalid) => ({
    control: (provided, state) => ({
        ...provided,
        fontSize: '0.9rem',
        borderColor: isInvalid ? '#dc3545' : 'var(--app-input-border)',
        minHeight: '38px',
        backgroundColor: 'var(--app-input-bg)',
        boxShadow: isInvalid && state.isFocused ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : 'none',
        '&:hover': {
            borderColor: isInvalid ? '#dc3545' : 'var(--app-primary-accent)'
        },
        transition: 'all 0.3s ease'
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '0.9rem',
        backgroundColor: state.isFocused ? 'var(--app-bg-alt)' : 'transparent',
        color: 'var(--app-text-primary)',
        transition: 'background-color 0.1s'
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--app-text-muted)',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--app-text-primary)',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        backgroundColor: 'var(--app-bg-card)',
        border: '1px solid var(--app-border-light)'
    })
});

const NewProject = ({ show, handleClose, onProjectOpen }) => {
    const [projectName, setProjectName] = useState('');
    const [country, setCountry] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [validated, setValidated] = useState(false);

    const closeModal = () => {
        setValidated(false); // Reset validation UI on close
        handleClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true); // Always mark as validated on submit attempt

        if (!projectName || !country || !currency) {
            return; // Stop here if any field is empty
        }

        // Handle successful form submission logic here
        console.log({
            projectName,
            country: country.value,
            currency: currency.value
        });

        // Reset state
        setProjectName('');
        setCountry(null);
        setCurrency(null);
        setValidated(false);

        handleClose();
        if (onProjectOpen) onProjectOpen();
    };

    return (
        <Modal show={show} onHide={closeModal} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#8ea9a2', borderRadius: '2px' }}></span>
                    New Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--app-text-primary)' }}>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. Highway 5 Bridge Replacement"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            style={{ fontSize: '0.9rem', backgroundColor: 'var(--app-input-bg)', color: 'var(--app-input-text)', borderColor: 'var(--app-input-border)', transition: 'all 0.3s ease' }}
                            autoComplete="off"
                            isInvalid={validated && !projectName}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                            Please enter a Project Name.
                        </Form.Control.Feedback>
                        {(!validated || projectName) && (
                            <Form.Text style={{ fontSize: '0.8rem', color: 'var(--app-text-secondary)' }}>
                                You can rename this later.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--app-text-primary)' }}>Country</Form.Label>
                        <Select
                            options={countryOptions}
                            value={country}
                            onChange={setCountry}
                            placeholder="— Select country —"
                            styles={getCustomStyles(validated && !country)}
                            menuPlacement="auto"
                            isSearchable
                        />
                        {validated && !country ? (
                            <div className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>
                                Please select a Country.
                            </div>
                        ) : (
                            <Form.Text style={{ fontSize: '0.8rem', color: 'var(--app-text-secondary)' }}>
                                Cannot be changed after project creation.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--app-text-primary)' }}>Currency</Form.Label>
                        <Select
                            options={currencyOptions}
                            value={currency}
                            onChange={setCurrency}
                            placeholder="— Select currency —"
                            styles={getCustomStyles(validated && !currency)}
                            menuPlacement="auto"
                            isSearchable
                        />
                        {validated && !currency ? (
                            <div className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>
                                Please select a Currency.
                            </div>
                        ) : (
                            <Form.Text style={{ fontSize: '0.8rem', color: 'var(--app-text-secondary)' }}>
                                Cannot be changed after project creation.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" type="submit" style={{ fontSize: '0.9rem', padding: '0.25rem 1.5rem', borderColor: 'var(--app-primary-accent)', color: 'var(--app-primary-accent)' }}>
                            OK
                        </Button>
                        <Button variant="outline-secondary" onClick={closeModal} style={{ fontSize: '0.9rem', padding: '0.25rem 1rem', border: 'none', color: 'var(--app-text-secondary)' }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NewProject;