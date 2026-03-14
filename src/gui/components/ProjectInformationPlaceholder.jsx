import React from 'react';

const ProjectInformationPlaceholder = () => {
    return (
        <div style={{ padding: '24px', color: '#e0e0e0' }} className="project-information-wrapper">
            <h5 className="mb-4 fw-bold pb-2" style={{ borderBottom: '1px solid #444', fontSize: '1rem', color: '#fff' }}>
                Project Information
            </h5>
            
            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Project Name *
                </label>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                    Official name or title of the bridge/infrastructure project. ⓘ
                </div>
                <div style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '4px', height: '38px' }} />
            </div>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Project Code
                </label>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                    Unique reference code assigned to this project. ⓘ
                </div>
                <div style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '4px', height: '38px' }} />
            </div>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Project Description
                </label>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                    Brief description of the project scope, objectives, or background. ⓘ
                </div>
                <div style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '4px', height: '100px' }} />
            </div>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Remarks
                </label>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                    Any additional notes, assumptions, or comments relevant to this evaluation. ⓘ
                </div>
                <div style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '4px', height: '100px' }} />
            </div>
        </div>
    );
};

export default ProjectInformationPlaceholder;
