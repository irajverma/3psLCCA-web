import React from 'react';
import ProjectNavbar from './ProjectNavbar';
import Sidebar from './Sidebar';

const ProjectLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <ProjectNavbar />
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Sidebar />
                <div style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: '#16171d' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProjectLayout;
