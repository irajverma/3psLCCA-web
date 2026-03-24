import React from 'react';
import ProjectNavbar from './ProjectNavbar';
import Sidebar from './Sidebar';

const ProjectLayout = ({ children, activeNode, setActiveNode, onLogout }) => {
    const [sidebarWidth, setSidebarWidth] = React.useState(250);
    const [isResizing, setIsResizing] = React.useState(false);

    const startResizing = React.useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback(
        (e) => {
            if (isResizing) {
                const newWidth = e.clientX;
                if (newWidth > 150 && newWidth < 600) {
                    setSidebarWidth(newWidth);
                }
            }
        },
        [isResizing]
    );

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', 
            width: '100vw', 
            overflow: 'hidden', 
            cursor: isResizing ? 'col-resize' : 'default',
            userSelect: isResizing ? 'none' : 'auto'
        }}>
            <ProjectNavbar onLogout={onLogout} setActiveNode={setActiveNode} />
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Sidebar activeNode={activeNode} setActiveNode={setActiveNode} width={sidebarWidth} />
                
                {/* Resize Handle */}
                <div 
                    onMouseDown={startResizing}
                    style={{ 
                        width: '4px', 
                        cursor: 'col-resize', 
                        backgroundColor: (isResizing) ? 'var(--app-primary-accent, #2ecc71)' : 'transparent', 
                        zIndex: 10,
                        transition: 'background-color 0.2s',
                        boxShadow: isResizing ? '0 0 5px var(--app-primary-accent)' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--app-primary-accent, #2ecc71)'}
                    onMouseLeave={(e) => { if(!isResizing) e.currentTarget.style.backgroundColor = 'transparent'; }}
                />

                <div style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'var(--app-bg-main)', transition: 'background-color 0.3s ease' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProjectLayout;
