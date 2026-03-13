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

const Homepage = () => {
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
        <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f5f6f8' }}>
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom shadow-sm">
                <h4 className="m-0 d-flex align-items-center fw-bold" style={{ color: '#2c3e50' }}>
                    <BsStars className="me-2" style={{ color: '#f39c12' }} /> 3psLCCA
                </h4>
                <small className="text-muted d-flex align-items-center gap-1 text-end" style={{ maxWidth: '60%' }}>
                    <span style={{ fontSize: '11px', fontStyle: 'italic', transition: 'opacity 0.5s ease-in-out', color: '#6c757d', whiteSpace: 'normal', lineHeight: '1.2' }}>
                        "{quotes[currentQuoteIndex]}"
                    </span>
                </small>
            </header>

            {/* Main Content */}
            <main className="flex-grow-1 d-flex justify-content-center align-items-center py-2" style={{ overflow: 'hidden' }}>
                <div style={{ width: '100%', maxWidth: '550px' }}>

                    {/* Start Section */}
                    <div className="mb-3">
                        <h6 className="fw-bold mb-2" style={{ fontSize: '0.8rem', color: '#8b98a5' }}>START</h6>
                        <button
                            className="btn w-100 py-2 d-flex justify-content-center align-items-center"
                            style={{ backgroundColor: '#ffffff', color: '#2c3e50', border: '1px solid #73a5af', borderRadius: '4px', fontSize: '0.9rem' }}
                            onClick={handleOpenModal}
                        >
                            + New Project
                        </button>
                    </div>

                    <hr className="mb-3" style={{ borderTop: '1px solid #495057' }} />

                    {/* Projects Section */}
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold m-0" style={{ fontSize: '0.8rem', color: '#8b98a5' }}>PROJECTS</h6>
                            <button className="btn btn-sm btn-light border p-0 d-flex align-items-center justify-content-center bg-white" style={{ width: '28px', height: '28px', borderRadius: '4px' }}>
                                <AiOutlineRedo size={14} color="#6c757d" />
                            </button>
                        </div>

                        <div className="bg-white border text-center mb-3" style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', borderColor: '#e9ecef' }}>
                            <div style={{ fontSize: '0.9rem', color: '#8b98a5' }}>
                                <BsStars className="me-2" style={{ color: '#f39c12' }} /> Click '+ New Project' above to create your first project.<br />
                                Your projects will appear here once you create them.
                            </div>
                        </div>

                        <div className="d-flex justify-content-center gap-3 mb-3">
                            <button className="btn border bg-white flex-grow-1 py-1" style={{ fontSize: '0.9rem', color: '#2c3e50', borderRadius: '4px', borderColor: '#e9ecef' }}>Open</button>
                            <button className="btn border bg-white flex-grow-1 py-1" style={{ fontSize: '0.9rem', color: '#2c3e50', borderRadius: '4px', borderColor: '#e9ecef' }}>Delete</button>
                        </div>

                        <hr className="m-0" style={{ borderTop: '1px solid #495057' }} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-2 bg-white border-top text-muted" style={{ fontSize: '0.8rem' }}>
                <div className="container-fluid px-2">
                    3psLCCA • 0.1.0-dev
                </div>
            </footer>

            {/* New Project Modal */}
            <NewProject show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Homepage;