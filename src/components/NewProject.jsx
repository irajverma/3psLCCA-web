import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { COUNTRIES, CURRENCIES } from './utils/countriesdata';

const countryOptions = COUNTRIES.map(c => ({ value: c, label: c }));
const currencyOptions = CURRENCIES.map(c => ({ value: c, label: c }));

const getCustomStyles = (isInvalid) => ({
    control: (provided, state) => ({
        ...provided,
        fontSize: '0.9rem',
        borderColor: isInvalid ? '#dc3545' : '#dee2e6',
        minHeight: '38px',
        boxShadow: isInvalid && state.isFocused ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : 'none',
        '&:hover': {
            borderColor: isInvalid ? '#dc3545' : '#b3b3b3'
        }
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '0.9rem',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#6c757d',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#212529',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999
    })
});

const NewProject = ({ show, handleClose }) => {
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
                        <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. Highway 5 Bridge Replacement"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            style={{ fontSize: '0.9rem' }}
                            autoComplete="off"
                            isInvalid={validated && !projectName}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                            Please enter a Project Name.
                        </Form.Control.Feedback>
                        {(!validated || projectName) && (
                            <Form.Text className="text-muted" style={{ fontSize: '0.8rem' }}>
                                You can rename this later.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>Country</Form.Label>
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
                            <Form.Text className="text-muted" style={{ fontSize: '0.8rem' }}>
                                Cannot be changed after project creation.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>Currency</Form.Label>
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
                            <Form.Text className="text-muted" style={{ fontSize: '0.8rem' }}>
                                Cannot be changed after project creation.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" type="submit" style={{ fontSize: '0.9rem', padding: '0.25rem 1.5rem' }}>
                            OK
                        </Button>
                        <Button variant="outline-secondary" onClick={closeModal} style={{ fontSize: '0.9rem', padding: '0.25rem 1rem', border: 'none' }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NewProject;