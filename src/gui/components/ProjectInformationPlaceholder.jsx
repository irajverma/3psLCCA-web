import React from 'react';

const ProjectInformationPlaceholder = () => {
    return (
        <div style={{ padding: '24px', color: 'var(--app-text-primary)' }} className="project-information-wrapper">
            <h5 className="mb-4 fw-bold pb-2" style={{ borderBottom: '1px solid var(--app-border-dark)', fontSize: '1rem', color: 'var(--app-text-primary)', transition: 'all 0.3s' }}>
                Project Information
            </h5>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                    Project Name *
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: '8px' }}>
                    Official name or title of the bridge/infrastructure project. ⓘ
                </div>
                <div style={{ backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)', borderRadius: '4px', height: '38px', transition: 'all 0.3s' }} />
            </div>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                    Project Code
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: '8px' }}>
                    Unique reference code assigned to this project. ⓘ
                </div>
                <div style={{ backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)', borderRadius: '4px', height: '38px', transition: 'all 0.3s' }} />
            </div>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                    Project Description
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: '8px' }}>
                    Brief description of the project scope, objectives, or background. ⓘ
                </div>
                <div style={{ backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)', borderRadius: '4px', height: '100px', transition: 'all 0.3s' }} />
            </div>

            <div className="mb-4">
                <label className="fw-bold mb-1 d-block" style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)', transition: 'color 0.3s' }}>
                    Remarks
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginBottom: '8px' }}>
                    Any additional notes, assumptions, or comments relevant to this evaluation. ⓘ
                </div>
                <div style={{ backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-input-border)', borderRadius: '4px', height: '100px', transition: 'all 0.3s' }} />
            </div>
        </div>
    );
};

export default ProjectInformationPlaceholder;
