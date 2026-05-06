import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { BsStars } from 'react-icons/bs';

const Loginpage = ({ onLogin, onGuestLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [validated, setValidated] = useState(false);

    // Guest Prompt State
    const [showGuestPrompt, setShowGuestPrompt] = useState(false);
    const [guestNameInput, setGuestNameInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);
        if (!email || !password) return;

        if (onLogin) onLogin({ email, password });
    };

    const handleGuestSubmit = (e) => {
        e.preventDefault();
        const name = guestNameInput.trim() || 'Guest';
        setShowGuestPrompt(false);
        if (onGuestLogin) onGuestLogin(name);
    };

    return (
        <Container fluid className="p-0 m-0" style={{ height: '100vh', overflow: 'hidden' }}>
            <Row className="g-0 m-0 w-100 h-100" style={{ backgroundColor: 'var(--app-bg-main)', transition: 'background-color 0.3s ease' }}>

                {/* Left Side: Minimal Background */}
                <Col md={6} className="d-flex flex-column p-4">

                    {/* Top Logo */}
                    <div className="d-flex align-items-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--app-logo-accent)' }}>
                        <BsStars className="me-2" /> 3psLCCA
                    </div>

                    {/* Middle Text */}
                    <div className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1" style={{ paddingBottom: '5vh' }}>
                        <h1 className="fw-bold mb-2" style={{ fontSize: '2.8rem', letterSpacing: '-0.5px', color: 'var(--app-text-primary)', transition: 'color 0.3s ease' }}>
                            Welcome to...
                        </h1>
                        <p className="px-3 mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '90%', color: 'var(--app-text-secondary)', transition: 'color 0.3s ease' }}>
                            Your comprehensive platform for Life Cycle Cost Analysis.<br />
                            Plan efficiently, track expenses, and gain actionable insights for all your projects.
                        </p>
                    </div>
                </Col>

                {/* Right Side: Form Container */}
                <Col md={6} className="d-flex flex-column justify-content-center p-3 p-md-4 border-start" style={{ backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-light)', transition: 'background-color 0.3s ease, border-color 0.3s ease', overflowY: 'auto' }}>
                    <div className="w-100 mx-auto p-3 p-md-4 rounded shadow border" style={{ maxWidth: '520px', backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-light)', transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>

                        <div className="mb-3 text-center">
                            <h1 className="fw-bold mb-1" style={{ color: 'var(--app-text-primary)', fontSize: '2rem', transition: 'color 0.3s ease' }}>Login</h1>
                            <p className="mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.3', color: 'var(--app-text-secondary)', transition: 'color 0.3s ease' }}>
                                Welcome! Login to manage your projects, resources, and access comprehensive analysis tools.
                            </p>
                        </div>

                        <div className="mx-auto" style={{ maxWidth: '380px' }}>
                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-2">
                                    <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s ease' }}>USER NAME</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--app-input-bg)', color: 'var(--app-input-text)', borderColor: 'var(--app-input-border)', transition: 'all 0.3s ease' }}
                                        isInvalid={validated && !email}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.7rem' }}>
                                        User Name (Email) is required.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s ease' }}>PASSWORD</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--app-input-bg)', color: 'var(--app-input-text)', borderColor: 'var(--app-input-border)', transition: 'all 0.3s ease' }}
                                        isInvalid={validated && !password}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.7rem' }}>
                                        Password is required.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Remember me"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{ fontSize: '0.8rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s ease' }}
                                        className="d-flex align-items-center gap-2 m-0"
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 py-2 fw-bold mb-3 border-0"
                                    style={{ backgroundColor: '#9ACD32', color: 'var(--app-btn-primary-text)', fontSize: '0.9rem', letterSpacing: '0.5px', borderRadius: '4px' }}
                                >
                                    LOGIN
                                </Button>
                            </Form>

                            <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--app-text-secondary)', transition: 'color 0.3s ease' }}>
                                    New User? <span style={{ color: 'var(--app-primary-accent)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.3s ease' }}>Signup</span>
                                </span>
                                <span style={{ color: 'var(--app-text-secondary)', cursor: 'pointer', fontStyle: 'italic', transition: 'color 0.3s ease' }}>
                                    Forgot your password?
                                </span>
                            </div>
                        </div>

                        {/* Guest Login Option */}
                        <div className="mt-3 pt-2 border-top text-center mx-auto" style={{ maxWidth: '380px', borderColor: 'var(--app-border-light) !important' }}>
                            <Button
                                variant="light"
                                className="w-100 py-1 d-flex justify-content-center align-items-center m-0"
                                style={{ color: 'var(--app-text-primary)', border: '1px solid var(--app-border-mid)', borderRadius: '4px', fontSize: '0.85rem', backgroundColor: 'var(--app-bg-alt)', transition: 'all 0.3s ease' }}
                                onClick={() => setShowGuestPrompt(true)}
                            >
                                Continue as Guest
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Guest Name Prompt Modal */}
            <Modal show={showGuestPrompt} onHide={() => setShowGuestPrompt(false)} centered backdrop="static">
                <div style={{ backgroundColor: 'var(--app-bg-card)', color: 'var(--app-text-primary)', borderRadius: '6px' }}>
                    <Modal.Header closeButton style={{ borderBottom: '1px solid var(--app-border-light)' }} className="px-4 pt-4">
                        <Modal.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Welcome</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="px-4 pb-4">
                        <Form onSubmit={handleGuestSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold" style={{ fontSize: '0.85rem', color: 'var(--app-text-secondary)' }}>Please enter your name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={guestNameInput}
                                    placeholder="e.g. John Doe"
                                    onChange={(e) => setGuestNameInput(e.target.value)}
                                    style={{ backgroundColor: 'var(--app-input-bg)', color: 'var(--app-input-text)', borderColor: 'var(--app-input-border)' }}
                                    autoFocus
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowGuestPrompt(false)} style={{ backgroundColor: 'transparent', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-light)' }}>Cancel</Button>
                                <Button type="submit" style={{ backgroundColor: '#9ACD32', color: '#000', border: 'none', fontWeight: 'bold' }}>Continue</Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </Container>
    );
};

export default Loginpage;