import React, { useState, useEffect } from 'react';
import { BsStars } from 'react-icons/bs';
import { AiOutlineRedo } from 'react-icons/ai';
import NewProject from './NewProject';

const quotes = [
    "💡 Small steps today lead to big savings tomorrow.",
    "📊 Measure twice, cut once and track the cost.",
    "⚙️ Efficiency is doing things right; effectiveness is doing the right things.",
    "🧭 Data is the compass, cost is the path.",
    "📖 Every project tells a story make yours count."
];

const Homepage = ({ onProjectOpen }) => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--app-bg-main)', transition: 'background-color 0.3s ease' }}>
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: 'var(--app-bg-card)', transition: 'all 0.3s ease', borderBottom: 'none' }}>
                <h4 className="m-0 d-flex align-items-center fw-bold" style={{ color: 'var(--app-text-primary)', transition: 'color 0.3s ease' }}>
                    <BsStars className="me-2" style={{ color: 'var(--app-logo-accent)' }} /> 3psLCCA
                </h4>
                <small className="d-flex align-items-center gap-1 text-end" style={{ maxWidth: '60%' }}>
                    <span style={{ fontSize: '11px', fontStyle: 'italic', transition: 'all 0.5s ease-in-out', color: 'var(--app-text-secondary)', whiteSpace: 'normal', lineHeight: '1.2' }}>
                        "{quotes[currentQuoteIndex]}"
                    </span>
                </small>
            </header>

            {/* Main Content */}
            <main className="flex-grow-1 d-flex justify-content-center align-items-center py-2" style={{ overflow: 'hidden' }}>
                <div style={{ width: '100%', maxWidth: '550px' }}>

                    {/* Start Section */}
                    <div className="mb-3">
                        <h6 className="fw-bold mb-2" style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)' }}>START</h6>
                        <button
                            className="btn w-100 py-2 d-flex justify-content-center align-items-center"
                            style={{ backgroundColor: 'var(--app-bg-card)', color: 'var(--app-text-primary)', border: '1px solid var(--app-primary-accent)', borderRadius: '4px', fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                            onClick={handleOpenModal}
                        >
                            + New Project
                        </button>
                    </div>

                    <hr className="mb-3" style={{ borderTop: '1px solid var(--app-border-dark)' }} />

                    {/* Projects Section */}
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold m-0" style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)' }}>PROJECTS</h6>
                            <button className="btn btn-sm border p-0 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-light)' }}>
                                <AiOutlineRedo size={14} color="var(--app-text-secondary)" />
                            </button>
                        </div>

                        <div className="border text-center mb-3" style={{ backgroundColor: 'var(--app-bg-card)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', borderColor: 'var(--app-border-light)', transition: 'all 0.3s ease' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--app-text-muted)' }}>
                                <BsStars className="me-2" style={{ color: 'var(--app-logo-accent)' }} /> Click '+ New Project' above to create your first project.<br />
                                Your projects will appear here once you create them.
                            </div>
                        </div>

                        <div className="d-flex justify-content-center gap-3 mb-3">
                            <button className="btn border flex-grow-1 py-1" onClick={onProjectOpen} style={{ backgroundColor: 'var(--app-bg-card)', fontSize: '0.9rem', color: 'var(--app-text-primary)', borderRadius: '4px', borderColor: 'var(--app-border-light)', transition: 'all 0.3s' }}>Open</button>
                            <button className="btn border flex-grow-1 py-1" style={{ backgroundColor: 'var(--app-bg-card)', fontSize: '0.9rem', color: 'var(--app-text-primary)', borderRadius: '4px', borderColor: 'var(--app-border-light)', transition: 'all 0.3s' }}>Delete</button>
                        </div>

                        <hr className="m-0" style={{ borderTop: '1px solid var(--app-border-dark)' }} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-2" style={{ backgroundColor: 'var(--app-bg-card)', color: 'var(--app-text-secondary)', fontSize: '0.8rem', transition: 'all 0.3s ease', borderTop: 'none' }}>
                <div className="container-fluid px-2">
                    3psLCCA • 0.1.0-dev
                </div>
            </footer>

            {/* New Project Modal */}
            <NewProject show={showModal} handleClose={handleCloseModal} onProjectOpen={onProjectOpen} />
        </div>
    );
};

export default Homepage;