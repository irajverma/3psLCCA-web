import React from 'react';
import ProjectNavbar from './ProjectNavbar';
import Sidebar from './Sidebar';

const ProjectLayout = ({ children, activeNode, setActiveNode }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <ProjectNavbar />
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Sidebar activeNode={activeNode} setActiveNode={setActiveNode} />
                <div style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'var(--app-bg-main)', transition: 'background-color 0.3s ease' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProjectLayout;
